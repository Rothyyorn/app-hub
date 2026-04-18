import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const targetUrl = req.query.url as string;
  
  if (!targetUrl) {
    return res.status(400).send("URL is required");
  }

  // Skip lists for domains that shouldn't be proxied (Auth, Tracking, etc.)
  const skipDomains = ['accounts.google.com', 'google-analytics.com', 'googletagmanager.com', 'facebook.com/tr/'];
  if (skipDomains.some(d => targetUrl.includes(d))) {
    return res.status(204).end(); // No content for blocked/skipped domains
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    // Pass browser cookies to the target site
    const requestHeaders: any = {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
      "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8",
      "Accept-Language": "en-US,en;q=0.9",
      "Referer": targetUrl,
      "Sec-Fetch-Dest": "document",
      "Sec-Fetch-Mode": "navigate",
      "Sec-Fetch-Site": "cross-site",
      "Upgrade-Insecure-Requests": "1"
    };

    if (req.headers.cookie) {
      requestHeaders["Cookie"] = req.headers.cookie;
    }

    const response = await fetch(targetUrl, {
      signal: controller.signal,
      headers: requestHeaders,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`Fetch failed for: ${targetUrl} [Status: ${response.status}]`);
      throw new Error(`Target responded with status: ${response.status}`);
    }

    // Handle Set-Cookie headers for session persistence
    const setCookieHeader = (response.headers as any).getSetCookie?.() || [];
    if (setCookieHeader && setCookieHeader.length > 0) {
      const rewrittenCookies = setCookieHeader.map((cookie: string) => {
        // Force SameSite=None and Secure for iframe compatibility
        let c = cookie.replace(/SameSite=[^;]+/gi, 'SameSite=None');
        if (!c.toLowerCase().includes('samesite')) c += '; SameSite=None';
        if (!c.toLowerCase().includes('secure')) c += '; Secure';
        // Strip domain to force cookie onto our proxy domain
        c = c.replace(/Domain=[^;]+/gi, '');
        return c;
      });
      res.setHeader("Set-Cookie", rewrittenCookies);
    }

    const contentType = response.headers.get("content-type") || "text/html";
    
    // We only want to rewrite and send the body if it's HTML
    if (contentType.includes("text/html")) {
      let body = await response.text();

      // 1. Remove security headers that prevent iframing
      body = body.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi, '');
      body = body.replace(/<meta http-equiv="X-Frame-Options"[^>]*>/gi, '');

      // 3. SEC Universal Compatibility Script
      const baseTag = `<base href="${targetUrl}">`;
      const automationScript = `
        <script>
          (function() {
            const PROXY_URL = window.location.origin + '/api/proxy?url=';

            // 0. Immediate CSS Injection (Surgical Zero-Wall)
            const style = document.createElement('style');
            style.innerHTML = '[class*="modal-backdrop"], [class*="modal_backdrop"], [class*="fade-background"], [id*="age-gate"], [class*="age-gate"], [id*="verification-modal"], [class*="verification-modal"], .join-modal, .registration-modal, .login-modal, [class*="nudge-container"], [id*="nudge-container"], [style*="z-index: 2147483647"], [style*="z-index: 1000000"] { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; } html, body { overflow: auto !important; height: auto !important; position: static !important; }';
            document.head ? document.head.appendChild(style) : document.documentElement.appendChild(style);

            // 1. Prevent Frame Busting
            try {
              Object.defineProperty(window, 'top', { get: function() { return window.self; } });
              window.onbeforeunload = function() { return null; };
            } catch(e) {}

            // 2. NETWORK INTERCEPTOR
            const originalFetch = window.fetch;
            window.fetch = function(input, init) {
              if (typeof input === 'string' && !input.includes('/api/proxy') && !input.startsWith('data:')) {
                const absoluteUrl = new URL(input, document.baseURI).href;
                input = PROXY_URL + encodeURIComponent(absoluteUrl);
              }
              return originalFetch.call(this, input, init);
            };

            const originalOpen = XMLHttpRequest.prototype.open;
            XMLHttpRequest.prototype.open = function(method, url) {
              if (typeof url === 'string' && !url.includes('/api/proxy') && !url.startsWith('data:')) {
                const absoluteUrl = new URL(url, document.baseURI).href;
                url = PROXY_URL + encodeURIComponent(absoluteUrl);
              }
              return originalOpen.apply(this, arguments);
            };

            // 3. Auto-Accept Age Verification
            const sessionKey = 'sec_age_accepted_' + btoa(window.location.hostname);
            function showAutomationBadge(text) {
              const badge = document.createElement('div');
              badge.style.cssText = 'position:fixed;top:10px;left:10px;z-index:100000;background:#FF5E00;color:white;padding:6px 12px;border-radius:8px;font:bold 10px sans-serif;text-transform:uppercase;letter-spacing:1px;box-shadow:0 4px 12px rgba(255,94,0,0.3);pointer-events:none;animation:secSlideIn 0.3s ease-out;';
              badge.innerText = 'SEC AUTO-ACCEPTED: ' + text;
              document.body.appendChild(badge);
              const style = document.createElement('style');
              style.innerHTML = '@keyframes secSlideIn{from{transform:translateY(-20px);opacity:0}to{transform:translateY(0);opacity:1}}';
              document.head.appendChild(style);
              setTimeout(() => {
                badge.style.opacity = '0';
                badge.style.transition = 'opacity 0.5s';
                setTimeout(() => badge.remove(), 500);
              }, 3000);
            }

            function autoAccept() {
              if (sessionStorage.getItem(sessionKey)) return true;
              
              const keywords = [
                "I'M 18", "I AM 18", "ENTER", "CONFIRM AGE", "AGREE", "OLDER THAN 18", 
                "YES", "PROCEED", "I AM AT LEAST 18", "I AGREE", "ENTER SITE", "ADULT CONTENT",
                "I'M OVER 18", "I AM OVER 18", "YES, I AM", "CONTINUE TO SITE",
                "STAY AS GUEST", "NO THANKS", "SKIP", "CLOSE", "NOT NOW"
              ];
              
              const buttons = Array.from(document.querySelectorAll('button, a, div[role="button"], span, input[type="button"], input[type="submit"], svg'));
              
              for (const btn of buttons) {
                const text = (btn.innerText || btn.textContent || btn.value || "").trim().toUpperCase();
                // Special handling for common X icons or small close buttons
                const isCloseIcon = btn.tagName === 'SVG' || btn.querySelector('svg');
                
                if (keywords.some(k => text === k || text.includes(k)) || (isCloseIcon && btn.classList.contains('close'))) {
                  try {
                    // Only set session storage for real age gates, not temporary popups
                    if (text.includes('18') || text.includes('ENTER') || text.includes('AGREE')) {
                      sessionStorage.setItem(sessionKey, 'true');
                      showAutomationBadge(text || "GATE DISMISSED");
                    }
                    
                    btn.click();
                    const clickEvent = new MouseEvent('click', { view: window, bubbles: true, cancelable: true });
                    btn.dispatchEvent(clickEvent);
                    return true;
                  } catch(e) {}
                }
              }
              return false;
            }

            // 4. Navigation & Mutation Tracking
            function rewriteLink(a) {
              if (!a || !a.href) return;
              if (a.href.includes('/api/proxy') || a.href.startsWith('data:') || a.href.startsWith('javascript:')) return;
              a.href = PROXY_URL + encodeURIComponent(a.href);
              a.target = '_self';
            }

            const observer = new MutationObserver((mutations) => {
              mutations.forEach(m => m.addedNodes.forEach(n => {
                if (n.nodeType === 1) {
                  if (n.tagName === 'A') rewriteLink(n);
                  n.querySelectorAll('a').forEach(rewriteLink);
                }
              }));
            });

            window.addEventListener('DOMContentLoaded', () => {
              autoAccept();
              document.querySelectorAll('a').forEach(rewriteLink);
              observer.observe(document.body, { childList: true, subtree: true });

              // Proactive Wall-Cleaner: Removes late-injected modals every 1s
              setInterval(() => {
                const walls = document.querySelectorAll('.join-modal, .registration-modal, .login-modal, [class*="AuthModal"], [id*="AuthModal"], .modal-backdrop, .verification-modal, .age-gate');
                walls.forEach(w => w.remove());
                
                // Surgical Deep-Kill: Only target elements that look like centered popups or full-screen walls
                Array.from(document.body.children).forEach(child => {
                  if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'MAIN', 'HEADER', 'FOOTER', 'NAV', 'SECTION'].includes(child.tagName)) return;
                  
                  const text = (child.innerText || child.textContent || "").toLowerCase();
                  const isModalContent = text.includes("join xhamster for free") || (text.includes("join") && text.includes("for free") && text.includes("sign up"));
                  
                  if (isModalContent) {
                    // Check if it's likely a modal (short text, high z-index, or fixed position)
                    const style = window.getComputedStyle(child);
                    const isFixed = style.position === 'fixed' || style.position === 'absolute';
                    
                    if (isFixed || text.length < 2000) {
                      child.style.display = 'none';
                      child.style.visibility = 'hidden';
                    }
                  }
                });

                if (document.body.style.overflow === 'hidden' || document.documentElement.style.overflow === 'hidden') {
                  document.body.style.overflow = 'auto';
                  document.documentElement.style.overflow = 'auto';
                  document.body.style.height = 'auto';
                  document.body.style.position = 'static';
                }
              }, 1000);
            });
            setInterval(autoAccept, 500);
          })();
        </script>
      `;
      body = body.replace(/<head>/i, `<head>${automationScript}${baseTag}`);

      // 3.5 Robust Attribute Rewriting
      const proxyPrefix = `/api/proxy?url=`;
      const origin = new URL(targetUrl).origin;
      const currentPath = targetUrl.substring(0, targetUrl.lastIndexOf('/') + 1);
      
      body = body.replace(/(href|src|srcset|poster|action|data-src|data-video)=["']([^"']+)["']/gi, (match, attr, url) => {
        if (url.startsWith('data:') || url.includes('/api/proxy') || url.startsWith('#') || url.startsWith('javascript:')) return match;
        let absoluteUrl = url;
        if (url.startsWith('//')) absoluteUrl = 'https:' + url;
        else if (url.startsWith('/')) absoluteUrl = origin + url;
        else if (!url.startsWith('http')) absoluteUrl = currentPath + url;
        return `${attr}="${proxyPrefix}${encodeURIComponent(absoluteUrl)}"`;
      });

      // 4. Force all links and forms to stay in-frame
      body = body.replace(/target="_blank"/gi, 'target="_self"');
      body = body.replace(/window\.open\(/g, '(function(){return null;})(');

      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Security-Policy", "");
      res.setHeader("X-Frame-Options", "");
      return res.send(body);
    } else {
      res.setHeader("Content-Type", contentType);
      const buffer = await response.arrayBuffer();
      return res.send(Buffer.from(buffer));
    }
  } catch (error: any) {
    console.error("Proxy error:", error);
    return res.status(500).send("Proxy error: " + error.message);
  }
}

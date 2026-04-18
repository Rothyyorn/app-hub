import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Proxy endpoint to bypass X-Frame-Options
  app.get("/api/proxy", async (req, res) => {
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
      const setCookieHeader = response.headers.getSetCookie();
      if (setCookieHeader && setCookieHeader.length > 0) {
        const rewrittenCookies = setCookieHeader.map(cookie => {
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

        // 1. Remove security headers that prevent iframing (in the HTML meta tags if any)
        body = body.replace(/<meta http-equiv="Content-Security-Policy"[^>]*>/gi, '');
        body = body.replace(/<meta http-equiv="X-Frame-Options"[^>]*>/gi, '');

        // 3. SEC Universal Compatibility Script
        const baseTag = `<base href="${targetUrl}">`;
        const automationScript = `
          <script>
            (function() {
              const PROXY_URL = window.location.origin + '/api/proxy?url=';

              // 0. Immediate CSS Injection (Zero-Wall)
              const style = document.createElement('style');
              style.innerHTML = 'div[class*="modal"], div[class*="overlay"], div[id*="modal"], div[id*="overlay"], .join-modal, .registration-modal, .login-modal, #age-verification-container, .age-gate, div[class*="popup"], div[id*="popup"], .modal-dialog, .modal-backdrop, .nudge-container, [class*="AuthModal"], [id*="AuthModal"], div[style*="z-index: 2147483647"] { display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; } html, body { overflow: auto !important; height: auto !important; position: static !important; }';
              document.head ? document.head.appendChild(style) : document.documentElement.appendChild(style);

              // 1. Prevent Frame Busting
              try {
                Object.defineProperty(window, 'top', { get: function() { return window.self; } });
                window.onbeforeunload = function() { return null; };
              } catch(e) {}

              // 2. NETWORK INTERCEPTOR (Proxies background requests)
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

              // 3. Auto-Accept Age Verification (Secured & Hardened)
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
                    
                    // Fallback if click() doesn't trigger native listeners
                    const clickEvent = new MouseEvent('click', {
                      view: window,
                      bubbles: true,
                      cancelable: true
                    });
                    btn.dispatchEvent(clickEvent);
                    
                    console.log("SEC: Auto-accepted gate for " + window.location.hostname);
                    return true;
                  } catch(e) {
                    console.error("SEC Proxy: Auto-click failed", e);
                  }
                }
              }
              return false;
            }

              // 4. Navigation & Tab Locking + Mutation Tracking
              function rewriteLink(a) {
                if (!a || !a.href) return;
                if (a.href.includes('/api/proxy') || a.href.startsWith('data:') || a.href.startsWith('javascript:')) return;
                a.dataset.originalHref = a.href;
                a.href = PROXY_URL + encodeURIComponent(a.href);
                a.target = '_self';
              }

              function lockAndRewrite() {
                document.querySelectorAll('a').forEach(rewriteLink);
                document.querySelectorAll('form').forEach(f => {
                  if (f.action && !f.action.includes('/api/proxy')) {
                    f.action = PROXY_URL + encodeURIComponent(f.action);
                  }
                });
              }

              // Intercept all clicks as a fallback
              document.addEventListener('click', function(e) {
                const a = e.target.closest('a');
                if (a && a.href && !a.href.includes('/api/proxy')) {
                  e.preventDefault();
                  window.location.href = PROXY_URL + encodeURIComponent(a.href);
                }
              }, true);

              const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                  mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                      if (node.tagName === 'A') rewriteLink(node);
                      node.querySelectorAll('a').forEach(rewriteLink);
                    }
                  });
                });
              });

              window.addEventListener('DOMContentLoaded', () => {
                autoAccept();
                lockAndRewrite();
                observer.observe(document.body, { childList: true, subtree: true });

                // Proactive Wall-Cleaner: Removes late-injected modals every 1s
                setInterval(() => {
                  const walls = document.querySelectorAll('.join-modal, .registration-modal, .login-modal, [class*="AuthModal"], [id*="AuthModal"], .modal-backdrop');
                  walls.forEach(w => w.remove());
                  if (document.body.style.overflow === 'hidden') {
                    document.body.style.overflow = 'auto';
                    document.body.style.height = 'auto';
                  }
                }, 1000);
              });
              
              const interval = setInterval(autoAccept, 500);
              setTimeout(() => clearInterval(interval), 15000);
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
          if (url.startsWith('//')) {
            absoluteUrl = 'https:' + url;
          } else if (url.startsWith('/')) {
            absoluteUrl = origin + url;
          } else if (!url.startsWith('http')) {
            absoluteUrl = currentPath + url;
          }
          
          return `${attr}="${proxyPrefix}${encodeURIComponent(absoluteUrl)}"`;
        });

        // 4. Force all links and forms to stay in-frame
        body = body.replace(/target="_blank"/gi, 'target="_self"');
        body = body.replace(/window\.open\(/g, '(function(){return null;})(');

        res.set("Content-Type", contentType);
        res.removeHeader("Content-Security-Policy");
        res.removeHeader("X-Frame-Options");
        res.removeHeader("Frame-Options");
        res.send(body);
      } else {
        // For non-HTML (images, css, js), return the raw buffer
        res.set("Content-Type", contentType);
        res.removeHeader("Content-Security-Policy");
        res.removeHeader("X-Frame-Options");
        res.removeHeader("Frame-Options");
        const buffer = await response.arrayBuffer();
        res.send(Buffer.from(buffer));
      }
    } catch (error: any) {
      console.error("Proxy error:", error);
      
      // If it's not a primary document request (e.g., fetch, xhr, image), avoid sending full HTML error
      const acceptHeader = req.headers.accept || '';
      if (!acceptHeader.includes('text/html')) {
        return res.status(error.status || 500).end();
      }

      const isDnsError = error.code === 'ENOTFOUND' || error.message?.includes('getaddrinfo');
      const errorMessage = isDnsError 
        ? "We couldn't find this website on the network. It might be down or restricted."
        : "Our high-speed proxy encountered an issue while trying to fetch this secured content.";

      res.status(500).send(`
        <div style="background: #0D0D0D; color: white; height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: sans-serif; text-align: center; padding: 20px; box-sizing: border-box;">
          <div style="width: 80px; height: 80px; background: rgba(255, 94, 0, 0.1); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-bottom: 24px;">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF5E00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          </div>
          <h1 style="color: white; margin: 0 0 10px 0; font-size: 24px; font-weight: 800; letter-spacing: -0.5px;">Connection Issue</h1>
          <p style="opacity: 0.5; max-width: 400px; line-height: 1.6; margin: 0 0 8px 0; font-size: 14px; font-weight: 500;">${errorMessage}</p>
          <code style="display: block; background: rgba(255,255,255,0.05); padding: 8px 12px; border-radius: 8px; font-size: 10px; color: #FF5E00; margin-bottom: 24px; max-width: 300px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${targetUrl}</code>
          <a href="${targetUrl}" target="_blank" style="background: #FF5E00; color: white; text-decoration: none; padding: 16px 32px; border-radius: 14px; font-weight: bold; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; box-shadow: 0 10px 20px rgba(255, 94, 0, 0.2); transition: transform 0.2s;">Open Directly</a>
        </div>
      `);
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();

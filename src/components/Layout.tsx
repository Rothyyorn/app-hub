import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, Github, Twitter, Mail } from 'lucide-react';
import { cn } from '../lib/utils';

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Apps', path: '/' },
    { name: 'About', path: '#' },
  ];

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-white font-sans selection:bg-primary selection:text-white">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2 group">
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl rotate-3 group-hover:rotate-0 transition-transform">
                  A
                </div>
                <span className="text-xl font-bold tracking-tight">
                  App Hub<span className="text-primary">.</span>
                </span>
              </Link>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "text-sm font-bold uppercase tracking-widest transition-colors relative py-2",
                    location.pathname === link.path 
                      ? "text-primary after:absolute after:bottom-0 after:left-0 after:w-full after:h-0.5 after:bg-primary" 
                      : "text-white/40 hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <button className="bg-primary text-white p-2.5 rounded-xl shadow-lg shadow-primary/20 hover:scale-105 transition-transform">
                <Search size={18} />
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 text-primary hover:bg-primary/5 rounded-xl transition-colors"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="md:hidden bg-[#0D0D0D] border-b border-white/5 animate-in fade-in slide-in-from-top-4 duration-200">
            <div className="px-4 pt-2 pb-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-lg font-bold py-2 border-b border-white/5 text-white/80 hover:text-white transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className={cn(
        "mx-auto px-4 sm:px-6 lg:px-8 py-12",
        location.pathname === '/' ? "max-w-none px-0 py-0" : "max-w-7xl"
      )}>
        {children}
      </main>
    </div>
  );
}


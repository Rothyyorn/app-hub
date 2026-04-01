import { ExternalLink } from 'lucide-react';

interface AdBannerProps {
  title?: string;
  description?: string;
  ctaText?: string;
  ctaUrl?: string;
  variant?: 'primary' | 'secondary';
}

export default function AdBanner({ 
  title = "Advertise with us", 
  description = "Reach thousands of developers and designers every day.", 
  ctaText = "Get in touch", 
  ctaUrl = "#",
  variant = 'secondary'
}: AdBannerProps) {
  return (
    <div className={`relative overflow-hidden rounded-[2.5rem] p-8 md:p-12 border border-white/5 ${variant === 'primary' ? 'bg-primary text-white' : 'bg-[#1A1A1A] text-white'}`}>
      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="space-y-4 text-center md:text-left">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-[10px] uppercase tracking-[0.2em] font-bold">
            <span>Sponsored</span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h3>
          <p className={`text-sm max-w-md ${variant === 'primary' ? 'text-white/70' : 'text-white/50'}`}>
            {description}
          </p>
        </div>
        <a 
          href={ctaUrl}
          className={`inline-flex items-center space-x-3 px-8 py-4 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all shadow-xl ${variant === 'primary' ? 'bg-white text-primary hover:bg-secondary' : 'bg-primary text-white hover:bg-primary/80 shadow-primary/20'}`}
        >
          <span>{ctaText}</span>
          <ExternalLink size={14} />
        </a>
      </div>
      
      {/* Abstract shapes */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />
    </div>
  );
}

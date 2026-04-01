import { Post } from '../types';

// Import markdown content as raw strings using Vite's ?raw suffix
import futureOfWebMd from '../content/posts/future-of-web.md?raw';
import masteringTailwindMd from '../content/posts/mastering-tailwind.md?raw';
import minimalismUiMd from '../content/posts/minimalism-ui.md?raw';
import portfolioMd from '../content/posts/portfolio.md?raw';

export const posts: Post[] = [
  {
    id: 'explore-web',
    title: 'Explore the Web',
    excerpt: 'A curated selection of the most innovative and inspiring web applications from across the internet.',
    content: 'This app allows you to browse and interact with external web content directly within our hub. We curate the best tools, portfolios, and experiments for you to discover.',
    date: '2026-03-28',
    category: 'Discovery',
    readTime: 'Interactive',
    coverImage: 'https://picsum.photos/seed/web/1200/630',
    externalUrl: 'https://www.google.com/search?q=web+design+inspiration&igu=1'
  },
  {
    id: 'featured-portfolio',
    title: 'Featured Portfolio',
    excerpt: 'A professional portfolio showcasing a collection of high-performance web applications.',
    content: portfolioMd,
    date: '2026-03-30',
    category: 'Portfolio',
    readTime: '5 min read',
    coverImage: 'https://picsum.photos/seed/portfolio/1200/630',
  },
  {
    id: 'ai-studio',
    title: 'Google AI Studio',
    excerpt: 'A fast way to build with Gemini, Google\'s most capable AI models.',
    content: 'Google AI Studio is a web-based tool for prototyping with Gemini models. It allows you to quickly test prompts and build applications with generative AI.',
    date: '2026-03-25',
    category: 'AI Tool',
    readTime: 'Interactive',
    coverImage: 'https://picsum.photos/seed/ai/1200/630',
    externalUrl: 'https://aistudio.google.com/'
  },
  {
    id: 'tailwind-docs',
    title: 'Tailwind CSS Documentation',
    excerpt: 'Rapidly build modern websites without ever leaving your HTML.',
    content: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.',
    date: '2026-03-20',
    category: 'Documentation',
    readTime: 'Reference',
    coverImage: 'https://picsum.photos/seed/tailwind/1200/630',
    externalUrl: 'https://tailwindcss.com/docs'
  }
];


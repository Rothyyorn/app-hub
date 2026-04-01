import { Post } from '../types';

// Import markdown content as raw strings using Vite's ?raw suffix
import futureOfWebMd from '../content/posts/future-of-web.md?raw';
import masteringTailwindMd from '../content/posts/mastering-tailwind.md?raw';
import minimalismUiMd from '../content/posts/minimalism-ui.md?raw';
import portfolioMd from '../content/posts/portfolio.md?raw';

export const posts: Post[] = [
  
  {
    id: 'Viral',
    title: '',
    excerpt: '',
    content: portfolioMd,
    date: '2026-03-30',
    category: 'Viral',
    readTime: '5M Videos',
    coverImage: 'https://picsum.photos/seed/portfolio/1200/630',
    videoUrl: 'https://cdn2.magixz.com/AlterPinay/Jerriel_Cry4zee/Jerriel_Cry4zee_21.mp4',
    displayMode: 'video'
  },
  // {
  //   id: 'ai-studio',
  //   title: 'Google AI Studio',
  //   excerpt: 'A fast way to build with Gemini, Google\'s most capable AI models.',
  //   content: 'Google AI Studio is a web-based tool for prototyping with Gemini models. It allows you to quickly test prompts and build applications with generative AI.',
  //   date: '2026-03-25',
  //   category: 'AI Tool',
  //   readTime: 'Interactive',
  //   coverImage: 'https://picsum.photos/seed/ai/1200/630',
  //   videoUrl: 'https://cdn2.magixz.com/AlterPinay/Jerriel_Cry4zee/Jerriel_Cry4zee_21.mp4',
  //   externalUrl: 'https://aistudio.google.com/',
  //   displayMode: 'iframe'
  // },
  // {
  //   id: 'tailwind-docs',
  //   title: 'Tailwind CSS Documentation',
  //   excerpt: 'Rapidly build modern websites without ever leaving your HTML.',
  //   content: 'Tailwind CSS is a utility-first CSS framework for rapidly building custom user interfaces.',
  //   date: '2026-03-20',
  //   category: 'Documentation',
  //   readTime: 'Reference',
  //   coverImage: 'https://picsum.photos/seed/tailwind/1200/630',
  //   videoUrl: 'https://cdn2.magixz.com/AlterPinay/Jerriel_Cry4zee/Jerriel_Cry4zee_21.mp4',
  //   externalUrl: 'https://tailwindcss.com/docs',
  //   displayMode: 'image'
  // },
  // {
  //   id: 'future-of-web',
  //   title: 'The Future of Web Development',
  //   excerpt: 'Exploring the next generation of web technologies and how they will shape our digital experiences.',
  //   content: futureOfWebMd,
  //   date: '2026-03-15',
  //   category: 'Technology',
  //   readTime: '8 min read',
  //   coverImage: 'https://picsum.photos/seed/future/1200/630',
  //   videoUrl: 'https://cdn2.magixz.com/AlterPinay/Jerriel_Cry4zee/Jerriel_Cry4zee_21.mp4',
  //   displayMode: 'video'
  // },
  // {
  //   id: 'mastering-tailwind',
  //   title: 'Mastering Tailwind CSS',
  //   excerpt: 'A deep dive into advanced Tailwind CSS techniques for building high-performance user interfaces.',
  //   content: masteringTailwindMd,
  //   date: '2026-03-10',
  //   category: 'Development',
  //   readTime: '12 min read',
  //   coverImage: 'https://picsum.photos/seed/mastering/1200/630',
  //   videoUrl: 'https://cdn2.magixz.com/AlterPinay/Jerriel_Cry4zee/Jerriel_Cry4zee_21.mp4',
  //   displayMode: 'video'
  // },
  // {
  //   id: 'minimalism-ui',
  //   title: 'Minimalism in UI Design',
  //   excerpt: 'Why less is more when it comes to creating effective and engaging user interfaces.',
  //   content: minimalismUiMd,
  //   date: '2026-03-05',
  //   category: 'Design',
  //   readTime: '6 min read',
  //   coverImage: 'https://picsum.photos/seed/minimalism/1200/630',
  //   videoUrl: 'https://cdn2.magixz.com/AlterPinay/Jerriel_Cry4zee/Jerriel_Cry4zee_21.mp4',
  //   displayMode: 'video'
  // }
];


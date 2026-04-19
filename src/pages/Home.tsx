import { useMemo } from 'react';
import { posts } from '../data/posts';
import PostCard from '../components/PostCard';
import AdBanner from '../components/AdBanner';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  const randomizedPosts = useMemo(() => {
    return [...posts].sort(() => Math.random() - 0.5);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-12"
    >
      <Helmet>
        <title>SexHub VLXX | Best Sex Video, Porn, VLXX, and XVideo Collection</title>
        <meta name="description" content="Discover the most popular sex videos, porn content, VLXX, and XVideo favorites on SexHub VLXX." />
        <meta name="keywords" content="sex video, porn video, vlxx, xvideo, viral video, adult hub, premium porn" />
      </Helmet>
      {/* Grid Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-[9px] uppercase tracking-[0.4em] font-bold text-primary">Featured Apps</h2>
            <p className="text-base font-bold tracking-tight">Latest from the Hub</p>
          </div>
          <Link to="/" className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-full hover:bg-white/10 hover:text-white transition-all">
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-1 md:gap-2">
          {randomizedPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
            >
              <PostCard post={post} />
            </motion.div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}


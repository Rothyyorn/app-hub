import { posts } from '../data/posts';
import PostCard from '../components/PostCard';
import AdBanner from '../components/AdBanner';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet-async';

export default function Home() {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-32"
    >
      <Helmet>
        <title>Viral Hub | Jerriel Cry4zee (Zyan Cabrera)</title>
        <meta name="description" content="Latest viral videos and social media trends. Featuring Jerriel Cry4zee (Zyan Cabrera) and more." />
      </Helmet>
      {/* Grid Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">Featured Apps</h2>
            <p className="text-2xl font-bold tracking-tight">Latest from the Hub</p>
          </div>
          <Link to="/" className="flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-full hover:bg-white/10 hover:text-white transition-all">
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
          {posts.map((post, index) => (
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


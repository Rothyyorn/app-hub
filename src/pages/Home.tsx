import { posts } from '../data/posts';
import PostCard from '../components/PostCard';
import AdBanner from '../components/AdBanner';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export default function Home() {
  const featuredPost = posts[0];
  const remainingPosts = posts.slice(1);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="space-y-32"
    >
      {/* Hero Section */}
      <section className="relative space-y-16">
        
        <AdBanner 
          title="Build your next project with us" 
          description="We specialize in high-performance web applications and exceptional user interfaces. Let's create something extraordinary together."
          ctaText="Start a Project"
          ctaUrl="#"
        />

        {featuredPost && <PostCard post={featuredPost} featured={true} />}
      </section>

      {/* Grid Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="space-y-1">
            <h2 className="text-[10px] uppercase tracking-[0.4em] font-bold text-primary">Featured Apps</h2>
            <p className="text-2xl font-bold tracking-tight">Latest from the Hub</p>
          </div>
          <Link to="/" className="hidden sm:flex items-center space-x-2 text-[10px] font-bold uppercase tracking-widest px-5 py-2.5 bg-white/5 border border-white/10 text-white/60 rounded-full hover:bg-white/10 hover:text-white transition-all">
            <span>View All</span>
            <ArrowRight size={12} />
          </Link>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {remainingPosts.map((post, index) => (
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


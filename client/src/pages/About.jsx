import { motion } from 'framer-motion';
import { 
  Sparkles, Users, Target, Zap, Heart, Award,
  BookOpen, Wrench, MessageSquare, Shield
} from 'lucide-react';

export default function About() {
  const values = [
    { icon: Target, title: 'Mission-Driven', description: 'Making AI education accessible to everyone, everywhere.' },
    { icon: Heart, title: 'User-Focused', description: 'Building tools and courses that truly help learners succeed.' },
    { icon: Shield, title: 'Quality First', description: 'Curating only the best AI tools and educational content.' },
    { icon: Zap, title: 'Innovation', description: 'Staying at the forefront of AI technology and education.' },
  ];

  const features = [
    { icon: MessageSquare, title: '24/7 AI Chat', description: 'Get instant help with our AI assistant' },
    { icon: BookOpen, title: '50+ Courses', description: 'From beginner to advanced AI topics' },
    { icon: Wrench, title: '70+ AI Tools', description: 'Curated directory of the best AI tools' },
    { icon: Sparkles, title: '50+ AI Prompts', description: 'Ready-to-use prompts for any task' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-custom max-w-5xl">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
            <Sparkles className="w-4 h-4" />
            About Us
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            Your Gateway to{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
              AI Mastery
            </span>
          </h1>
          
          <p className="text-xl max-w-3xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            AI Super Hub is a comprehensive platform designed to help you explore, learn, and master 
            artificial intelligence through curated tools, expert courses, and hands-on practice.
          </p>
        </motion.div>

        {/* Mission Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card mb-12"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center flex-shrink-0">
              <Target className="w-6 h-6 text-black" />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                Our Mission
              </h2>
              <p className="text-lg" style={{ color: 'var(--color-text-secondary)' }}>
                To democratize AI education and make cutting-edge artificial intelligence accessible 
                to learners worldwide, regardless of their background or experience level.
              </p>
            </div>
          </div>
        </motion.div>

        {/* What We Offer */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--color-text)' }}>
            What We Offer
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                  className="card group hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Icon className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                        {feature.title}
                      </h3>
                      <p style={{ color: 'var(--color-text-secondary)' }}>
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: 'var(--color-text)' }}>
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="card"
                >
                  <div className="flex items-start gap-4">
                    <div 
                      className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
                    >
                      <Icon className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                        {value.title}
                      </h3>
                      <p style={{ color: 'var(--color-text-secondary)' }}>
                        {value.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Team/Community Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="card text-center"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mx-auto mb-6">
            <Users className="w-8 h-8 text-black" />
          </div>
          <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Join Our Growing Community
          </h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Thousands of learners, developers, and AI enthusiasts are already using AI Super Hub 
            to accelerate their AI journey. Start learning today!
          </p>
          <div className="flex justify-center gap-4 text-center">
            <div>
              <p className="text-3xl font-bold" style={{ color: 'var(--color-primary)' }}>10K+</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Active Users</p>
            </div>
            <div className="w-px bg-[var(--color-border)]" />
            <div>
              <p className="text-3xl font-bold text-purple-400">120+</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Resources</p>
            </div>
            <div className="w-px bg-[var(--color-border)]" />
            <div>
              <p className="text-3xl font-bold text-cyan-400">99.9%</p>
              <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Uptime</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

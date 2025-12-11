import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Sparkles, MessageSquare, BookOpen, Wrench, Zap, 
  ArrowRight, Bot, Brain, Code, Lightbulb, Shield, Users,
  Play, ChevronRight, Rocket, Check
} from 'lucide-react';
import Button from '../components/ui/Button';
import AnimatedBackground from '../components/common/AnimatedBackground';
import GlowingCard from '../components/common/GlowingCard';
import TypewriterText, { GradientText, TextReveal } from '../components/common/TypewriterText';
import Marquee from '../components/common/Marquee';
import HelperChatBot from '../components/common/HelperChatBot';
import PromptLibraryShowcase from '../components/PromptLibraryShowcase';
import { toolsAPI } from '../services/api';

// Features data
const features = [
  {
    icon: MessageSquare,
    title: 'AI Chat Hub',
    description: 'Chat with advanced AI models. Get instant answers, code help, and creative assistance.',
    color: '#00E3A5',
    colorEnd: '#10B981',
    href: '/chat',
    stat: '24/7',
    statLabel: 'Available'
  },
  {
    icon: BookOpen,
    title: 'Learn AI',
    description: 'Master artificial intelligence with expert courses, tutorials, and hands-on projects.',
    color: '#4FC3F7',
    colorEnd: '#0EA5E9',
    href: '/courses',
    stat: '50+',
    statLabel: 'Courses'
  },
  {
    icon: Wrench,
    title: 'AI Tools Directory',
    description: 'Discover 70+ curated AI tools. From image generation to code assistants.',
    color: '#A855F7',
    colorEnd: '#7C3AED',
    href: '/tools',
    stat: '70+',
    statLabel: 'Tools'
  },
];

// Stats data
const stats = [
  { value: '70+', label: 'AI Tools' },
  { value: '50+', label: 'Courses' },
  { value: '10K+', label: 'Users' },
  { value: '99.9%', label: 'Uptime' },
];

// Benefits data
const benefits = [
  { icon: Zap, title: 'Lightning Fast', description: 'Optimized for speed with instant AI responses' },
  { icon: Shield, title: 'Enterprise Security', description: 'Your data is encrypted and protected' },
  { icon: Users, title: 'Growing Community', description: 'Join thousands of AI enthusiasts' },
  { icon: Lightbulb, title: 'Always Learning', description: 'New courses and tools added weekly' },
];

// Tool categories for marquee with WORKING logos (verified)
const toolCategories = [
  { 
    name: 'ChatGPT', 
    logo: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/openai.png',
    fallbackIcon: 'Ã°Å¸"™Â¬'
  },
  { 
    name: 'Claude', 
    logo: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/claude-color.png',
    fallbackIcon: 'Ã°Å¸Â¤"“'
  },
  { 
    name: 'Midjourney', 
    logo: 'https://cdn.brandfetch.io/id6BaRNwLK/theme/dark/logo.png',
    fallbackIcon: 'Ã°Å¸Å½Â¨'
  },
  { 
    name: 'Perplexity', 
    logo: 'https://registry.npmmirror.com/@lobehub/icons-static-png/latest/files/dark/perplexity-color.png',
    fallbackIcon: 'Ã°Å¸"Â'
  },
  { 
    name: 'Runway', 
    logo: 'https://cdn.brandfetch.io/idLvh7bwwE/theme/dark/logo.png',
    fallbackIcon: 'Ã°Å¸Å½Â¬'
  },
  { 
    name: 'Synthesia', 
    logo: 'https://cdn.brandfetch.io/idiJPmcbAq/theme/dark/logo.png',
    fallbackIcon: 'Ã°Å¸Å½Â¥'
  },
  { 
    name: 'Canva AI', 
    logo: 'https://cdn.brandfetch.io/id-kPzoKvH/theme/dark/logo.png',
    fallbackIcon: 'Ã°Å¸Å½Â¨'
  },
  { 
    name: 'Jasper', 
    logo: 'https://cdn.brandfetch.io/idnpAKbxpj/theme/dark/logo.png',
    fallbackIcon: 'Ã¢Å“ÂÃ¯Â¸Â'
  },
  { 
    name: 'Copy.ai', 
    logo: 'https://cdn.brandfetch.io/idMzQ4z5p3/theme/dark/logo.png',
    fallbackIcon: 'Ã°Å¸"Â'
  },
  { 
    name: 'Zapier', 
    logo: 'https://cdn.brandfetch.io/idSUrLOa5l/theme/dark/logo.png',
    fallbackIcon: 'Ã¢Å¡Â¡'
  },
  { 
    name: 'Replit', 
    logo: 'https://cdn.brandfetch.io/idq0GfGJ_w/theme/dark/logo.png',
    fallbackIcon: 'Ã°Å¸"™Â»'
  },
  { 
    name: 'Descript', 
    logo: 'https://cdn.brandfetch.io/idqR0Bsrge/theme/dark/logo.png',
    fallbackIcon: 'Ã°Å¸Å½Âµ'
  },
];

export default function Home() {
  const [featuredTools, setFeaturedTools] = useState([]);

  useEffect(() => {
    // Load tools from API (featured or all if no featured tools)
    const loadFeaturedTools = async () => {
      try {
        // First try to get featured tools
        let response = await toolsAPI.getAll({ limit: 20, featured: true });
        let tools = response.data.data.tools || [];
        
        // If no featured tools, get any tools
        if (tools.length === 0) {
          response = await toolsAPI.getAll({ limit: 20 });
          tools = response.data.data.tools || [];
        }
        
        console.log('Loaded tools for slider:', tools);
        setFeaturedTools(tools);
      } catch (error) {
        console.error('Failed to load tools for slider:', error);
        setFeaturedTools([]);
      }
    };

    loadFeaturedTools();
  }, []);

  return (
    <div className="relative overflow-hidden">
      {/* Animated Background */}
      <AnimatedBackground variant="hero" />

      {/* ==================== HERO SECTION ==================== */}
      <section className="relative container-custom pt-20 lg:pt-32 pb-20">
        <div className="text-center max-w-5xl mx-auto">
          
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8"
            style={{
              background: 'rgba(0, 227, 165, 0.1)',
              border: '1px solid rgba(0, 227, 165, 0.2)',
            }}
          >
            <motion.div
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
            >
              <Sparkles className="w-4 h-4 text-primary" />
            </motion.div>
            <span className="text-sm font-medium text-primary">
              Your AI Journey Starts Here
            </span>
            <ChevronRight className="w-4 h-4 text-primary" />
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl lg:text-8xl font-bold tracking-tight mb-6"
          >
            <span style={{ color: 'var(--color-text)' }}>Master the</span>
            <br />
            <GradientText className="text-5xl sm:text-6xl lg:text-8xl font-bold">
              AI Universe
            </GradientText>
          </motion.h1>

          {/* Subheadline with Typewriter */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-xl sm:text-2xl max-w-3xl mx-auto mb-4"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            Explore cutting-edge{' '}
            <TypewriterText 
              words={['AI Tools', 'ML Courses', 'Chatbots', 'Tutorials', 'Resources']}
              className="text-primary font-semibold"
            />
          </motion.p>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg max-w-2xl mx-auto mb-10"
            style={{ color: 'var(--color-text-muted)' }}
          >
            70+ curated tools, expert courses, and AI assistants - all in one powerful platform.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link to="/register">
              <Button size="lg" className="min-w-[200px] btn-glow">
                Start Free Today
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/courses">
              <Button variant="secondary" size="lg" className="min-w-[200px] group">
                <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                Explore Courses
              </Button>
            </Link>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="flex items-center justify-center gap-6 mt-10 flex-wrap"
          >
            {[
              { icon: Check, text: 'Free to Start' },
              { icon: Shield, text: 'Secure & Private' },
              { icon: Zap, text: 'No Credit Card' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                <item.icon className="w-4 h-4 text-primary" />
                <span className="text-sm">{item.text}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="mt-20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6 rounded-2xl glass">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 + index * 0.1 }}
                className="text-center py-4"
              >
                <div className="text-3xl sm:text-4xl font-bold text-gradient mb-1">
                  {stat.value}
                </div>
                <div className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ==================== TOOLS MARQUEE ==================== */}
      <section className="py-12 border-y" style={{ borderColor: 'var(--color-border)' }}>
        <div className="container-custom mb-6">
          <p className="text-center text-sm" style={{ color: 'var(--color-text-muted)' }}>
            Discover and master the best AI tools
          </p>
        </div>
        <Marquee speed={40}>
          {(featuredTools.length > 0 ? featuredTools : toolCategories).map((tool, index) => (
            <div
              key={tool._id || index}
              className="flex items-center gap-3 px-6 py-3 rounded-full mx-2 hover-lift cursor-pointer"
              style={{
                background: 'var(--color-surface)',
                border: '1px solid var(--color-border)',
              }}
            >
              <div className="w-6 h-6 flex items-center justify-center flex-shrink-0">
                {tool.logo ? (
                  <img 
                    src={tool.logo} 
                    alt={tool.name}
                    className="w-6 h-6 object-contain rounded"
                    onError={(e) => {
                      console.log('Logo failed to load:', tool.logo);
                      e.target.onerror = null;
                      e.target.style.display = 'none';
                      const parent = e.target.parentElement;
                      parent.innerHTML = '<svg class="w-5 h-5" style="color: var(--color-primary)" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>';
                    }}
                  />
                ) : (
                  <Wrench className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                )}
              </div>
              <span className="font-medium whitespace-nowrap" style={{ color: 'var(--color-text-secondary)' }}>
                {tool.name}
              </span>
            </div>
          ))}
        </Marquee>
      </section>

      {/* ==================== FEATURES SECTION ==================== */}
      <section className="container-custom py-24">
        <TextReveal>
          <div className="text-center mb-16">
            <span className="text-sm font-semibold text-primary mb-4 block tracking-wider">
              POWERFUL FEATURES
            </span>
            <h2 className="text-4xl sm:text-5xl font-bold mb-4">
              Everything You Need for{' '}
              <GradientText>AI Mastery</GradientText>
            </h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              From learning to building, we have all the tools and resources to supercharge your AI journey.
            </p>
          </div>
        </TextReveal>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="group perspective-1000"
              >
                <Link to={feature.href}>
                  <motion.div 
                    className="h-full p-8 rounded-2xl cursor-pointer relative overflow-hidden transform-gpu"
                    style={{ 
                      background: 'var(--color-surface)',
                      border: `2px solid ${feature.color}40`,
                      boxShadow: `0 0 20px ${feature.color}20`,
                    }}
                    whileHover={{ 
                      scale: 1.03,
                      y: -10,
                      rotateX: 5,
                      rotateY: -5,
                      boxShadow: `0 20px 40px ${feature.color}30, 0 0 40px ${feature.color}25, inset 0 0 60px ${feature.color}05`,
                      borderColor: feature.color,
                      transition: { duration: 0.3 }
                    }}
                  >
                    {/* Animated Gradient Border Glow */}
                    <motion.div
                      className="absolute inset-0 rounded-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                      style={{
                        background: `linear-gradient(135deg, ${feature.color}30 0%, transparent 50%, ${feature.colorEnd}30 100%)`,
                      }}
                    />
                    
                    {/* Top Gradient Line - Always Visible */}
                    <div 
                      className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl pointer-events-none"
                      style={{ 
                        background: `linear-gradient(90deg, ${feature.color}, ${feature.colorEnd})`,
                        opacity: 0.7,
                      }}
                    />

                    {/* Corner Glow Accents */}
                    <div 
                      className="absolute -top-20 -right-20 w-40 h-40 rounded-full opacity-30 group-hover:opacity-60 transition-opacity duration-500 pointer-events-none"
                      style={{ 
                        background: `radial-gradient(circle, ${feature.color}60, transparent 70%)`,
                        filter: 'blur(20px)',
                      }}
                    />

                    {/* Icon with Enhanced Glow */}
                    <motion.div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 relative z-10"
                      style={{ 
                        background: `linear-gradient(135deg, ${feature.color}, ${feature.colorEnd})`,
                        boxShadow: `0 8px 32px ${feature.color}50, 0 0 20px ${feature.color}40`,
                      }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                    >
                      <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                    </motion.div>

                    {/* Title */}
                    <h3 
                      className="text-2xl font-bold mb-3 relative z-10 transition-all duration-300"
                      style={{ color: 'var(--color-text)' }}
                    >
                      <span 
                        className="group-hover:text-transparent group-hover:bg-clip-text transition-all duration-300"
                        style={{ 
                          backgroundImage: `linear-gradient(135deg, ${feature.color}, ${feature.colorEnd})`,
                          WebkitBackgroundClip: 'text',
                        }}
                      >
                        {feature.title}
                      </span>
                    </h3>

                    {/* Description */}
                    <p className="mb-6 leading-relaxed relative z-10" style={{ color: 'var(--color-text-secondary)' }}>
                      {feature.description}
                    </p>

                    {/* Stats Footer */}
                    <div 
                      className="pt-6 flex items-center justify-between relative z-10"
                      style={{ borderTop: `1px solid ${feature.color}30` }}
                    >
                      <div>
                        <span 
                          className="text-3xl font-bold"
                          style={{ 
                            background: `linear-gradient(135deg, ${feature.color}, ${feature.colorEnd})`,
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            filter: `drop-shadow(0 0 10px ${feature.color}50)`,
                          }}
                        >
                          {feature.stat}
                        </span>
                        <span className="text-sm ml-2" style={{ color: 'var(--color-text-muted)' }}>
                          {feature.statLabel}
                        </span>
                      </div>
                      <motion.div
                        className="w-10 h-10 rounded-full flex items-center justify-center"
                        style={{ 
                          background: `${feature.color}20`,
                          border: `2px solid ${feature.color}50`,
                          boxShadow: `0 0 15px ${feature.color}30`,
                        }}
                        whileHover={{ x: 5, scale: 1.1, boxShadow: `0 0 25px ${feature.color}50` }}
                      >
                        <ArrowRight className="w-5 h-5" style={{ color: feature.color }} />
                      </motion.div>
                    </div>
                  </motion.div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ==================== PROMPT LIBRARY SHOWCASE ==================== */}
      <PromptLibraryShowcase />


      {/* ==================== WHY CHOOSE US SECTION ==================== */}
      <section className="container-custom py-24">
        <div className="card-glass rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-30 pointer-events-none">
            <motion.div 
              className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(0, 227, 165, 0.4), transparent)', filter: 'blur(60px)' }}
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 8, repeat: Infinity }}
            />
          </div>
          <div className="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div>
              <span className="text-sm font-semibold text-primary mb-4 block">WHY AI SUPER HUB</span>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6">
                The Most Complete{' '}
                <GradientText>AI Platform</GradientText>
              </h2>
              <p className="text-lg mb-8" style={{ color: 'var(--color-text-secondary)' }}>
                We are building the most comprehensive AI platform for learners, developers, and enthusiasts. 
                Everything you need, all in one place.
              </p>
              <div className="grid sm:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => {
                  const Icon = benefit.icon;
                  return (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      className="flex items-start gap-4"
                    >
                      <div className="p-3 rounded-xl flex-shrink-0" style={{ background: 'rgba(0, 227, 165, 0.1)' }}>
                        <Icon className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h4 className="font-semibold mb-1">{benefit.title}</h4>
                        <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{benefit.description}</p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative"
            >
              <div className="aspect-square rounded-3xl bg-gradient-to-br from-primary/20 to-secondary/20 p-8 flex items-center justify-center relative">
                <motion.div
                  animate={{ y: [0, -20, 0] }}
                  transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Bot className="w-40 h-40 text-primary" />
                </motion.div>
                <motion.div
                  className="absolute -top-4 -right-4 p-4 rounded-2xl glass"
                  animate={{ y: [0, -10, 0], rotate: [0, 5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Brain className="w-8 h-8 text-secondary" />
                </motion.div>
                <motion.div
                  className="absolute -bottom-4 -left-4 p-4 rounded-2xl glass"
                  animate={{ y: [0, 10, 0], rotate: [0, -5, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                >
                  <Code className="w-8 h-8 text-primary" />
                </motion.div>
                <motion.div
                  className="absolute top-1/2 -right-8 p-3 rounded-xl glass"
                  animate={{ x: [0, 10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
                >
                  <Sparkles className="w-6 h-6 text-yellow-400" />
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ==================== CTA SECTION ==================== */}
      <section className="container-custom py-24">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center relative"
        >
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div 
              className="w-[600px] h-[300px] rounded-full opacity-30"
              style={{ background: 'radial-gradient(ellipse, rgba(0, 227, 165, 0.3), transparent)', filter: 'blur(80px)' }}
            />
          </div>
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 mx-auto mb-8 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center"
          >
            <Rocket className="w-10 h-10 text-black" />
          </motion.div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-6 relative z-10">
            Ready to Start Your{' '}
            <GradientText>AI Journey</GradientText>?
          </h2>
          <p className="text-lg max-w-xl mx-auto mb-10 relative z-10" style={{ color: 'var(--color-text-secondary)' }}>
            Join thousands of users already exploring the future of artificial intelligence.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
            <Link to="/register">
              <Button size="xl" className="min-w-[280px] btn-glow animate-pulse-glow">
                Get Started - It's Free
                <Sparkles className="w-5 h-5" />
              </Button>
            </Link>
          </motion.div>
          <p className="mt-6 text-sm" style={{ color: 'var(--color-text-muted)' }}>
            No credit card required • Free forever plan available
          </p>
        </motion.div>
      </section>

      {/* Floating AI Learning Guide Chat Bot */}
      <HelperChatBot />
    </div>
  );
}

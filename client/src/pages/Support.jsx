import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  HelpCircle, MessageCircle, Mail, Book, Search,
  Phone, Clock, CheckCircle, Send, ExternalLink
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import api from '../services/api';

export default function Support() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    category: 'general'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await api.post('/support', formData);
      toast.success('Message sent successfully! We\'ll respond within 24 hours.');
      setFormData({ name: '', email: '', subject: '', message: '', category: 'general' });
    } catch (error) {
      console.error('Failed to send support message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const faqs = [
    {
      q: 'How do I get started with AI Super Hub?',
      a: 'Create a free account, browse our courses or tools directory, and start learning! We recommend checking out our "Introduction to AI" course first.'
    },
    {
      q: 'Are the courses really free?',
      a: 'Yes! We offer many free courses. Some advanced courses may require a premium subscription, but you can start learning for free.'
    },
    {
      q: 'How do I earn certificates?',
      a: 'Complete all lessons in a course, then pass the quiz with 70% or higher. Your certificate will be instantly available for download!'
    },
    {
      q: 'Can I use AI Chat without logging in?',
      a: 'You need to create a free account to access AI Chat. This helps us provide better, personalized assistance.'
    },
    {
      q: 'What AI models do you use?',
      a: 'We use Google Gemini AI for our chat functionality. We\'re constantly evaluating new models to provide the best experience.'
    },
    {
      q: 'How do I reset my password?',
      a: 'Click "Forgot Password" on the login page, enter your email, and follow the reset link sent to your inbox.'
    },
  ];

  const supportChannels = [
    {
      icon: MessageCircle,
      title: 'AI Chat Support',
      description: 'Get instant AI-powered assistance',
      action: 'Open Chat',
      href: '/chat',
      color: '#00E3A5',
      available: true
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: 'support@aisuperhub.com',
      action: 'Copy Email',
      href: 'support@aisuperhub.com',
      color: '#4FC3F7',
      available: true,
      copyEmail: true
    },
    {
      icon: Book,
      title: 'Documentation',
      description: 'Browse our help articles',
      action: 'View Docs',
      href: '/docs',
      color: '#A855F7',
      available: true
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <HelpCircle className="w-4 h-4" />
            Support Center
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            How Can We Help?
          </h1>
          
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Get help with courses, tools, account issues, or anything else. We're here to support your AI journey!
          </p>
        </motion.div>

        {/* Support Channels */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {supportChannels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <motion.div
                key={channel.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card group hover:border-purple-500/50 transition-all"
              >
                <div 
                  className="w-14 h-14 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform"
                  style={{ backgroundColor: `${channel.color}20` }}
                >
                  <Icon className="w-7 h-7" style={{ color: channel.color }} />
                </div>
                <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                  {channel.title}
                </h3>
                <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
                  {channel.description}
                </p>
                {channel.available ? (
                  channel.copyEmail ? (
                    <button
                      onClick={() => {
                        navigator.clipboard.writeText(channel.href);
                        toast.success('Email copied to clipboard!');
                      }}
                      className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                      style={{ color: channel.color }}
                    >
                      {channel.action}
                      <Mail className="w-4 h-4" />
                    </button>
                  ) : channel.external ? (
                    <a 
                      href={channel.href}
                      className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                      style={{ color: channel.color }}
                    >
                      {channel.action}
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link
                      to={channel.href}
                      className="inline-flex items-center gap-2 text-sm font-medium hover:underline"
                      style={{ color: channel.color }}
                    >
                      {channel.action}
                      <MessageCircle className="w-4 h-4" />
                    </Link>
                  )
                ) : (
                  <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                    {channel.action}
                  </span>
                )}
              </motion.div>
            );
          })}
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="card">
              <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
                Send Us a Message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Email
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                  >
                    <option value="general">General Question</option>
                    <option value="technical">Technical Issue</option>
                    <option value="billing">Billing Question</option>
                    <option value="course">Course Support</option>
                    <option value="feature">Feature Request</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:border-purple-500 transition-colors"
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Message
                  </label>
                  <textarea
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full px-4 py-2.5 rounded-xl border focus:outline-none focus:border-purple-500 transition-colors resize-none"
                    style={{ 
                      backgroundColor: 'var(--color-surface)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" isLoading={isSubmitting}>
                  <Send className="w-4 h-4 mr-2" />
                  Send Message
                </Button>
                
                <p className="text-xs text-center" style={{ color: 'var(--color-text-muted)' }}>
                  Your message will be sent to our support team. We'll respond within 24 hours.
                </p>
              </form>
            </div>
          </motion.div>

          {/* FAQs */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="text-2xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
              Frequently Asked Questions
            </h2>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.05 }}
                  className="card"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                        {faq.q}
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {faq.a}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Response Time */}
            <div className="card mt-6">
              <div className="flex items-center gap-3 mb-3">
                <Clock className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  Response Time
                </h3>
              </div>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                • Email: Within 24 hours<br/>
                • AI Chat: Instant responses<br/>
                • Complex Issues: 2-3 business days
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

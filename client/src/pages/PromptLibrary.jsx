/**
 * @fileoverview Prompt Library Page - THEME FIXED
 * @description User-facing prompt library with search, favorites, and AI features
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Copy, Star, Sparkles, Code, PenTool, Lightbulb, 
  Brain, Briefcase, BookOpen, TrendingUp, Target, Wand2,
  MessageSquare, ArrowRight, Check, Filter, X, Heart,
  Zap, Layers, ChevronDown, ExternalLink, Loader2
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import toast from 'react-hot-toast';

// Category configuration
const CATEGORIES = [
  { value: 'all', label: 'All Prompts', icon: Layers, color: '#9CA3AF' },
  { value: 'Learning', label: 'Learning', icon: Lightbulb, color: '#FFB74D' },
  { value: 'Coding', label: 'Coding', icon: Code, color: '#00D4FF' },
  { value: 'Writing', label: 'Writing', icon: PenTool, color: '#FF6B6B' },
  { value: 'Creative', label: 'Creative', icon: Sparkles, color: '#F093FB' },
  { value: 'Data & ML', label: 'Data & ML', icon: Brain, color: '#6C63FF' },
  { value: 'Business', label: 'Business', icon: Briefcase, color: '#38EF7D' },
  { value: 'Research', label: 'Research', icon: BookOpen, color: '#667EEA' },
  { value: 'Productivity', label: 'Productivity', icon: TrendingUp, color: '#00E3A5' },
  { value: 'Career', label: 'Career', icon: Target, color: '#FFC107' },
];

export default function PromptLibrary() {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [prompts, setPrompts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [copiedId, setCopiedId] = useState(null);
  const [showImprover, setShowImprover] = useState(false);
  const [improverInput, setImproverInput] = useState('');
  const [improverOutput, setImproverOutput] = useState('');
  const [improving, setImproving] = useState(false);
  const [stats, setStats] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);

  useEffect(() => {
    fetchPrompts();
    fetchStats();
    if (isAuthenticated) {
      fetchFavorites();
    }
  }, [activeCategory, isAuthenticated]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const params = {};
      if (activeCategory !== 'all') params.category = activeCategory;
      if (searchTerm) params.search = searchTerm;
      
      const response = await api.get('/prompts', { params });
      setPrompts(response.data.data.prompts);
    } catch (error) {
      toast.error('Failed to load prompts');
    } finally {
      setLoading(false);
    }
  };

  const fetchFavorites = async () => {
    try {
      const response = await api.get('/prompts/user/favorites');
      setFavorites(response.data.data.prompts.map(p => p._id));
    } catch (error) {
      console.error('Failed to fetch favorites');
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get('/prompts/stats');
      setStats(response.data.data);
    } catch (error) {
      console.error('Failed to fetch stats');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchPrompts();
  };

  const handleCopy = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.example);
      setCopiedId(prompt._id);
      toast.success('Prompt copied!');
      
      // Track copy
      api.post(`/prompts/${prompt._id}/copy`).catch(() => {});
      
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  const handleFavorite = async (promptId) => {
    if (!isAuthenticated) {
      toast.error('Please login to save favorites');
      return;
    }

    try {
      const response = await api.post(`/prompts/${promptId}/favorite`);
      if (response.data.data.isFavorited) {
        setFavorites([...favorites, promptId]);
        toast.success('Added to favorites');
      } else {
        setFavorites(favorites.filter(id => id !== promptId));
        toast.success('Removed from favorites');
      }
    } catch (error) {
      toast.error('Failed to update favorites');
    }
  };

  const handleTryInChat = (prompt) => {
    if (!isAuthenticated) {
      toast.error('Please login to use AI Chat');
      navigate('/login');
      return;
    }
    
    // Store prompt in session and navigate to chat
    sessionStorage.setItem('prefillPrompt', prompt.example);
    navigate('/chat');
  };

  const handleImprovePrompt = async () => {
    if (!improverInput.trim()) {
      toast.error('Please enter a prompt to improve');
      return;
    }

    // Check if user is authenticated
    if (!isAuthenticated) {
      toast.error('Please login to use AI Prompt Improver ✨');
      navigate('/login');
      return;
    }

    setImproving(true);
    try {
      const response = await api.post('/prompts/improve', { prompt: improverInput });
      setImproverOutput(response.data.data.improved);
    } catch (error) {
      toast.error('Failed to improve prompt');
    } finally {
      setImproving(false);
    }
  };

  const getCategoryInfo = (categoryName) => {
    return CATEGORIES.find(c => c.value === categoryName) || CATEGORIES[0];
  };

  const displayedPrompts = showFavorites 
    ? prompts.filter(p => favorites.includes(p._id))
    : prompts;

  return (
    <div className="min-h-screen bg-[var(--color-bg)] pt-20 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-purple-500/10 via-transparent to-transparent" />
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px]" />
        <div className="absolute top-40 right-1/4 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]" />
        
        <div className="container mx-auto px-4 py-16 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
              <Sparkles className="w-4 h-4" />
              {stats?.total || '50'}+ AI Prompts
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-[var(--color-text)] mb-4">
              AI Prompt Library
            </h1>
            <p className="text-xl text-[var(--color-text-secondary)] mb-8">
              Curated prompts to supercharge your AI workflows. Copy, customize, and create amazing results.
            </p>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="flex gap-3 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-muted)]" />
                <input
                  type="text"
                  placeholder="Search prompts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-purple-500 transition-colors"
                />
              </div>
              <button
                type="submit"
                className="px-6 py-3.5 rounded-xl font-medium text-white transition-transform hover:scale-105"
                style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #764ba2 100%)' }}
              >
                Search
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4">
        {/* AI Prompt Improver */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-12"
        >
          <div 
            className="p-6 rounded-2xl border cursor-pointer transition-all hover:border-purple-500/50"
            style={{ 
              background: 'linear-gradient(135deg, rgba(108,99,255,0.1) 0%, rgba(118,75,162,0.1) 100%)',
              borderColor: 'rgba(108,99,255,0.3)'
            }}
            onClick={() => setShowImprover(!showImprover)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center">
                  <Wand2 className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-[var(--color-text)] flex items-center gap-2">
                    AI Prompt Improver
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400">
                      Powered by AI
                    </span>
                  </h3>
                  <p className="text-[var(--color-text-secondary)] text-sm">
                    Paste your rough prompt and let AI enhance it for better results
                  </p>
                </div>
              </div>
              <ChevronDown className={`w-5 h-5 text-[var(--color-text-secondary)] transition-transform ${showImprover ? 'rotate-180' : ''}`} />
            </div>

            <AnimatePresence>
              {showImprover && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="mt-6 space-y-4 overflow-hidden"
                  onClick={(e) => e.stopPropagation()}
                >
                  <textarea
                    value={improverInput}
                    onChange={(e) => setImproverInput(e.target.value)}
                    placeholder="Enter your prompt here... e.g., 'write code for sorting'"
                    className="w-full px-4 py-3 bg-[var(--color-surface-elevated)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-purple-500 min-h-[100px]"
                  />
                  
                  <button
                    onClick={handleImprovePrompt}
                    disabled={improving || !improverInput.trim()}
                    className="px-6 py-2.5 rounded-xl font-medium text-white flex items-center gap-2 disabled:opacity-50"
                    style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #764ba2 100%)' }}
                  >
                    {improving ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Improving...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-4 h-4" />
                        {isAuthenticated ? 'Improve My Prompt' : 'Improve My Prompt (Login Required)'}
                      </>
                    )}
                  </button>
                  
                  {/* Login prompt for non-authenticated users */}
                  {!isAuthenticated && (
                    <p className="text-sm text-purple-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Create a free account to improve unlimited prompts with AI
                    </p>
                  )}

                  {improverOutput && (
                    <div className="p-4 bg-[var(--color-surface-elevated)] rounded-xl border border-green-500/30">
                      <div className="flex items-center gap-2 text-green-400 text-sm mb-3">
                        <Check className="w-4 h-4" />
                        Improved Prompt
                      </div>
                      <div className="text-[var(--color-text)] whitespace-pre-wrap text-sm">
                        {improverOutput}
                      </div>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(improverOutput);
                          toast.success('Copied to clipboard!');
                        }}
                        className="mt-3 text-sm text-purple-400 hover:text-purple-300 flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" />
                        Copy Result
                      </button>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* Category Tabs */}
        <div className="flex items-center gap-4 mb-8 overflow-x-auto pb-2">
          <div className="flex gap-2">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              return (
                <button
                  key={cat.value}
                  onClick={() => { setActiveCategory(cat.value); setShowFavorites(false); }}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                    activeCategory === cat.value && !showFavorites
                      ? 'text-white shadow-lg'
                      : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text)]'
                  }`}
                  style={activeCategory === cat.value && !showFavorites ? {
                    background: `linear-gradient(135deg, ${cat.color}40, ${cat.color}20)`,
                    border: `1px solid ${cat.color}50`
                  } : {}}
                >
                  <Icon className="w-4 h-4" style={{ color: activeCategory === cat.value && !showFavorites ? cat.color : undefined }} />
                  {cat.label}
                </button>
              );
            })}
          </div>
          
          {/* Favorites Button */}
          {isAuthenticated && (
            <button
              onClick={() => setShowFavorites(!showFavorites)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ml-auto ${
                showFavorites
                  ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
                  : 'bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]'
              }`}
            >
              <Heart className="w-4 h-4" fill={showFavorites ? 'currentColor' : 'none'} />
              My Favorites ({favorites.length})
            </button>
          )}
        </div>

        {/* Prompts Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
          </div>
        ) : displayedPrompts.length === 0 ? (
          <div className="text-center py-20">
            <Sparkles className="w-12 h-12 text-[var(--color-text-muted)] mx-auto mb-4" />
            <p className="text-[var(--color-text-secondary)]">
              {showFavorites ? 'No favorite prompts yet' : 'No prompts found'}
            </p>
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            layout
          >
            <AnimatePresence mode="popLayout">
              {displayedPrompts.map((prompt) => {
                const catInfo = getCategoryInfo(prompt.category);
                const CatIcon = catInfo.icon;
                const isFavorited = favorites.includes(prompt._id);
                
                return (
                  <motion.div
                    key={prompt._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="group bg-[var(--color-surface)] border border-[var(--color-border)] rounded-2xl overflow-hidden hover:border-purple-500/50 transition-all hover:shadow-xl hover:shadow-purple-500/10"
                  >
                    {/* Card Header */}
                    <div 
                      className="h-1.5"
                      style={{ background: `linear-gradient(90deg, ${catInfo.color}, ${catInfo.color}80)` }}
                    />
                    
                    <div className="p-5">
                      {/* Category & Favorite */}
                      <div className="flex items-center justify-between mb-4">
                        <span 
                          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-medium"
                          style={{ backgroundColor: `${catInfo.color}15`, color: catInfo.color }}
                        >
                          <CatIcon className="w-3.5 h-3.5" />
                          {prompt.category}
                        </span>
                        <button
                          onClick={() => handleFavorite(prompt._id)}
                          className={`p-1.5 rounded-lg transition-colors ${
                            isFavorited 
                              ? 'text-yellow-400 bg-yellow-500/10' 
                              : 'text-[var(--color-text-muted)] hover:text-yellow-400 hover:bg-yellow-500/10'
                          }`}
                        >
                          <Star className="w-4 h-4" fill={isFavorited ? 'currentColor' : 'none'} />
                        </button>
                      </div>

                      {/* Title & Description */}
                      <h3 className="text-lg font-semibold text-[var(--color-text)] mb-2 group-hover:text-purple-400 transition-colors">
                        {prompt.title}
                      </h3>
                      <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-2">
                        {prompt.description}
                      </p>

                      {/* Template */}
                      <div className="mb-4">
                        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-2">Template</p>
                        <div className="p-3 bg-[var(--color-surface-elevated)] rounded-lg text-sm text-[var(--color-text-secondary)] font-mono line-clamp-3">
                          {prompt.template}
                        </div>
                      </div>

                      {/* Example */}
                      <div className="mb-5">
                        <p className="text-xs text-[var(--color-text-muted)] uppercase tracking-wide mb-2">Example</p>
                        <div 
                          className="p-3 rounded-lg text-sm font-mono line-clamp-2"
                          style={{ backgroundColor: `${catInfo.color}10`, color: catInfo.color }}
                        >
                          {prompt.example}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleCopy(prompt)}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                            copiedId === prompt._id
                              ? 'bg-green-500 text-white'
                              : 'bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-elevated)]'
                          }`}
                        >
                          {copiedId === prompt._id ? (
                            <>
                              <Check className="w-4 h-4" />
                              Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4" />
                              Copy
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => handleTryInChat(prompt)}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-transform hover:scale-105"
                          style={{ background: `linear-gradient(135deg, ${catInfo.color}80, ${catInfo.color}40)` }}
                        >
                          <MessageSquare className="w-4 h-4" />
                          Try in Chat
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

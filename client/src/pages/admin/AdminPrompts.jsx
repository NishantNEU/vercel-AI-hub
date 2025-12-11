/**
 * @fileoverview Admin Prompts Management
 * @description Admin panel for managing prompt library
 */

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit2, Trash2, Star, Eye, Copy,
  Sparkles, Code, PenTool, Lightbulb, Brain, Briefcase,
  BookOpen, TrendingUp, Target, Save, X, Check,
  Filter, MoreVertical, ChevronDown
} from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

// Category options with icons and colors
const CATEGORIES = [
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

const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];

const AI_MODELS = ['Any', 'ChatGPT', 'Claude', 'Gemini', 'Midjourney', 'DALL-E'];

export default function AdminPrompts() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editingPrompt, setEditingPrompt] = useState(null);
  const [stats, setStats] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    template: '',
    example: '',
    category: 'Learning',
    difficulty: 'Beginner',
    tags: '',
    color: '#6c63ff',
    icon: 'Sparkles',
    aiModel: 'Any',
    isFeatured: false
  });

  useEffect(() => {
    fetchPrompts();
    fetchStats();
  }, [filterCategory]);

  const fetchPrompts = async () => {
    try {
      setLoading(true);
      const params = filterCategory !== 'all' ? { category: filterCategory, limit: 1000 } : { limit: 1000 };
      const response = await api.get('/prompts', { params });
      setPrompts(response.data.data.prompts);
    } catch (error) {
      toast.error('Failed to fetch prompts');
    } finally {
      setLoading(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const data = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingPrompt) {
        await api.put(`/prompts/${editingPrompt._id}`, data);
        toast.success('Prompt updated successfully');
      } else {
        await api.post('/prompts', data);
        toast.success('Prompt created successfully');
      }

      setShowModal(false);
      resetForm();
      fetchPrompts();
      fetchStats();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save prompt');
    }
  };

  const handleEdit = (prompt) => {
    setEditingPrompt(prompt);
    setFormData({
      title: prompt.title,
      description: prompt.description,
      template: prompt.template,
      example: prompt.example,
      category: prompt.category,
      difficulty: prompt.difficulty || 'Beginner',
      tags: prompt.tags?.join(', ') || '',
      color: prompt.color || '#6c63ff',
      icon: prompt.icon || 'Sparkles',
      aiModel: prompt.aiModel || 'Any',
      isFeatured: prompt.isFeatured || false
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prompt?')) return;

    try {
      await api.delete(`/prompts/${id}`);
      toast.success('Prompt deleted successfully');
      fetchPrompts();
      fetchStats();
    } catch (error) {
      toast.error('Failed to delete prompt');
    }
  };

  const toggleFeatured = async (prompt) => {
    try {
      await api.put(`/prompts/${prompt._id}`, { 
        ...prompt, 
        isFeatured: !prompt.isFeatured 
      });
      toast.success(prompt.isFeatured ? 'Removed from featured' : 'Added to featured');
      fetchPrompts();
    } catch (error) {
      toast.error('Failed to update prompt');
    }
  };

  const resetForm = () => {
    setEditingPrompt(null);
    setFormData({
      title: '',
      description: '',
      template: '',
      example: '',
      category: 'Learning',
      difficulty: 'Beginner',
      tags: '',
      color: '#6c63ff',
      icon: 'Sparkles',
      aiModel: 'Any',
      isFeatured: false
    });
  };

  const filteredPrompts = prompts.filter(prompt =>
    prompt.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prompt.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCategoryInfo = (categoryName) => {
    return CATEGORIES.find(c => c.value === categoryName) || CATEGORIES[0];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[var(--color-text)] flex items-center gap-3">
            <Sparkles className="w-7 h-7 text-purple-400" />
            Prompt Library
          </h1>
          <p className="text-[var(--color-text-secondary)] mt-1">Manage AI prompts for users</p>
        </div>
        <button
          onClick={() => { resetForm(); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all"
          style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #764ba2 100%)' }}
        >
          <Plus className="w-5 h-5" />
          Add Prompt
        </button>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
            <p className="text-[var(--color-text-secondary)] text-sm">Total Prompts</p>
            <p className="text-2xl font-bold text-[var(--color-text)]">{stats.total}</p>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
            <p className="text-[var(--color-text-secondary)] text-sm">Categories</p>
            <p className="text-2xl font-bold text-purple-400">{stats.categoryCount}</p>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
            <p className="text-[var(--color-text-secondary)] text-sm">Total Copies</p>
            <p className="text-2xl font-bold text-cyan-400">{stats.totalCopies}</p>
          </div>
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl p-4">
            <p className="text-[var(--color-text-secondary)] text-sm">Total Favorites</p>
            <p className="text-2xl font-bold text-yellow-400">{stats.totalFavorites}</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]" />
          <input
            type="text"
            placeholder="Search prompts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-purple-500"
          />
        </div>

        {/* Category Filter */}
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:border-purple-500"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Prompts Table */}
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border)]">
                <th className="text-left p-4 text-[var(--color-text-secondary)] font-medium">Prompt</th>
                <th className="text-left p-4 text-[var(--color-text-secondary)] font-medium">Category</th>
                <th className="text-center p-4 text-[var(--color-text-secondary)] font-medium">Stats</th>
                <th className="text-center p-4 text-[var(--color-text-secondary)] font-medium">Featured</th>
                <th className="text-right p-4 text-[var(--color-text-secondary)] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--color-text-secondary)]">
                    Loading prompts...
                  </td>
                </tr>
              ) : filteredPrompts.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-[var(--color-text-secondary)]">
                    No prompts found
                  </td>
                </tr>
              ) : (
                filteredPrompts.map((prompt) => {
                  const catInfo = getCategoryInfo(prompt.category);
                  const CatIcon = catInfo.icon;
                  
                  return (
                    <tr key={prompt._id} className="border-b border-[var(--color-border)] hover:bg-[var(--color-surface-hover)]">
                      <td className="p-4">
                        <div className="flex items-start gap-3">
                          <div 
                            className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: `${catInfo.color}20` }}
                          >
                            <CatIcon className="w-5 h-5" style={{ color: catInfo.color }} />
                          </div>
                          <div>
                            <h3 className="font-medium text-[var(--color-text)]">{prompt.title}</h3>
                            <p className="text-sm text-[var(--color-text-secondary)] line-clamp-1">{prompt.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <span 
                          className="px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${catInfo.color}20`, 
                            color: catInfo.color 
                          }}
                        >
                          {prompt.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-center gap-4 text-sm text-[var(--color-text-secondary)]">
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {prompt.usageCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Copy className="w-4 h-4" />
                            {prompt.copyCount || 0}
                          </span>
                          <span className="flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            {prompt.favoriteCount || 0}
                          </span>
                        </div>
                      </td>
                      <td className="p-4 text-center">
                        <button
                          onClick={() => toggleFeatured(prompt)}
                          className={`p-2 rounded-lg transition-colors ${
                            prompt.isFeatured 
                              ? 'bg-yellow-500/20 text-yellow-400' 
                              : 'bg-white/5 text-[var(--color-text-secondary)] hover:text-yellow-400'
                          }`}
                        >
                          <Star className="w-5 h-5" fill={prompt.isFeatured ? 'currentColor' : 'none'} />
                        </button>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(prompt)}
                            className="p-2 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:text-blue-400 hover:bg-blue-500/10 transition-colors"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(prompt._id)}
                            className="p-2 rounded-lg bg-white/5 text-[var(--color-text-secondary)] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-[var(--color-bg)] border border-[var(--color-border)] rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-[var(--color-border)] flex justify-between items-center">
                <h2 className="text-xl font-bold text-[var(--color-text)]">
                  {editingPrompt ? 'Edit Prompt' : 'Add New Prompt'}
                </h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="p-2 rounded-lg hover:bg-[var(--color-surface-hover)] text-[var(--color-text-secondary)]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-5">
                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-purple-500"
                    placeholder="e.g., Code Review Expert"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Description *
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-purple-500"
                    placeholder="Brief description of what this prompt does"
                    required
                  />
                </div>

                {/* Template */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Prompt Template *
                  </label>
                  <textarea
                    value={formData.template}
                    onChange={(e) => setFormData({ ...formData, template: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-purple-500 min-h-[100px] font-mono text-sm"
                    placeholder="Use [PLACEHOLDERS] for variables, e.g., Review this [CODE] and suggest improvements..."
                    required
                  />
                </div>

                {/* Example */}
                <div>
                  <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                    Example *
                  </label>
                  <textarea
                    value={formData.example}
                    onChange={(e) => setFormData({ ...formData, example: e.target.value })}
                    className="w-full px-4 py-3 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-purple-500 min-h-[80px] font-mono text-sm"
                    placeholder="A filled-in example of the prompt"
                    required
                  />
                </div>

                {/* Category & Difficulty */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        const cat = CATEGORIES.find(c => c.value === e.target.value);
                        setFormData({ 
                          ...formData, 
                          category: e.target.value,
                          color: cat?.color || '#6c63ff'
                        });
                      }}
                      className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:border-purple-500"
                      required
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Difficulty
                    </label>
                    <select
                      value={formData.difficulty}
                      onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:border-purple-500"
                    >
                      {DIFFICULTIES.map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* AI Model & Tags */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Best For (AI Model)
                    </label>
                    <select
                      value={formData.aiModel}
                      onChange={(e) => setFormData({ ...formData, aiModel: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] focus:outline-none focus:border-purple-500"
                    >
                      {AI_MODELS.map(m => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-[var(--color-text-secondary)] mb-2">
                      Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={formData.tags}
                      onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                      className="w-full px-4 py-2.5 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:outline-none focus:border-purple-500"
                      placeholder="coding, python, debug"
                    />
                  </div>
                </div>

                {/* Featured Toggle */}
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, isFeatured: !formData.isFeatured })}
                    className={`w-12 h-6 rounded-full transition-colors ${
                      formData.isFeatured ? 'bg-purple-500' : 'bg-white/10'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                      formData.isFeatured ? 'translate-x-6' : 'translate-x-0.5'
                    }`} />
                  </button>
                  <span className="text-[var(--color-text-secondary)]">Featured on homepage</span>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-4 py-2.5 bg-white/5 hover:bg-[var(--color-surface-hover)] rounded-xl text-[var(--color-text)] font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2.5 rounded-xl text-[var(--color-text)] font-medium flex items-center justify-center gap-2"
                    style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #764ba2 100%)' }}
                  >
                    <Save className="w-4 h-4" />
                    {editingPrompt ? 'Update' : 'Create'} Prompt
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

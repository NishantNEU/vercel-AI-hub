import { useState, useEffect } from 'react';
import { 
  Search, Filter, Bookmark, BookmarkCheck, ExternalLink, 
  Sparkles, Image, Code, MessageSquare, Music, Video,
  FileText, Brain, Loader2, X, ChevronDown, Wrench
} from 'lucide-react';
import { toolsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

const categories = [
  { id: 'all', name: 'All Tools', icon: Sparkles },
  { id: 'writing', name: 'Writing', icon: FileText },
  { id: 'image', name: 'Image', icon: Image },
  { id: 'video', name: 'Video', icon: Video },
  { id: 'audio', name: 'Audio', icon: Music },
  { id: 'coding', name: 'Coding', icon: Code },
  { id: 'productivity', name: 'Productivity', icon: Brain },
  { id: 'research', name: 'Research', icon: Search },
  { id: 'marketing', name: 'Marketing', icon: MessageSquare },
  { id: 'data', name: 'Data', icon: Brain },
  { id: 'chatbot', name: 'Chatbot', icon: MessageSquare },
  { id: 'other', name: 'Other', icon: Sparkles },
];

const pricingFilters = [
  { id: 'all', name: 'All' },
  { id: 'free', name: 'Free' },
  { id: 'freemium', name: 'Freemium' },
  { id: 'paid', name: 'Paid' },
];

export default function Tools() {
  const { isAuthenticated } = useAuth();
  const [tools, setTools] = useState([]);
  const [bookmarks, setBookmarks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPricing, setSelectedPricing] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadTools();
  }, [selectedCategory, selectedPricing]);

  useEffect(() => {
    if (isAuthenticated) {
      loadBookmarks();
    }
  }, [isAuthenticated]);

  const loadTools = async () => {
    try {
      setIsLoading(true);
      const params = { limit: 100 }; // Fetch up to 100 tools
      if (selectedCategory !== 'all') params.category = selectedCategory;
      if (selectedPricing !== 'all') params.pricing = selectedPricing;
      if (searchQuery) params.search = searchQuery;
      
      const response = await toolsAPI.getAll(params);
      setTools(response.data.data.tools || []);
    } catch (error) {
      console.error('Failed to load tools:', error);
      toast.error('Failed to load tools');
    } finally {
      setIsLoading(false);
    }
  };

  const loadBookmarks = async () => {
    try {
      const response = await toolsAPI.getBookmarks();
      const bookmarkIds = response.data.data.tools?.map(t => t._id) || [];
      setBookmarks(bookmarkIds);
    } catch (error) {
      console.error('Failed to load bookmarks:', error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    loadTools();
  };

  const toggleBookmark = async (toolId) => {
    if (!isAuthenticated) {
      toast.error('Please login to bookmark tools');
      return;
    }

    try {
      await toolsAPI.bookmark(toolId);
      
      if (bookmarks.includes(toolId)) {
        setBookmarks(prev => prev.filter(id => id !== toolId));
        toast.success('Bookmark removed');
      } else {
        setBookmarks(prev => [...prev, toolId]);
        toast.success('Tool bookmarked!');
      }
    } catch (error) {
      toast.error('Failed to update bookmark');
    }
  };

  const filteredTools = tools.filter(tool => {
    const matchesSearch = !searchQuery || 
      tool.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tool.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || tool.category === selectedCategory;
    const matchesPricing = selectedPricing === 'all' || tool.pricing === selectedPricing;
    return matchesSearch && matchesCategory && matchesPricing;
  });

  const getCategoryIcon = (category) => {
    const cat = categories.find(c => c.id === category);
    return cat?.icon || Sparkles;
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero Section */}
      <div className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)] opacity-10 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[var(--color-secondary)] opacity-10 rounded-full blur-[128px]" />
        </div>
        
        <div className="container-custom text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
            Discover <span className="text-gradient">AI Tools</span>
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--color-text-secondary)' }}>
            Explore our curated collection of the best AI tools for every need.
            From image generation to code assistants.
          </p>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto">
            <div className="relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search AI tools..."
                  className="w-full pl-12 pr-4 py-3 rounded-xl border focus:outline-none focus:border-[var(--color-primary)]"
                  style={{ 
                    backgroundColor: 'var(--color-surface)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>
              <Button type="submit">Search</Button>
              <button
                type="button"
                onClick={() => setShowFilters(!showFilters)}
                className="p-3 rounded-xl border transition-colors lg:hidden"
                style={{ 
                  backgroundColor: 'var(--color-surface)',
                  borderColor: showFilters ? 'var(--color-primary)' : 'var(--color-border)',
                  color: showFilters ? 'var(--color-primary)' : 'var(--color-text)'
                }}
              >
                <Filter className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="container-custom pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 space-y-6">
              {/* Categories */}
              <div className="card">
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Categories</h3>
                <div className="space-y-1">
                  {categories.map((category) => {
                    const Icon = category.icon;
                    const isActive = selectedCategory === category.id;
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                          isActive ? 'bg-[rgba(0,227,165,0.1)]' : ''
                        }`}
                        style={{ 
                          color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                        }}
                      >
                        <Icon className="w-4 h-4" />
                        {category.name}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Pricing Filter */}
              <div className="card">
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Pricing</h3>
                <div className="space-y-1">
                  {pricingFilters.map((pricing) => {
                    const isActive = selectedPricing === pricing.id;
                    return (
                      <button
                        key={pricing.id}
                        onClick={() => setSelectedPricing(pricing.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors ${
                          isActive ? 'bg-[rgba(0,227,165,0.1)]' : ''
                        }`}
                        style={{ 
                          color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'
                        }}
                      >
                        {pricing.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden card mb-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                      style={{ 
                        backgroundColor: 'var(--color-bg)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)'
                      }}
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                      Pricing
                    </label>
                    <select
                      value={selectedPricing}
                      onChange={(e) => setSelectedPricing(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border focus:outline-none"
                      style={{ 
                        backgroundColor: 'var(--color-bg)',
                        borderColor: 'var(--color-border)',
                        color: 'var(--color-text)'
                      }}
                    >
                      {pricingFilters.map(p => (
                        <option key={p.id} value={p.id}>{p.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Results Count */}
            <div className="flex items-center justify-between mb-6">
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {isLoading ? 'Loading...' : `${filteredTools.length} tools found`}
              </p>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
              </div>
            ) : filteredTools.length === 0 ? (
              <div className="text-center py-20">
                <Sparkles className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-semibold mb-2" style={{ color: 'var(--color-text)' }}>
                  No tools found
                </h3>
                <p style={{ color: 'var(--color-text-secondary)' }}>
                  Try adjusting your search or filters
                </p>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {filteredTools.map((tool) => {
                  const CategoryIcon = getCategoryIcon(tool.category);
                  const isBookmarked = bookmarks.includes(tool._id);
                  
                  return (
                    <div
                      key={tool._id}
                      className="card card-hover group"
                    >
                      {/* Tool Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          {/* Tool Logo */}
                          <div 
                            className="w-12 h-12 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                            style={{ backgroundColor: 'var(--color-bg)' }}
                          >
                            {tool.logo ? (
                              <img 
                                src={tool.logo} 
                                alt={tool.name}
                                className="w-10 h-10 object-contain"
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.style.display = 'none';
                                }}
                              />
                            ) : (
                              <CategoryIcon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold group-hover:text-[var(--color-primary)] transition-colors" style={{ color: 'var(--color-text)' }}>
                              {tool.name}
                            </h3>
                            <span 
                              className="text-xs px-2 py-0.5 rounded-full"
                              style={{ 
                                backgroundColor: tool.pricing === 'free' 
                                  ? 'rgba(0,227,165,0.1)' 
                                  : tool.pricing === 'freemium'
                                  ? 'rgba(79,195,247,0.1)'
                                  : 'rgba(251,191,36,0.1)',
                                color: tool.pricing === 'free'
                                  ? 'var(--color-primary)'
                                  : tool.pricing === 'freemium'
                                  ? 'var(--color-secondary)'
                                  : '#FBBF24'
                              }}
                            >
                              {tool.pricing}
                            </span>
                          </div>
                        </div>
                        
                        <button
                          onClick={() => toggleBookmark(tool._id)}
                          className="p-2 rounded-lg transition-colors hover:bg-[var(--color-bg)]"
                        >
                          {isBookmarked ? (
                            <BookmarkCheck className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                          ) : (
                            <Bookmark className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                          )}
                        </button>
                      </div>

                      {/* Description */}
                      <p 
                        className="text-sm mb-4 line-clamp-2"
                        style={{ color: 'var(--color-text-secondary)' }}
                      >
                        {tool.description}
                      </p>

                      {/* Tags */}
                      {tool.tags && tool.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-4">
                          {tool.tags.slice(0, 3).map((tag, idx) => (
                            <span
                              key={idx}
                              className="text-xs px-2 py-1 rounded-md"
                              style={{ 
                                backgroundColor: 'var(--color-bg)',
                                color: 'var(--color-text-secondary)'
                              }}
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Action Button */}
                      <a
                        href={tool.url || tool.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-2 w-full py-2 rounded-lg border transition-colors hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]"
                        style={{ 
                          borderColor: 'var(--color-border)',
                          color: 'var(--color-text-secondary)'
                        }}
                      >
                        <span className="text-sm">Visit Website</span>
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

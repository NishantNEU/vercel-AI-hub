import { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit, Trash2, Loader2, X,
  ExternalLink, Wrench
} from 'lucide-react';
import { toolsAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const categories = [
  'writing', 'image', 'video', 'audio', 'coding', 
  'productivity', 'research', 'marketing', 'data', 'chatbot', 'other'
];

const pricingOptions = ['free', 'freemium', 'paid'];

const emptyTool = {
  name: '',
  description: '',
  url: '',
  logo: '',
  category: 'chatbot',
  pricing: 'free',
  tags: '',
  isFeatured: false,
  isActive: true
};

export default function AdminTools() {
  const [tools, setTools] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTool, setEditingTool] = useState(null);
  const [formData, setFormData] = useState(emptyTool);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      setIsLoading(true);
      const response = await toolsAPI.getAll({ limit: 100 });
      setTools(response.data.data.tools || []);
    } catch (error) {
      toast.error('Failed to load tools');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingTool(null);
    setFormData(emptyTool);
    setShowModal(true);
  };

  const openEditModal = (tool) => {
    setEditingTool(tool);
    setFormData({
      name: tool.name || '',
      description: tool.description || '',
      url: tool.url || '',
      logo: tool.logo || '',
      category: tool.category || 'chatbot',
      pricing: tool.pricing || 'free',
      tags: tool.tags?.join(', ') || '',
      isFeatured: tool.isFeatured || false,
      isActive: tool.isActive !== false
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingTool(null);
    setFormData(emptyTool);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.url) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
      };

      if (editingTool) {
        await toolsAPI.update(editingTool._id, payload);
        toast.success('Tool updated successfully');
      } else {
        await toolsAPI.create(payload);
        toast.success('Tool created successfully');
      }
      
      closeModal();
      loadTools();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save tool');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (toolId) => {
    if (!confirm('Are you sure you want to delete this tool?')) return;
    
    try {
      await toolsAPI.delete(toolId);
      toast.success('Tool deleted');
      loadTools();
    } catch (error) {
      toast.error('Failed to delete tool');
    }
  };

  const filteredTools = tools.filter(tool =>
    tool.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>AI Tools</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage AI tools directory</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          Add Tool
        </Button>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tools..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)'
            }}
          />
        </div>
      </div>

      {/* Tools Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
          </div>
        ) : filteredTools.length === 0 ? (
          <div className="text-center py-12">
            <Wrench className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p style={{ color: 'var(--color-text-secondary)' }}>No tools found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Tool</th>
                  <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Category</th>
                  <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Pricing</th>
                  <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Featured</th>
                  <th className="text-right p-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTools.map((tool) => (
                  <tr key={tool._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        {/* Tool Logo */}
                        <div 
                          className="w-10 h-10 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0"
                          style={{ backgroundColor: 'var(--color-bg)' }}
                        >
                          {tool.logo ? (
                            <img 
                              src={tool.logo} 
                              alt={tool.name}
                              className="w-8 h-8 object-contain"
                              onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = '';
                                e.target.style.display = 'none';
                              }}
                            />
                          ) : (
                            <Wrench className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                          )}
                        </div>
                        <div>
                          <p className="font-medium" style={{ color: 'var(--color-text)' }}>{tool.name}</p>
                          <p className="text-sm truncate max-w-xs" style={{ color: 'var(--color-text-muted)' }}>
                            {tool.description?.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span 
                        className="text-xs px-2 py-1 rounded-full capitalize"
                        style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-secondary)' }}
                      >
                        {tool.category}
                      </span>
                    </td>
                    <td className="p-4">
                      <span 
                        className="text-xs px-2 py-1 rounded-full capitalize"
                        style={{ 
                          backgroundColor: tool.pricing === 'free' ? 'rgba(0,227,165,0.1)' : 'rgba(251,191,36,0.1)',
                          color: tool.pricing === 'free' ? 'var(--color-primary)' : '#FBBF24'
                        }}
                      >
                        {tool.pricing}
                      </span>
                    </td>
                    <td className="p-4">
                      <span style={{ color: tool.isFeatured ? 'var(--color-primary)' : 'var(--color-text-muted)' }}>
                        {tool.isFeatured ? 'Yes' : 'No'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center justify-end gap-2">
                        <a
                          href={tool.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                        <button
                          onClick={() => openEditModal(tool)}
                          className="p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
                          style={{ color: 'var(--color-text-secondary)' }}
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(tool._id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div 
            className="relative w-full max-w-lg rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
                {editingTool ? 'Edit Tool' : 'Add New Tool'}
              </h2>
              <button onClick={closeModal}>
                <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Name *"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., ChatGPT"
              />
              
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief description of the tool..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
                  style={{ 
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>

              <Input
                label="URL *"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="https://example.com"
              />

              {/* Logo URL Field */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Logo URL
                </label>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={formData.logo}
                    onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
                    placeholder="https://example.com/logo.png"
                    className="flex-1 px-4 py-3 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
                    style={{ 
                      backgroundColor: 'var(--color-bg)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                  />
                  {formData.logo && (
                    <div 
                      className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                      style={{ backgroundColor: 'var(--color-bg)' }}
                    >
                      <img 
                        src={formData.logo} 
                        alt="Preview"
                        className="w-10 h-10 object-contain"
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
                <p className="text-xs mt-1" style={{ color: 'var(--color-text-muted)' }}>
                  Paste a direct image URL (PNG, JPG, SVG)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none capitalize"
                    style={{ 
                      backgroundColor: 'var(--color-bg)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Pricing
                  </label>
                  <select
                    value={formData.pricing}
                    onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none capitalize"
                    style={{ 
                      backgroundColor: 'var(--color-bg)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                  >
                    {pricingOptions.map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Input
                label="Tags (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="ai, chatbot, writing"
              />

              <div className="flex gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span style={{ color: 'var(--color-text-secondary)' }}>Featured</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span style={{ color: 'var(--color-text-secondary)' }}>Active</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSaving} className="flex-1">
                  {editingTool ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

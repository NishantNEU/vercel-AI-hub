import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Edit, Trash2, Loader2, X,
  BookOpen, FileText, HelpCircle, Eye, EyeOff,
  Star, Users, Clock, ChevronDown, Upload, Image
} from 'lucide-react';
import { coursesAPI, uploadAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

// Course categories
const categories = [
  { value: 'ai-fundamentals', label: 'AI Fundamentals' },
  { value: 'machine-learning', label: 'Machine Learning' },
  { value: 'deep-learning', label: 'Deep Learning' },
  { value: 'nlp', label: 'Natural Language Processing' },
  { value: 'computer-vision', label: 'Computer Vision' },
  { value: 'generative-ai', label: 'Generative AI' },
  { value: 'ai-tools', label: 'AI Tools' },
  { value: 'prompt-engineering', label: 'Prompt Engineering' },
  { value: 'ai-ethics', label: 'AI Ethics' },
  { value: 'other', label: 'Other' }
];

const difficulties = ['beginner', 'intermediate', 'advanced'];

const emptyCourse = {
  title: '',
  description: '',
  shortDescription: '',
  category: 'ai-fundamentals',
  difficulty: 'beginner',
  tags: '',
  prerequisites: '',
  learningOutcomes: '',
  thumbnail: '',
  isPublished: false,
  isFeatured: false
};

export default function AdminCourses() {
  const navigate = useNavigate();
  const fileInputRef = useRef(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [formData, setFormData] = useState(emptyCourse);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('all'); // all, published, draft

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setIsLoading(true);
      // Admin can see all courses including drafts with showAll=true
      const response = await coursesAPI.getAll({ limit: 100, showAll: 'true' });
      setCourses(response.data.data.courses || []);
    } catch (error) {
      toast.error('Failed to load courses');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingCourse(null);
    setFormData(emptyCourse);
    setShowModal(true);
  };

  const openEditModal = (course) => {
    setEditingCourse(course);
    setFormData({
      title: course.title || '',
      description: course.description || '',
      shortDescription: course.shortDescription || '',
      category: course.category || 'ai-fundamentals',
      difficulty: course.difficulty || 'beginner',
      tags: course.tags?.join(', ') || '',
      prerequisites: course.prerequisites?.join(', ') || '',
      learningOutcomes: course.learningOutcomes?.join('\n') || '',
      thumbnail: course.thumbnail || '',
      isPublished: course.isPublished || false,
      isFeatured: course.isFeatured || false
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCourse(null);
    setFormData(emptyCourse);
  };

  // Handle thumbnail upload
  const handleThumbnailUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    // If editing existing course, upload directly
    if (editingCourse) {
      try {
        setIsUploading(true);
        const response = await uploadAPI.courseThumbnail(editingCourse._id, file);
        const newUrl = response.data.data.url;
        setFormData({ ...formData, thumbnail: newUrl });
        toast.success('Thumbnail uploaded!');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(error.response?.data?.message || 'Failed to upload thumbnail');
      } finally {
        setIsUploading(false);
      }
    } else {
      // For new course, use general upload
      try {
        setIsUploading(true);
        const response = await uploadAPI.image(file);
        const newUrl = response.data.data.url;
        setFormData({ ...formData, thumbnail: newUrl });
        toast.success('Image uploaded!');
      } catch (error) {
        console.error('Upload error:', error);
        toast.error(error.response?.data?.message || 'Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category || !formData.difficulty) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
        prerequisites: formData.prerequisites.split(',').map(t => t.trim()).filter(Boolean),
        learningOutcomes: formData.learningOutcomes.split('\n').map(t => t.trim()).filter(Boolean)
      };

      if (editingCourse) {
        await coursesAPI.update(editingCourse._id, payload);
        toast.success('Course updated successfully');
      } else {
        await coursesAPI.create(payload);
        toast.success('Course created successfully');
      }
      
      closeModal();
      loadCourses();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save course');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (courseId) => {
    if (!confirm('Are you sure you want to delete this course? This will also delete all enrollments.')) return;
    
    try {
      await coursesAPI.delete(courseId);
      toast.success('Course deleted');
      loadCourses();
    } catch (error) {
      toast.error('Failed to delete course');
    }
  };

  const togglePublish = async (course) => {
    try {
      await coursesAPI.update(course._id, { isPublished: !course.isPublished });
      toast.success(course.isPublished ? 'Course unpublished' : 'Course published');
      loadCourses();
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  const toggleFeatured = async (course) => {
    try {
      await coursesAPI.update(course._id, { isFeatured: !course.isFeatured });
      toast.success(course.isFeatured ? 'Removed from featured' : 'Added to featured');
      loadCourses();
    } catch (error) {
      toast.error('Failed to update course');
    }
  };

  // Filter courses
  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         course.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || course.category === filterCategory;
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'published' && course.isPublished) ||
                      (activeTab === 'draft' && !course.isPublished);
    return matchesSearch && matchesCategory && matchesTab;
  });

  // Stats
  const stats = {
    total: courses.length,
    published: courses.filter(c => c.isPublished).length,
    drafts: courses.filter(c => !c.isPublished).length,
    featured: courses.filter(c => c.isFeatured).length
  };

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Courses</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage learning courses</p>
        </div>
        <Button onClick={openCreateModal}>
          <Plus className="w-4 h-4" />
          Add Course
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Courses', value: stats.total, icon: BookOpen, color: 'var(--color-primary)' },
          { label: 'Published', value: stats.published, icon: Eye, color: '#10B981' },
          { label: 'Drafts', value: stats.drafts, icon: EyeOff, color: '#FBBF24' },
          { label: 'Featured', value: stats.featured, icon: Star, color: '#F472B6' }
        ].map((stat, idx) => (
          <div key={idx} className="card p-4">
            <div className="flex items-center gap-3">
              <div 
                className="w-10 h-10 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}20` }}
              >
                <stat.icon className="w-5 h-5" style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{stat.value}</p>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-4">
        {['all', 'published', 'draft'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
              activeTab === tab ? 'bg-[var(--color-primary)] text-[var(--color-bg)]' : ''
            }`}
            style={{ 
              backgroundColor: activeTab === tab ? undefined : 'var(--color-surface)',
              color: activeTab === tab ? undefined : 'var(--color-text-secondary)'
            }}
          >
            {tab === 'all' ? `All (${stats.total})` : 
             tab === 'published' ? `Published (${stats.published})` : 
             `Drafts (${stats.drafts})`}
          </button>
        ))}
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)'
            }}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-4 py-2 rounded-lg border focus:outline-none"
          style={{ 
            backgroundColor: 'var(--color-surface)',
            borderColor: 'var(--color-border)',
            color: 'var(--color-text)'
          }}
        >
          <option value="">All Categories</option>
          {categories.map(cat => (
            <option key={cat.value} value={cat.value}>{cat.label}</option>
          ))}
        </select>
      </div>

      {/* Courses List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="card text-center py-12">
          <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-20" />
          <p style={{ color: 'var(--color-text-secondary)' }}>No courses found</p>
          <Button onClick={openCreateModal} className="mt-4">
            <Plus className="w-4 h-4" />
            Create First Course
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredCourses.map((course) => (
            <div 
              key={course._id} 
              className="card p-4 flex flex-col sm:flex-row gap-4"
            >
              {/* Thumbnail */}
              <div 
                className="w-full sm:w-48 h-32 rounded-lg overflow-hidden flex-shrink-0"
                style={{ backgroundColor: 'var(--color-bg)' }}
              >
                {course.thumbnail ? (
                  <img 
                    src={course.thumbnail} 
                    alt={course.title}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Image className="w-8 h-8" style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                )}
              </div>

              {/* Course Info */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-start gap-2 mb-2">
                  <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                    {course.title}
                  </h3>
                  <div className="flex gap-2 flex-wrap">
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full capitalize"
                      style={{ 
                        backgroundColor: 'var(--color-bg)',
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      {course.category}
                    </span>
                    <span 
                      className="text-xs px-2 py-0.5 rounded-full capitalize"
                      style={{ 
                        backgroundColor: course.isPublished ? 'rgba(0,227,165,0.1)' : 'rgba(251,191,36,0.1)',
                        color: course.isPublished ? 'var(--color-primary)' : '#FBBF24'
                      }}
                    >
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                    {course.isFeatured && (
                      <span 
                        className="text-xs px-2 py-0.5 rounded-full flex items-center gap-1"
                        style={{ backgroundColor: 'rgba(244,114,182,0.1)', color: '#F472B6' }}
                      >
                        <Star className="w-3 h-3" /> Featured
                      </span>
                    )}
                  </div>
                </div>

                <p 
                  className="text-sm line-clamp-2 mb-3" 
                  style={{ color: 'var(--color-text-muted)' }}
                >
                  {course.shortDescription || course.description?.substring(0, 150)}
                </p>

                {/* Stats Row */}
                <div className="flex flex-wrap items-center gap-4 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <span className="flex items-center gap-1">
                    <FileText className="w-4 h-4" />
                    {course.lessons?.length || 0} lessons
                  </span>
                  <span className="flex items-center gap-1">
                    <HelpCircle className="w-4 h-4" />
                    {course.quiz?.length || 0} quiz questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {course.enrollmentCount || 0} enrolled
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {course.duration || 0} min
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex sm:flex-col gap-2 flex-shrink-0">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => navigate(`/admin/courses/${course._id}/lessons`)}
                  title="Manage Lessons"
                >
                  <FileText className="w-4 h-4" />
                  <span className="sm:hidden md:inline">Lessons</span>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => togglePublish(course)}
                  title={course.isPublished ? 'Unpublish' : 'Publish'}
                >
                  {course.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleFeatured(course)}
                  title={course.isFeatured ? 'Remove Featured' : 'Mark Featured'}
                >
                  <Star className={`w-4 h-4 ${course.isFeatured ? 'fill-current' : ''}`} 
                    style={{ color: course.isFeatured ? '#F472B6' : 'inherit' }}
                  />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => openEditModal(course)}
                  title="Edit Course"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleDelete(course._id)}
                  className="text-red-400 hover:bg-red-500/10"
                  title="Delete Course"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div 
            className="relative w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h2>
              <button onClick={closeModal}>
                <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Course Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Introduction to Machine Learning"
              />

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Full course description..."
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
                  style={{ 
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>

              <Input
                label="Short Description"
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Brief summary (max 300 chars)"
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none"
                    style={{ 
                      backgroundColor: 'var(--color-bg)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                    Difficulty *
                  </label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border focus:outline-none capitalize"
                    style={{ 
                      backgroundColor: 'var(--color-bg)',
                      borderColor: 'var(--color-border)',
                      color: 'var(--color-text)'
                    }}
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff} className="capitalize">{diff}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Thumbnail
                </label>
                <div className="flex gap-4 items-start">
                  {/* Preview */}
                  <div 
                    className="w-40 h-24 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-border)' }}
                  >
                    {formData.thumbnail ? (
                      <img 
                        src={formData.thumbnail} 
                        alt="Thumbnail preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="w-8 h-8" style={{ color: 'var(--color-text-muted)' }} />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                      className="mb-2"
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="w-4 h-4" />
                          Upload Image
                        </>
                      )}
                    </Button>
                    <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                      Recommended: 800x450px, Max 10MB
                    </p>
                    {formData.thumbnail && (
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, thumbnail: '' })}
                        className="text-xs text-red-400 hover:underline mt-1"
                      >
                        Remove image
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <Input
                label="Tags (comma separated)"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="ai, machine learning, python"
              />

              <Input
                label="Prerequisites (comma separated)"
                value={formData.prerequisites}
                onChange={(e) => setFormData({ ...formData, prerequisites: e.target.value })}
                placeholder="Basic Python, Linear Algebra"
              />

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Learning Outcomes (one per line)
                </label>
                <textarea
                  value={formData.learningOutcomes}
                  onChange={(e) => setFormData({ ...formData, learningOutcomes: e.target.value })}
                  placeholder="Understand ML fundamentals&#10;Build your first model&#10;Evaluate model performance"
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
                  style={{ 
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>

              <div className="flex items-center gap-6">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span style={{ color: 'var(--color-text-secondary)' }}>Published</span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="w-4 h-4 rounded"
                  />
                  <span style={{ color: 'var(--color-text-secondary)' }}>Featured</span>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSaving} className="flex-1">
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

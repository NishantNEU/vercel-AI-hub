import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Plus, Search, Edit, Trash2, Loader2, X, ArrowLeft,
  BookOpen, Play, Clock, GripVertical, FileText, Video, HelpCircle
} from 'lucide-react';
import { coursesAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const emptyLesson = {
  title: '',
  content: '',
  videoUrl: '',
  duration: 15,
  order: 1
};

// Extract YouTube video ID from URL
const getYouTubeVideoId = (url) => {
  if (!url) return null;
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return match ? match[1] : null;
};

export default function AdminLessons() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [formData, setFormData] = useState(emptyLesson);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [courseId]);

  const loadCourse = async () => {
    try {
      setIsLoading(true);
      const response = await coursesAPI.getOne(courseId);
      setCourse(response.data.data.course);
    } catch (error) {
      toast.error('Failed to load course');
      navigate('/admin/courses');
    } finally {
      setIsLoading(false);
    }
  };

  const openCreateModal = () => {
    setEditingLesson(null);
    setFormData({
      ...emptyLesson,
      order: (course?.lessons?.length || 0) + 1
    });
    setShowModal(true);
  };

  const openEditModal = (lesson) => {
    setEditingLesson(lesson);
    setFormData({
      title: lesson.title || '',
      content: lesson.content || '',
      videoUrl: lesson.videoUrl || '',
      duration: lesson.duration || 15,
      order: lesson.order || 1
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingLesson(null);
    setFormData(emptyLesson);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.content) {
      toast.error('Please fill in title and content');
      return;
    }

    setIsSaving(true);
    try {
      if (editingLesson) {
        // Update lesson
        await coursesAPI.updateLesson(courseId, editingLesson._id, formData);
        toast.success('Lesson updated successfully');
      } else {
        // Add new lesson
        await coursesAPI.addLesson(courseId, formData);
        toast.success('Lesson added successfully');
      }
      
      closeModal();
      loadCourse();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save lesson');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (lessonId) => {
    if (!confirm('Are you sure you want to delete this lesson?')) return;
    
    try {
      await coursesAPI.deleteLesson(courseId, lessonId);
      toast.success('Lesson deleted');
      loadCourse();
    } catch (error) {
      toast.error('Failed to delete lesson');
    }
  };

  const lessons = course?.lessons || [];
  const filteredLessons = lessons
    .filter(lesson => lesson.title?.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => a.order - b.order);

  const totalDuration = lessons.reduce((acc, lesson) => acc + (lesson.duration || 0), 0);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  return (
    <div>
      {/* Back Button & Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate('/admin/courses')}
          className="flex items-center gap-2 mb-4 hover:opacity-80 transition-opacity"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Courses
        </button>
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>
              {course?.title}
            </h1>
            <p style={{ color: 'var(--color-text-secondary)' }}>
              Manage lessons • {lessons.length} lessons • {totalDuration} min total
            </p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="secondary"
              onClick={() => navigate(`/admin/courses/${courseId}/quiz`)}
            >
              <HelpCircle className="w-4 h-4" />
              Quiz ({course?.quiz?.length || 0})
            </Button>
            <Button onClick={openCreateModal}>
              <Plus className="w-4 h-4" />
              Add Lesson
            </Button>
          </div>
        </div>
      </div>

      {/* Course Info Card */}
      <div 
        className="card p-4 mb-6 flex items-center gap-4"
        style={{ borderLeft: '4px solid var(--color-primary)' }}
      >
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
        >
          <BookOpen className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            {course?.shortDescription || course?.description?.substring(0, 100) + '...'}
          </p>
          <div className="flex items-center gap-4 mt-1">
            <span 
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}
            >
              {course?.category?.replace('-', ' ')}
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full capitalize"
              style={{ 
                backgroundColor: course?.isPublished ? 'rgba(0,227,165,0.1)' : 'rgba(251,191,36,0.1)',
                color: course?.isPublished ? 'var(--color-primary)' : '#FBBF24'
              }}
            >
              {course?.isPublished ? 'Published' : 'Draft'}
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'rgba(0,209,255,0.1)', color: 'var(--color-secondary)' }}
            >
              {course?.quiz?.length || 0} quiz questions
            </span>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search lessons..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)'
            }}
          />
        </div>
      </div>

      {/* Lessons List */}
      <div className="card overflow-hidden">
        {filteredLessons.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {lessons.length === 0 ? 'No lessons yet. Add your first lesson!' : 'No lessons found'}
            </p>
            {lessons.length === 0 && (
              <Button onClick={openCreateModal} className="mt-4">
                <Plus className="w-4 h-4" />
                Add First Lesson
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y" style={{ borderColor: 'var(--color-border)' }}>
            {filteredLessons.map((lesson, index) => (
              <div 
                key={lesson._id} 
                className="p-4 flex items-center gap-4 hover:bg-[var(--color-bg)] transition-colors"
              >
                {/* Order Number */}
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'white' }}
                >
                  {lesson.order || index + 1}
                </div>

                {/* Lesson Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium truncate" style={{ color: 'var(--color-text)' }}>
                      {lesson.title}
                    </p>
                    {lesson.videoUrl && (
                      <Video className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-primary)' }} />
                    )}
                  </div>
                  <p 
                    className="text-sm truncate mt-0.5" 
                    style={{ color: 'var(--color-text-muted)' }}
                  >
                    {lesson.content?.substring(0, 80)}...
                  </p>
                </div>

                {/* Duration */}
                <div 
                  className="flex items-center gap-1 text-sm flex-shrink-0"
                  style={{ color: 'var(--color-text-secondary)' }}
                >
                  <Clock className="w-4 h-4" />
                  {lesson.duration || 0} min
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(lesson)}
                    className="p-2 rounded-lg hover:bg-[var(--color-surface)] transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(lesson._id)}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={closeModal} />
          <div 
            className="relative w-full max-w-2xl rounded-xl p-6 max-h-[90vh] overflow-y-auto"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold" style={{ color: 'var(--color-text)' }}>
                {editingLesson ? 'Edit Lesson' : 'Add New Lesson'}
              </h2>
              <button onClick={closeModal}>
                <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Lesson Title *"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Introduction to Neural Networks"
              />

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Content *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Lesson content... (Markdown supported)"
                  rows={8}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
                  style={{ 
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>

              <Input
                label="Video URL (Optional)"
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=xxxxx"
              />
              
              {/* YouTube Preview */}
              {formData.videoUrl && getYouTubeVideoId(formData.videoUrl) && (
                <div className="rounded-lg overflow-hidden" style={{ backgroundColor: 'var(--color-bg)' }}>
                  <div className="aspect-video">
                    <iframe
                      src={`https://www.youtube.com/embed/${getYouTubeVideoId(formData.videoUrl)}`}
                      className="w-full h-full"
                      allowFullScreen
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    />
                  </div>
                  <p className="text-xs p-2 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    ✓ Valid YouTube URL detected
                  </p>
                </div>
              )}
              
              {formData.videoUrl && !getYouTubeVideoId(formData.videoUrl) && (
                <p className="text-xs text-red-400">
                  ⚠️ Invalid YouTube URL. Use format: https://www.youtube.com/watch?v=VIDEO_ID
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="Duration (minutes)"
                  type="number"
                  min="1"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 15 })}
                />

                <Input
                  label="Order"
                  type="number"
                  min="1"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) || 1 })}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSaving} className="flex-1">
                  {editingLesson ? 'Update Lesson' : 'Add Lesson'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Plus, Search, Edit, Trash2, Loader2, X, ArrowLeft,
  HelpCircle, CheckCircle, XCircle, GripVertical
} from 'lucide-react';
import { coursesAPI } from '../../services/api';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import toast from 'react-hot-toast';

const emptyQuestion = {
  question: '',
  options: ['', '', '', ''],
  correctAnswer: 0,
  explanation: ''
};

export default function AdminQuiz() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [editingIndex, setEditingIndex] = useState(null);
  const [formData, setFormData] = useState(emptyQuestion);
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
    setEditingQuestion(null);
    setEditingIndex(null);
    setFormData(emptyQuestion);
    setShowModal(true);
  };

  const openEditModal = (question, index) => {
    setEditingQuestion(question);
    setEditingIndex(index);
    // Ensure we have 4 options
    const options = [...(question.options || [])];
    while (options.length < 4) options.push('');
    
    setFormData({
      question: question.question || '',
      options: options,
      correctAnswer: question.correctAnswer || 0,
      explanation: question.explanation || ''
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingQuestion(null);
    setEditingIndex(null);
    setFormData(emptyQuestion);
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...formData.options];
    newOptions[index] = value;
    setFormData({ ...formData, options: newOptions });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.question) {
      toast.error('Please enter a question');
      return;
    }

    const validOptions = formData.options.filter(opt => opt.trim() !== '');
    if (validOptions.length < 2) {
      toast.error('Please provide at least 2 options');
      return;
    }

    if (formData.correctAnswer >= validOptions.length) {
      toast.error('Please select a valid correct answer');
      return;
    }

    setIsSaving(true);
    try {
      const questionData = {
        question: formData.question,
        options: validOptions,
        correctAnswer: formData.correctAnswer,
        explanation: formData.explanation
      };

      if (editingQuestion) {
        // Update existing question - we need to update the entire quiz array
        const updatedQuiz = [...(course.quiz || [])];
        updatedQuiz[editingIndex] = { ...updatedQuiz[editingIndex], ...questionData };
        
        await coursesAPI.update(courseId, { quiz: updatedQuiz });
        toast.success('Question updated successfully');
      } else {
        // Add new question
        await coursesAPI.addQuiz(courseId, { questions: [questionData] });
        toast.success('Question added successfully');
      }
      
      closeModal();
      loadCourse();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save question');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (questionIndex) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    
    try {
      const updatedQuiz = course.quiz.filter((_, index) => index !== questionIndex);
      await coursesAPI.update(courseId, { quiz: updatedQuiz });
      toast.success('Question deleted');
      loadCourse();
    } catch (error) {
      toast.error('Failed to delete question');
    }
  };

  const quiz = course?.quiz || [];
  const filteredQuiz = quiz.filter(q => 
    q.question?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
              Manage Quiz • {quiz.length} questions
            </p>
          </div>
          <Button onClick={openCreateModal}>
            <Plus className="w-4 h-4" />
            Add Question
          </Button>
        </div>
      </div>

      {/* Course Info Card */}
      <div 
        className="card p-4 mb-6 flex items-center gap-4"
        style={{ borderLeft: '4px solid var(--color-secondary)' }}
      >
        <div 
          className="w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: 'rgba(0,209,255,0.1)' }}
        >
          <HelpCircle className="w-6 h-6" style={{ color: 'var(--color-secondary)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
            Quiz questions test student understanding after completing lessons.
            Students need 70% to pass.
          </p>
          <div className="flex items-center gap-4 mt-1">
            <span 
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}
            >
              {course?.lessons?.length || 0} lessons
            </span>
            <span 
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: course?.isPublished ? 'rgba(0,227,165,0.1)' : 'rgba(251,191,36,0.1)',
                color: course?.isPublished ? 'var(--color-primary)' : '#FBBF24'
              }}
            >
              {course?.isPublished ? 'Published' : 'Draft'}
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
            placeholder="Search questions..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
            style={{ 
              backgroundColor: 'var(--color-surface)',
              borderColor: 'var(--color-border)',
              color: 'var(--color-text)'
            }}
          />
        </div>
      </div>

      {/* Quiz Questions List */}
      <div className="space-y-4">
        {filteredQuiz.length === 0 ? (
          <div className="card text-center py-12">
            <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p style={{ color: 'var(--color-text-secondary)' }}>
              {quiz.length === 0 ? 'No quiz questions yet. Add your first question!' : 'No questions match your search'}
            </p>
            {quiz.length === 0 && (
              <Button onClick={openCreateModal} className="mt-4">
                <Plus className="w-4 h-4" />
                Add First Question
              </Button>
            )}
          </div>
        ) : (
          filteredQuiz.map((question, index) => (
            <div 
              key={question._id || index}
              className="card p-4"
            >
              <div className="flex items-start gap-4">
                {/* Question Number */}
                <div 
                  className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm font-medium"
                  style={{ backgroundColor: 'var(--color-secondary)', color: 'white' }}
                >
                  {index + 1}
                </div>

                {/* Question Content */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium mb-3" style={{ color: 'var(--color-text)' }}>
                    {question.question}
                  </p>

                  {/* Options */}
                  <div className="space-y-2 mb-3">
                    {question.options?.map((option, optIndex) => (
                      <div 
                        key={optIndex}
                        className={`flex items-center gap-2 p-2 rounded-lg text-sm ${
                          optIndex === question.correctAnswer ? 'bg-green-500/10' : ''
                        }`}
                        style={{ 
                          backgroundColor: optIndex === question.correctAnswer ? 'rgba(16,185,129,0.1)' : 'var(--color-bg)'
                        }}
                      >
                        {optIndex === question.correctAnswer ? (
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--color-text-muted)' }} />
                        )}
                        <span style={{ color: optIndex === question.correctAnswer ? '#10B981' : 'var(--color-text-secondary)' }}>
                          {option}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Explanation */}
                  {question.explanation && (
                    <p className="text-sm p-2 rounded-lg" style={{ backgroundColor: 'var(--color-bg)', color: 'var(--color-text-muted)' }}>
                      <span className="font-medium">Explanation:</span> {question.explanation}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => openEditModal(question, index)}
                    className="p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
                    style={{ color: 'var(--color-text-secondary)' }}
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(index)}
                    className="p-2 rounded-lg hover:bg-red-500/10 transition-colors text-red-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
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
                {editingQuestion ? 'Edit Question' : 'Add New Question'}
              </h2>
              <button onClick={closeModal}>
                <X className="w-5 h-5" style={{ color: 'var(--color-text-secondary)' }} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Question *
                </label>
                <textarea
                  value={formData.question}
                  onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                  placeholder="Enter your question..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
                  style={{ 
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Options * (minimum 2)
                </label>
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctAnswer"
                        checked={formData.correctAnswer === index}
                        onChange={() => setFormData({ ...formData, correctAnswer: index })}
                        className="w-4 h-4"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1 px-4 py-2 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
                        style={{ 
                          backgroundColor: 'var(--color-bg)',
                          borderColor: formData.correctAnswer === index ? 'var(--color-primary)' : 'var(--color-border)',
                          color: 'var(--color-text)'
                        }}
                      />
                      {formData.correctAnswer === index && (
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  Select the radio button next to the correct answer
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: 'var(--color-text-secondary)' }}>
                  Explanation (Optional)
                </label>
                <textarea
                  value={formData.explanation}
                  onChange={(e) => setFormData({ ...formData, explanation: e.target.value })}
                  placeholder="Explain why this is the correct answer..."
                  rows={2}
                  className="w-full px-4 py-3 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
                  style={{ 
                    backgroundColor: 'var(--color-bg)',
                    borderColor: 'var(--color-border)',
                    color: 'var(--color-text)'
                  }}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="secondary" onClick={closeModal} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" isLoading={isSaving} className="flex-1">
                  {editingQuestion ? 'Update Question' : 'Add Question'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

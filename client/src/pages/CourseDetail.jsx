import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  BookOpen, Clock, Users, Star, Play, CheckCircle,
  Lock, ChevronDown, ChevronUp, Loader2, ArrowLeft,
  GraduationCap, Award, FileText, HelpCircle, X,
  ChevronLeft, ChevronRight, Trophy, RefreshCw, Download
} from 'lucide-react';
import { coursesAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';

export default function CourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  
  const [course, setCourse] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [expandedLessons, setExpandedLessons] = useState([0]);
  
  // Lesson Viewer State
  const [showLessonViewer, setShowLessonViewer] = useState(false);
  const [currentLessonIndex, setCurrentLessonIndex] = useState(0);
  const [isCompletingLesson, setIsCompletingLesson] = useState(false);
  
  // Quiz State
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizResult, setQuizResult] = useState(null);
  const [isSubmittingQuiz, setIsSubmittingQuiz] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  // Certificate State
  const [showCertificate, setShowCertificate] = useState(false);

  useEffect(() => {
    loadCourse();
  }, [id]);

  const loadCourse = async () => {
    try {
      setIsLoading(true);
      const response = await coursesAPI.getOne(id);
      setCourse(response.data.data.course);
      setEnrollment(response.data.data.enrollment || null);
    } catch (error) {
      console.error('Failed to load course:', error);
      toast.error('Failed to load course');
      navigate('/courses');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to enroll');
      navigate('/login');
      return;
    }

    try {
      setIsEnrolling(true);
      await coursesAPI.enroll(id);
      toast.success('Successfully enrolled!');
      loadCourse();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to enroll');
    } finally {
      setIsEnrolling(false);
    }
  };

  const toggleLesson = (index) => {
    setExpandedLessons(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const openLesson = (index) => {
    if (!isEnrolled) {
      toast.error('Please enroll to access lessons');
      return;
    }
    setCurrentLessonIndex(index);
    setShowLessonViewer(true);
  };

  const completeLesson = async () => {
    const lesson = course.lessons[currentLessonIndex];
    if (!lesson) return;

    try {
      setIsCompletingLesson(true);
      await coursesAPI.completeLesson(id, lesson._id);
      toast.success('Lesson completed!');
      await loadCourse();
      
      // Auto-advance to next lesson
      if (currentLessonIndex < course.lessons.length - 1) {
        setCurrentLessonIndex(currentLessonIndex + 1);
      }
    } catch (error) {
      toast.error('Failed to mark lesson as complete');
    } finally {
      setIsCompletingLesson(false);
    }
  };

  const isLessonCompleted = (lessonId) => {
    return enrollment?.completedLessons?.some(cl => cl.lessonId === lessonId);
  };

  // Quiz Functions
  const startQuiz = () => {
    if (!course.quiz || course.quiz.length === 0) {
      toast.error('No quiz available for this course');
      return;
    }
    setQuizAnswers({});
    setQuizResult(null);
    setCurrentQuestionIndex(0);
    setShowQuiz(true);
  };

  const selectAnswer = (questionId, answerIndex) => {
    setQuizAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const submitQuiz = async () => {
    // Check if all questions answered
    const unanswered = course.quiz.filter(q => quizAnswers[q._id] === undefined);
    if (unanswered.length > 0) {
      toast.error(`Please answer all questions (${unanswered.length} remaining)`);
      return;
    }

    try {
      setIsSubmittingQuiz(true);
      const answers = course.quiz.map(q => ({
        questionId: q._id,
        selectedAnswer: quizAnswers[q._id]
      }));
      
      const response = await coursesAPI.submitQuiz(id, answers);
      setQuizResult(response.data.data);
      toast.success(`Quiz submitted! Score: ${response.data.data.percentage}%`);
      loadCourse(); // Refresh to get updated enrollment data
    } catch (error) {
      toast.error('Failed to submit quiz');
    } finally {
      setIsSubmittingQuiz(false);
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'Self-paced';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins} min`;
    if (mins === 0) return `${hours} hr`;
    return `${hours} hr ${mins} min`;
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'beginner': return '#00E3A5';
      case 'intermediate': return '#4FC3F7';
      case 'advanced': return '#F472B6';
      default: return '#00E3A5';
    }
  };

  // Embed YouTube video
  const getYouTubeEmbedUrl = (url) => {
    if (!url) return null;
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  // Download certificate as image
  const downloadCertificate = async () => {
    const certificate = document.getElementById('certificate');
    if (!certificate) return;

    try {
      // Use html2canvas if available, otherwise use a simple approach
      if (window.html2canvas) {
        const canvas = await window.html2canvas(certificate, {
          backgroundColor: '#0D0D0D',
          scale: 2
        });
        const link = document.createElement('a');
        link.download = `${course?.title?.replace(/[^a-zA-Z0-9]/g, '_')}_Certificate.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      } else {
        // Fallback: Print the certificate
        const printWindow = window.open('', '_blank');
        printWindow.document.write(`
          <html>
            <head>
              <title>Certificate - ${course?.title}</title>
              <style>
                body { 
                  margin: 0; 
                  padding: 20px;
                  background: #0D0D0D;
                  font-family: Georgia, serif;
                }
                .certificate {
                  max-width: 800px;
                  margin: 0 auto;
                  padding: 40px;
                  background: linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 50%, #0D0D0D 100%);
                  border: 2px solid rgba(0,227,165,0.3);
                  border-radius: 8px;
                  text-align: center;
                  color: white;
                }
                .logo { color: #00E3A5; font-size: 24px; margin-bottom: 20px; }
                .title { font-size: 32px; margin: 10px 0; }
                .name { color: #00E3A5; font-size: 28px; margin: 20px 0; }
                .course { font-size: 22px; margin: 20px 0; }
                .score { color: #00E3A5; margin: 20px 0; }
                .date { color: #888; font-size: 14px; }
              </style>
            </head>
            <body>
              <div class="certificate">
                <div class="logo">ðŸŽ“ AI Super Hub</div>
                <div class="title">Certificate of Completion</div>
                <p>This is to certify that</p>
                <div class="name">${user?.name || 'Student'}</div>
                <p>has successfully completed the course</p>
                <div class="course">${course?.title}</div>
                <div class="score">Quiz Score: ${quizResult?.percentage || enrollment?.bestQuizScore || 0}%</div>
                <div class="date">Completed on ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                <p style="font-size: 10px; margin-top: 20px;">Certificate ID: ${enrollment?._id?.slice(-8).toUpperCase() || 'XXXXXXXX'}</p>
              </div>
              <script>window.print(); window.close();</script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
      toast.success('Certificate downloaded!');
    } catch (error) {
      console.error('Failed to download certificate:', error);
      toast.error('Failed to download certificate');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: 'var(--color-primary)' }} />
      </div>
    );
  }

  if (!course) return null;

  const isEnrolled = !!enrollment;
  const completedLessons = enrollment?.completedLessons?.length || 0;
  const totalLessons = course.lessons?.length || 0;
  const progress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const currentLesson = course.lessons?.[currentLessonIndex];
  const allLessonsCompleted = completedLessons === totalLessons && totalLessons > 0;
  const hasQuiz = course.quiz && course.quiz.length > 0;
  const currentQuestion = course.quiz?.[currentQuestionIndex];

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Hero Section */}
      <div className="relative py-12 overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[var(--color-primary)] opacity-5 rounded-full blur-[128px]" />
        </div>
        
        <div className="container-custom">
          {/* Back Button */}
          <button 
            onClick={() => navigate('/courses')}
            className="flex items-center gap-2 mb-6 transition-colors hover:text-[var(--color-primary)]"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Courses
          </button>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Course Info */}
            <div className="lg:col-span-2">
              {/* Badges */}
              <div className="flex items-center gap-2 mb-4">
                <span 
                  className="text-xs px-3 py-1 rounded-full"
                  style={{ 
                    backgroundColor: 'rgba(0,227,165,0.1)',
                    color: 'var(--color-primary)'
                  }}
                >
                  {course.category?.replace('-', ' ')}
                </span>
                <span 
                  className="text-xs px-3 py-1 rounded-full capitalize"
                  style={{ 
                    backgroundColor: `${getDifficultyColor(course.difficulty)}20`,
                    color: getDifficultyColor(course.difficulty)
                  }}
                >
                  {course.difficulty}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
                {course.title}
              </h1>

              <p className="text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                {course.shortDescription || course.description}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <Clock className="w-5 h-5" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <BookOpen className="w-5 h-5" />
                  <span>{totalLessons} Lessons</span>
                </div>
                <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                  <Users className="w-5 h-5" />
                  <span>{course.enrollmentCount || 0} Students</span>
                </div>
                {hasQuiz && (
                  <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                    <HelpCircle className="w-5 h-5" />
                    <span>{course.quiz.length} Quiz Questions</span>
                  </div>
                )}
              </div>

              {/* Instructor */}
              {course.instructor?.name && (
                <div className="flex items-center gap-3">
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}
                  >
                    {course.instructor.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Instructor</p>
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>{course.instructor.name}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Enrollment Card */}
            <div className="lg:col-span-1">
              <div className="card sticky top-24">
                {isEnrolled ? (
                  <>
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Your Progress</span>
                        <span className="text-sm font-medium" style={{ color: 'var(--color-primary)' }}>{progress}%</span>
                      </div>
                      <div 
                        className="h-2 rounded-full overflow-hidden"
                        style={{ backgroundColor: 'var(--color-bg)' }}
                      >
                        <div 
                          className="h-full rounded-full transition-all"
                          style={{ 
                            width: `${progress}%`,
                            backgroundColor: 'var(--color-primary)'
                          }}
                        />
                      </div>
                      <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                        {completedLessons} of {totalLessons} lessons completed
                      </p>

                      {/* Course Completed Badge */}
                      {enrollment?.certificateIssued && enrollment?.status === 'completed' && (
                        <div className="mt-3 p-3 rounded-lg flex items-center gap-2" style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}>
                          <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                          <div>
                            <p className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
                              Course Completed! 🎉
                            </p>
                            <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                              Certificate earned on {new Date(enrollment.completedAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      )}
                    </div>

                    <Button 
                      className="w-full mb-3" 
                      size="lg"
                      onClick={() => openLesson(0)}
                    >
                      <Play className="w-5 h-5" />
                      {completedLessons === 0 ? 'Start Learning' : 'Continue Learning'}
                    </Button>

                    {/* Quiz Button */}
                    {hasQuiz && (
                      <Button 
                        className="w-full" 
                        size="lg"
                        variant={allLessonsCompleted ? 'primary' : 'secondary'}
                        onClick={startQuiz}
                        disabled={!allLessonsCompleted}
                      >
                        <HelpCircle className="w-5 h-5" />
                        {allLessonsCompleted ? 'Take Quiz' : `Complete all lessons to unlock quiz`}
                      </Button>
                    )}

                    {/* Best Quiz Score */}
                    {enrollment?.bestQuizScore > 0 && (
                      <div className="mt-4 p-3 rounded-lg" style={{ backgroundColor: 'var(--color-bg)' }}>
                        <div className="flex items-center gap-2">
                          <Trophy className="w-5 h-5" style={{ color: enrollment.bestQuizScore >= 70 ? '#FBBF24' : 'var(--color-text-muted)' }} />
                          <span style={{ color: 'var(--color-text-secondary)' }}>Best Score:</span>
                          <span className="font-bold" style={{ color: enrollment.bestQuizScore >= 70 ? 'var(--color-primary)' : '#EF4444' }}>
                            {enrollment.bestQuizScore}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Certificate Button - Show if passed quiz */}
                    {enrollment?.bestQuizScore >= 70 && (
                      <Button 
                        className="w-full mt-3" 
                        variant={enrollment?.certificateIssued ? 'primary' : 'secondary'}
                        onClick={() => setShowCertificate(true)}
                      >
                        <Award className="w-5 h-5" />
                        {enrollment?.certificateIssued ? 'View Certificate' : 'Generate Certificate'}
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <div className="text-center mb-4">
                      <p className="text-2xl font-bold" style={{ color: 'var(--color-primary)' }}>Free</p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Full lifetime access</p>
                    </div>

                    <Button 
                      className="w-full" 
                      size="lg" 
                      onClick={handleEnroll}
                      isLoading={isEnrolling}
                    >
                      Enroll Now
                    </Button>
                  </>
                )}

                {/* Features */}
                <div className="mt-6 pt-6 space-y-3" style={{ borderTop: '1px solid var(--color-border)' }}>
                  <div className="flex items-center gap-3" style={{ color: 'var(--color-text-secondary)' }}>
                    <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                    <span className="text-sm">{totalLessons} comprehensive lessons</span>
                  </div>
                  {hasQuiz && (
                    <div className="flex items-center gap-3" style={{ color: 'var(--color-text-secondary)' }}>
                      <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                      <span className="text-sm">Quiz with {course.quiz.length} questions</span>
                    </div>
                  )}
                  <div className="flex items-center gap-3" style={{ color: 'var(--color-text-secondary)' }}>
                    <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                    <span className="text-sm">Certificate of completion</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="container-custom py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {/* About */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                About This Course
              </h2>
              <p style={{ color: 'var(--color-text-secondary)' }}>
                {course.description}
              </p>
            </div>

            {/* Learning Outcomes */}
            {course.learningOutcomes?.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                  What You'll Learn
                </h2>
                <div className="grid sm:grid-cols-2 gap-3">
                  {course.learningOutcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" style={{ color: 'var(--color-primary)' }} />
                      <span style={{ color: 'var(--color-text-secondary)' }}>{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {course.prerequisites?.length > 0 && (
              <div className="card">
                <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                  Prerequisites
                </h2>
                <ul className="space-y-2">
                  {course.prerequisites.map((prereq, idx) => (
                    <li key={idx} className="flex items-center gap-3" style={{ color: 'var(--color-text-secondary)' }}>
                      <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: 'var(--color-primary)' }} />
                      {prereq}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Course Content / Lessons */}
            <div className="card">
              <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
                Course Content
              </h2>
              <p className="text-sm mb-4" style={{ color: 'var(--color-text-muted)' }}>
                {totalLessons} lessons • {formatDuration(course.duration)} total
              </p>

              <div className="space-y-2">
                {course.lessons?.map((lesson, idx) => {
                  const isExpanded = expandedLessons.includes(idx);
                  const isCompleted = isLessonCompleted(lesson._id);

                  return (
                    <div 
                      key={lesson._id || idx}
                      className="rounded-lg overflow-hidden"
                      style={{ backgroundColor: 'var(--color-bg)' }}
                    >
                      <button
                        onClick={() => isEnrolled ? openLesson(idx) : toggleLesson(idx)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--color-surface)] transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                          ) : isEnrolled ? (
                            <Play className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                          ) : (
                            <Lock className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                          )}
                          <span style={{ color: 'var(--color-text)' }}>
                            {idx + 1}. {lesson.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            {formatDuration(lesson.duration)}
                          </span>
                          {!isEnrolled && (
                            isExpanded ? (
                              <ChevronUp className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                            ) : (
                              <ChevronDown className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                            )
                          )}
                        </div>
                      </button>

                      {isExpanded && !isEnrolled && (
                        <div className="px-4 pb-4">
                          <p className="text-sm pl-8" style={{ color: 'var(--color-text-secondary)' }}>
                            {lesson.content?.substring(0, 150)}...
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}

                {/* Quiz Section in Course Content */}
                {hasQuiz && (
                  <div 
                    className="rounded-lg overflow-hidden mt-4"
                    style={{ backgroundColor: 'rgba(0,209,255,0.1)', border: '1px solid var(--color-secondary)' }}
                  >
                    <div className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <HelpCircle className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
                        <div>
                          <span style={{ color: 'var(--color-text)' }}>Final Quiz</span>
                          <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                            {course.quiz.length} questions • 70% to pass
                          </p>
                        </div>
                      </div>
                      {isEnrolled && allLessonsCompleted ? (
                        <Button size="sm" onClick={startQuiz}>
                          Take Quiz
                        </Button>
                      ) : (
                        <Lock className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar - Tags */}
          <div className="lg:col-span-1">
            {course.tags?.length > 0 && (
              <div className="card">
                <h3 className="font-semibold mb-4" style={{ color: 'var(--color-text)' }}>Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {course.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-sm px-3 py-1 rounded-full"
                      style={{ 
                        backgroundColor: 'var(--color-bg)',
                        color: 'var(--color-text-secondary)'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ============================================ */}
      {/* LESSON VIEWER MODAL */}
      {/* ============================================ */}
      {showLessonViewer && currentLesson && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 border-b"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowLessonViewer(false)}
                className="p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  Lesson {currentLessonIndex + 1} of {totalLessons}
                </p>
                <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  {currentLesson.title}
                </h2>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                disabled={currentLessonIndex === 0}
                onClick={() => setCurrentLessonIndex(currentLessonIndex - 1)}
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                disabled={currentLessonIndex === totalLessons - 1}
                onClick={() => setCurrentLessonIndex(currentLessonIndex + 1)}
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-4xl mx-auto">
              {/* Video */}
              {currentLesson.videoUrl && getYouTubeEmbedUrl(currentLesson.videoUrl) && (
                <div className="aspect-video rounded-xl overflow-hidden mb-8">
                  <iframe
                    src={getYouTubeEmbedUrl(currentLesson.videoUrl)}
                    className="w-full h-full"
                    allowFullScreen
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  />
                </div>
              )}

              {/* Lesson Content */}
              <div 
                className="prose prose-invert max-w-none"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                {currentLesson.content?.split('\n').map((paragraph, idx) => (
                  <p key={idx} className="mb-4">{paragraph}</p>
                ))}
              </div>

              {/* Duration Info */}
              <div className="flex items-center gap-2 mt-8 pt-4" style={{ borderTop: '1px solid var(--color-border)' }}>
                <Clock className="w-4 h-4" style={{ color: 'var(--color-text-muted)' }} />
                <span style={{ color: 'var(--color-text-muted)' }}>
                  Estimated time: {formatDuration(currentLesson.duration)}
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div 
            className="p-4 border-t flex items-center justify-between"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-2">
              {isLessonCompleted(currentLesson._id) ? (
                <>
                  <CheckCircle className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
                  <span style={{ color: 'var(--color-primary)' }}>Completed</span>
                </>
              ) : (
                <span style={{ color: 'var(--color-text-muted)' }}>Not completed</span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {!isLessonCompleted(currentLesson._id) && (
                <Button onClick={completeLesson} isLoading={isCompletingLesson}>
                  <CheckCircle className="w-4 h-4" />
                  Mark as Complete
                </Button>
              )}
              
              {currentLessonIndex === totalLessons - 1 && hasQuiz && allLessonsCompleted && (
                <Button onClick={() => { setShowLessonViewer(false); startQuiz(); }}>
                  <HelpCircle className="w-4 h-4" />
                  Take Quiz
                </Button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* QUIZ MODAL */}
      {/* ============================================ */}
      {showQuiz && hasQuiz && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ backgroundColor: 'var(--color-bg)' }}>
          {/* Header */}
          <div 
            className="flex items-center justify-between p-4 border-b"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)' }}
          >
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowQuiz(false)}
                className="p-2 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
                style={{ color: 'var(--color-text-secondary)' }}
              >
                <X className="w-5 h-5" />
              </button>
              <div>
                <h2 className="font-semibold" style={{ color: 'var(--color-text)' }}>
                  {course.title} - Quiz
                </h2>
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {course.quiz.length} questions • 70% to pass
                </p>
              </div>
            </div>

            {!quizResult && (
              <div className="flex items-center gap-2">
                <span style={{ color: 'var(--color-text-muted)' }}>
                  {Object.keys(quizAnswers).length} of {course.quiz.length} answered
                </span>
              </div>
            )}
          </div>

          {/* Quiz Content */}
          <div className="flex-1 overflow-y-auto p-6 md:p-12">
            <div className="max-w-2xl mx-auto">
              {quizResult ? (
                /* Quiz Results */
                <div className="text-center">
                  <div 
                    className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ 
                      backgroundColor: quizResult.passed ? 'rgba(0,227,165,0.1)' : 'rgba(239,68,68,0.1)'
                    }}
                  >
                    {quizResult.passed ? (
                      <Trophy className="w-12 h-12" style={{ color: 'var(--color-primary)' }} />
                    ) : (
                      <RefreshCw className="w-12 h-12" style={{ color: '#EF4444' }} />
                    )}
                  </div>

                  <h2 className="text-3xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                    {quizResult.passed ? 'Congratulations!' : 'Keep Learning!'}
                  </h2>
                  
                  <p className="text-lg mb-6" style={{ color: 'var(--color-text-secondary)' }}>
                    {quizResult.passed 
                      ? 'You passed the quiz!'
                      : 'You need 70% to pass. Try again!'}
                  </p>

                  <div 
                    className="inline-flex items-center gap-4 px-8 py-4 rounded-xl mb-8"
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <div className="text-center">
                      <p className="text-4xl font-bold" style={{ color: quizResult.passed ? 'var(--color-primary)' : '#EF4444' }}>
                        {quizResult.percentage}%
                      </p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Score</p>
                    </div>
                    <div className="w-px h-12" style={{ backgroundColor: 'var(--color-border)' }} />
                    <div className="text-center">
                      <p className="text-4xl font-bold" style={{ color: 'var(--color-text)' }}>
                        {quizResult.score}/{quizResult.totalQuestions}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>Correct</p>
                    </div>
                  </div>

                  {/* Question Review */}
                  <div className="text-left space-y-4 mb-8">
                    <h3 className="font-semibold" style={{ color: 'var(--color-text)' }}>Review Answers</h3>
                    {course.quiz.map((question, idx) => {
                      const answer = quizResult.answers?.find(a => a.questionId === question._id);
                      return (
                        <div 
                          key={question._id}
                          className="p-4 rounded-lg"
                          style={{ 
                            backgroundColor: 'var(--color-surface)',
                            borderLeft: `4px solid ${answer?.isCorrect ? 'var(--color-primary)' : '#EF4444'}`
                          }}
                        >
                          <p className="font-medium mb-2" style={{ color: 'var(--color-text)' }}>
                            {idx + 1}. {question.question}
                          </p>
                          <p className="text-sm" style={{ color: answer?.isCorrect ? 'var(--color-primary)' : '#EF4444' }}>
                            Your answer: {question.options[answer?.selectedAnswer]}
                            {!answer?.isCorrect && (
                              <span style={{ color: 'var(--color-primary)' }}>
                                {' '}• Correct: {question.options[question.correctAnswer]}
                              </span>
                            )}
                          </p>
                          {question.explanation && (
                            <p className="text-sm mt-2" style={{ color: 'var(--color-text-muted)' }}>
                              {question.explanation}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  <div className="flex items-center justify-center gap-4">
                    <Button variant="secondary" onClick={() => setShowQuiz(false)}>
                      Back to Course
                    </Button>
                    {quizResult.passed && (
                      <Button onClick={() => setShowCertificate(true)}>
                        <Award className="w-4 h-4" />
                        View Certificate
                      </Button>
                    )}
                    {!quizResult.passed && (
                      <Button onClick={startQuiz}>
                        <RefreshCw className="w-4 h-4" />
                        Try Again
                      </Button>
                    )}
                  </div>
                </div>
              ) : (
                /* Quiz Questions */
                <>
                  {/* Progress Bar */}
                  <div className="mb-8">
                    <div className="flex justify-between text-sm mb-2">
                      <span style={{ color: 'var(--color-text-muted)' }}>Progress</span>
                      <span style={{ color: 'var(--color-text-muted)' }}>
                        Question {currentQuestionIndex + 1} of {course.quiz.length}
                      </span>
                    </div>
                    <div 
                      className="h-2 rounded-full overflow-hidden"
                      style={{ backgroundColor: 'var(--color-surface)' }}
                    >
                      <div 
                        className="h-full rounded-full transition-all"
                        style={{ 
                          width: `${((currentQuestionIndex + 1) / course.quiz.length) * 100}%`,
                          backgroundColor: 'var(--color-primary)'
                        }}
                      />
                    </div>
                  </div>

                  {/* Question */}
                  <div className="card mb-8">
                    <h3 className="text-xl font-semibold mb-6" style={{ color: 'var(--color-text)' }}>
                      {currentQuestion.question}
                    </h3>

                    <div className="space-y-3">
                      {currentQuestion.options.map((option, idx) => (
                        <button
                          key={idx}
                          onClick={() => selectAnswer(currentQuestion._id, idx)}
                          className={`w-full p-4 rounded-lg text-left transition-all ${
                            quizAnswers[currentQuestion._id] === idx ? 'ring-2 ring-[var(--color-primary)]' : ''
                          }`}
                          style={{ 
                            backgroundColor: quizAnswers[currentQuestion._id] === idx 
                              ? 'rgba(0,227,165,0.1)' 
                              : 'var(--color-bg)',
                            color: 'var(--color-text)'
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <div 
                              className="w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                              style={{ 
                                borderColor: quizAnswers[currentQuestion._id] === idx 
                                  ? 'var(--color-primary)' 
                                  : 'var(--color-border)'
                              }}
                            >
                              {quizAnswers[currentQuestion._id] === idx && (
                                <div 
                                  className="w-3 h-3 rounded-full"
                                  style={{ backgroundColor: 'var(--color-primary)' }}
                                />
                              )}
                            </div>
                            <span>{option}</span>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="secondary"
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
                    >
                      <ChevronLeft className="w-4 h-4" />
                      Previous
                    </Button>

                    {currentQuestionIndex === course.quiz.length - 1 ? (
                      <Button onClick={submitQuiz} isLoading={isSubmittingQuiz}>
                        Submit Quiz
                      </Button>
                    ) : (
                      <Button
                        onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
                      >
                        Next
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  {/* Question Dots */}
                  <div className="flex items-center justify-center gap-2 mt-8">
                    {course.quiz.map((q, idx) => (
                      <button
                        key={q._id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className="w-3 h-3 rounded-full transition-all"
                        style={{ 
                          backgroundColor: idx === currentQuestionIndex 
                            ? 'var(--color-primary)' 
                            : quizAnswers[q._id] !== undefined 
                              ? 'var(--color-secondary)' 
                              : 'var(--color-border)'
                        }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ============================================ */}
      {/* CERTIFICATE MODAL */}
      {/* ============================================ */}
      {showCertificate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 overflow-y-auto">
          <div 
            className="relative w-full max-w-4xl rounded-xl overflow-hidden my-8"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowCertificate(false)}
              className="absolute top-4 right-4 z-10 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors"
              style={{ color: 'white' }}
            >
              <X className="w-5 h-5" />
            </button>

            {/* Certificate Design */}
            <div 
              id="certificate"
              className="relative p-6 md:p-10"
              style={{ 
                background: 'linear-gradient(135deg, #0D0D0D 0%, #1a1a2e 50%, #0D0D0D 100%)'
              }}
            >
              {/* Decorative Border */}
              <div 
                className="absolute inset-3 rounded-lg pointer-events-none"
                style={{ 
                  border: '2px solid rgba(0,227,165,0.3)',
                  background: 'transparent'
                }}
              />
              
              {/* Corner Decorations */}
              <div className="absolute top-6 left-6 w-12 h-12 border-t-2 border-l-2" style={{ borderColor: 'var(--color-primary)' }} />
              <div className="absolute top-6 right-6 w-12 h-12 border-t-2 border-r-2" style={{ borderColor: 'var(--color-primary)' }} />
              <div className="absolute bottom-6 left-6 w-12 h-12 border-b-2 border-l-2" style={{ borderColor: 'var(--color-primary)' }} />
              <div className="absolute bottom-6 right-6 w-12 h-12 border-b-2 border-r-2" style={{ borderColor: 'var(--color-primary)' }} />

              {/* Content */}
              <div className="relative text-center py-6">
                {/* Logo */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  <div 
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #00E3A5, #00D1FF)' }}
                  >
                    <GraduationCap className="w-5 h-5 text-black" />
                  </div>
                  <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
                    AI Super Hub
                  </span>
                </div>

                {/* Title */}
                <h1 
                  className="text-2xl md:text-3xl font-serif mb-2"
                  style={{ color: 'var(--color-text)', fontFamily: 'Georgia, serif' }}
                >
                  Certificate of Completion
                </h1>
                
                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>This is to certify that</p>

                {/* User Name */}
                <h2 
                  className="text-xl md:text-2xl font-bold my-3"
                  style={{ 
                    color: 'var(--color-primary)',
                    textShadow: '0 0 20px rgba(0,227,165,0.3)'
                  }}
                >
                  {user?.name || 'Student'}
                </h2>

                <p className="text-sm" style={{ color: 'var(--color-text-muted)' }}>has successfully completed the course</p>

                {/* Course Name */}
                <h3 
                  className="text-lg md:text-xl font-semibold my-3"
                  style={{ color: 'var(--color-text)' }}
                >
                  {course?.title}
                </h3>

                {/* Score */}
                <div 
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-4"
                  style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
                >
                  <Trophy className="w-4 h-4" style={{ color: 'var(--color-primary)' }} />
                  <span className="text-sm" style={{ color: 'var(--color-primary)' }}>
                    Quiz Score: {quizResult?.percentage || enrollment?.bestQuizScore || 0}%
                  </span>
                </div>

                {/* Date */}
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  Completed on {new Date().toLocaleDateString('en-US', { 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </p>

                {/* Certificate ID */}
                <p className="text-xs mt-2" style={{ color: 'var(--color-text-muted)' }}>
                  Certificate ID: {enrollment?._id?.slice(-8).toUpperCase() || 'XXXXXXXX'}
                </p>
              </div>
            </div>

            {/* Download Buttons */}
            <div 
              className="flex items-center justify-center gap-4 p-4 border-t"
              style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--color-surface)' }}
            >
              <Button variant="secondary" onClick={() => setShowCertificate(false)}>
                Close
              </Button>
              <Button onClick={downloadCertificate}>
                <Download className="w-4 h-4" />
                Download Certificate
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

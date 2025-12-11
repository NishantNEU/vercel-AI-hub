import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  BookOpen, MessageSquare, Wrench, Trophy,
  Clock, Star, ArrowRight, Sparkles, Loader2,
  CheckCircle, Award
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import Button from '../components/ui/Button';

const quickActions = [
  { name: 'Start Chat', icon: MessageSquare, href: '/chat', color: 'from-primary to-emerald-400' },
  { name: 'Browse Tools', icon: Wrench, href: '/tools', color: 'from-secondary to-blue-400' },
  { name: 'Learn AI', icon: BookOpen, href: '/courses', color: 'from-purple-500 to-pink-400' },
  { name: 'AI Prompts', icon: Sparkles, href: '/prompts', color: 'from-cyan-500 to-blue-400' },
];

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, coursesRes] = await Promise.all([
        api.get('/users/me/stats'),
        api.get('/courses/my-courses')
      ]);
      setStats(statsRes.data.data);
      setEnrolledCourses(coursesRes.data.data.enrollments || []);
    } catch (error) {
      console.error('Failed to load dashboard:', error);
      setStats({ enrollmentsCount: 0, chatSessionsCount: 0, bookmarkedToolsCount: 0, learningHours: 0, completedCourses: 0 });
      setEnrolledCourses([]);
    } finally {
      setLoading(false);
    }
  };

  const statsCards = stats ? [
    { label: 'Courses Enrolled', value: stats.enrollmentsCount, icon: BookOpen, change: stats.completedCourses ? `${stats.completedCourses} completed` : 'Start learning', color: '#4FC3F7' },
    { label: 'Chat Sessions', value: stats.chatSessionsCount, icon: MessageSquare, change: 'Keep chatting', color: '#00E3A5' },
    { label: 'Tools Bookmarked', value: stats.bookmarkedToolsCount, icon: Star, change: 'Explore more', color: '#FFC107' },
    { label: 'Certificates Earned', value: stats.completedCourses || 0, icon: Trophy, change: 'Great progress!', color: '#A855F7' },
  ] : [];

  return (
    <div className="container-custom py-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-3xl font-bold mb-2">
          Welcome back, <span className="text-gradient">{user?.name?.split(' ')[0]}</span>! 👋
        </h1>
        <p className="text-text-secondary">Here's what's happening with your AI journey today.</p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {quickActions.map((action) => {
          const Icon = action.icon;
          return (
            <Link key={action.name} to={action.href}>
              <div className="card card-hover group">
                <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${action.color} p-3 group-hover:scale-110 transition-transform flex-shrink-0`}>
                    <Icon className="w-full h-full text-white" />
                  </div>
                  <div className="text-center sm:text-left">
                    <h3 className="font-semibold text-sm sm:text-base group-hover:text-primary transition-colors">{action.name}</h3>
                    <p className="text-xs sm:text-sm text-text-muted hidden sm:block">Quick access</p>
                  </div>
                  <ArrowRight className="w-5 h-5 text-text-muted ml-auto opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block" />
                </div>
              </div>
            </Link>
          );
        })}
      </motion.div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
        </div>
      ) : (
        <>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {statsCards.map((stat) => {
              const Icon = stat.icon;
              return (
                <div key={stat.label} className="card">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${stat.color}20` }}>
                      <Icon className="w-5 h-5" style={{ color: stat.color }} />
                    </div>
                  </div>
                  <p className="text-2xl sm:text-3xl font-bold mb-1" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs sm:text-sm font-medium mb-1" style={{ color: 'var(--color-text)' }}>{stat.label}</p>
                  <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>{stat.change}</p>
                </div>
              );
            })}
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-6">
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="card">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold" style={{ color: 'var(--color-text)' }}>My Courses</h2>
                <Link to="/courses" className="text-sm text-primary hover:underline">View all</Link>
              </div>
              
              {enrolledCourses.length > 0 ? (
                <div className="space-y-3">
                  {enrolledCourses.slice(0, 3).map((enrollment) => (
                    <Link key={enrollment._id} to={`/courses/${enrollment.course._id}`} className="block p-4 rounded-xl border border-[var(--color-border)] hover:border-purple-500/50 transition-all">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1 text-sm" style={{ color: 'var(--color-text)' }}>{enrollment.course.title}</h3>
                          <div className="flex items-center gap-2 text-xs">
                            {enrollment.progress?.completed ? (
                              <span className="flex items-center gap-1 text-green-400">
                                <CheckCircle className="w-3.5 h-3.5" />
                                Completed
                              </span>
                            ) : (
                              <span style={{ color: 'var(--color-text-muted)' }}>
                                {enrollment.progress?.percentage || 0}% complete
                              </span>
                            )}
                            {enrollment.certificate && (
                              <span className="flex items-center gap-1 text-yellow-400">
                                <Award className="w-3.5 h-3.5" />
                                Certificate earned
                              </span>
                            )}
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-text-muted flex-shrink-0" />
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" style={{ color: 'var(--color-text-muted)' }} />
                  <p className="mb-4" style={{ color: 'var(--color-text-secondary)' }}>You haven't enrolled in any courses yet</p>
                  <Link to="/courses"><Button>Browse Courses</Button></Link>
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }} className="card">
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>Your Activity</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <MessageSquare className="w-5 h-5 text-[#00E3A5]" />
                    <span style={{ color: 'var(--color-text-secondary)' }}>AI Chat</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{stats?.chatSessionsCount || 0} sessions</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Star className="w-5 h-5 text-[#FFC107]" />
                    <span style={{ color: 'var(--color-text-secondary)' }}>Bookmarks</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{stats?.bookmarkedToolsCount || 0} tools</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-5 h-5 text-[#A855F7]" />
                    <span style={{ color: 'var(--color-text-secondary)' }}>Certificates</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{stats?.completedCourses || 0} earned</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Clock className="w-5 h-5 text-[#4FC3F7]" />
                    <span style={{ color: 'var(--color-text-secondary)' }}>Learning Time</span>
                  </div>
                  <span className="font-semibold" style={{ color: 'var(--color-text)' }}>{stats?.learningHours || 0}h</span>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </div>
  );
}

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Users, Wrench, BookOpen, MessageSquare,
  TrendingUp, ArrowUpRight, ArrowDownRight,
  Plus, Eye, Sparkles
} from 'lucide-react';
import api from '../../services/api';
import Button from '../../components/ui/Button';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    tools: 0,
    courses: 0,
    prompts: 0,
    chats: 0
  });
  const [recentUsers, setRecentUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setIsLoading(true);
      
      // Load stats - these endpoints may need to be created in backend
      const [usersRes, toolsRes, coursesRes, promptsRes] = await Promise.all([
        api.get('/users?limit=5').catch(() => ({ data: { data: { users: [] }, meta: { pagination: { totalItems: 0 } } } })),
        api.get('/tools?limit=1').catch(() => ({ data: { meta: { pagination: { totalItems: 0 } } } })),
        api.get('/courses?limit=1').catch(() => ({ data: { meta: { pagination: { totalItems: 0 } } } })),
        api.get('/prompts/stats').catch(() => ({ data: { data: { total: 0 } } })),
      ]);

      setStats({
        users: usersRes.data?.meta?.pagination?.totalItems || usersRes.data?.data?.users?.length || 0,
        tools: toolsRes.data?.meta?.pagination?.totalItems || 0,
        courses: coursesRes.data?.meta?.pagination?.totalItems || 0,
        prompts: promptsRes.data?.data?.total || 0,
        chats: 0
      });

      setRecentUsers(usersRes.data?.data?.users || []);
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const statCards = [
    { 
      name: 'Total Users', 
      value: stats.users, 
      icon: Users, 
      change: '+12%',
      positive: true,
      href: '/admin/users',
      color: 'var(--color-primary)'
    },
    { 
      name: 'AI Tools', 
      value: stats.tools, 
      icon: Wrench, 
      change: '+5%',
      positive: true,
      href: '/admin/tools',
      color: 'var(--color-secondary)'
    },
    { 
      name: 'Courses', 
      value: stats.courses, 
      icon: BookOpen, 
      change: '+8%',
      positive: true,
      href: '/admin/courses',
      color: '#F472B6'
    },
    { 
      name: 'AI Prompts', 
      value: stats.prompts, 
      icon: Sparkles, 
      change: '+15%',
      positive: true,
      href: '/admin/prompts',
      color: '#A855F7'
    },
    { 
      name: 'Chat Sessions', 
      value: stats.chats, 
      icon: MessageSquare, 
      change: '+24%',
      positive: true,
      href: '/admin',
      color: '#FBBF24'
    },
  ];

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Dashboard</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Welcome to the admin panel</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link 
              key={stat.name}
              to={stat.href}
              className="block"
            >
              <div 
                className="rounded-xl p-6 transition-all hover:scale-105 cursor-pointer"
                style={{
                  background: 'var(--color-surface)',
                  border: '1px solid var(--color-border)',
                }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div 
                    className="w-12 h-12 rounded-lg flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${stat.color}20`,
                    }}
                  >
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                  {stat.positive ? (
                    <span className="flex items-center text-green-500 text-sm font-medium">
                      <ArrowUpRight className="w-4 h-4" />
                      {stat.change}
                    </span>
                  ) : (
                    <span className="flex items-center text-red-500 text-sm font-medium">
                      <ArrowDownRight className="w-4 h-4" />
                      {stat.change}
                    </span>
                  )}
                </div>
                <h3 className="text-2xl font-bold mb-1" style={{ color: 'var(--color-text)' }}>
                  {isLoading ? '...' : stat.value}
                </h3>
                <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  {stat.name}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div 
          className="rounded-xl p-6"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--color-text)' }}>
            Quick Actions
          </h2>
          <div className="space-y-3">
            <Link to="/admin/tools">
              <Button className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add New Tool
              </Button>
            </Link>
            <Link to="/admin/courses">
              <Button className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Create Course
              </Button>
            </Link>
            <Link to="/admin/prompts">
              <Button className="w-full justify-start">
                <Plus className="w-4 h-4 mr-2" />
                Add AI Prompt
              </Button>
            </Link>
            <Link to="/admin/users">
              <Button className="w-full justify-start">
                <Eye className="w-4 h-4 mr-2" />
                View All Users
              </Button>
            </Link>
          </div>
        </div>

        {/* Recent Users */}
        <div 
          className="rounded-xl p-6"
          style={{
            background: 'var(--color-surface)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold" style={{ color: 'var(--color-text)' }}>
              Recent Users
            </h2>
            <Link 
              to="/admin/users"
              className="text-sm hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              View all
            </Link>
          </div>
          <div className="space-y-3">
            {isLoading ? (
              <p style={{ color: 'var(--color-text-secondary)' }}>Loading...</p>
            ) : recentUsers.length === 0 ? (
              <p style={{ color: 'var(--color-text-secondary)' }}>No users yet</p>
            ) : (
              recentUsers.map((user) => (
                <div 
                  key={user._id}
                  className="flex items-center gap-3 p-3 rounded-lg"
                  style={{ background: 'var(--color-surface-hover)' }}
                >
                  <div 
                    className="w-10 h-10 rounded-full flex items-center justify-center font-semibold"
                    style={{ 
                      background: 'var(--color-primary)',
                      color: 'var(--color-bg)'
                    }}
                  >
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                      {user.name}
                    </p>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {user.email}
                    </p>
                  </div>
                  <span 
                    className="text-xs px-2 py-1 rounded"
                    style={{
                      background: user.role === 'admin' ? 'var(--color-primary)20' : 'var(--color-surface)',
                      color: user.role === 'admin' ? 'var(--color-primary)' : 'var(--color-text-secondary)',
                      border: '1px solid var(--color-border)'
                    }}
                  >
                    {user.role}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

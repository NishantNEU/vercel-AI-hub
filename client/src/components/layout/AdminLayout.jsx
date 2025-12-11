import { useState } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Users, Wrench, BookOpen, 
  Settings, LogOut, Menu, X, ChevronLeft,
  Sparkles, Mail
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../ui/ThemeToggle';

const sidebarLinks = [
  { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { name: 'Users', href: '/admin/users', icon: Users },
  { name: 'AI Tools', href: '/admin/tools', icon: Wrench },
  { name: 'Courses', href: '/admin/courses', icon: BookOpen },
  { name: 'AI Prompts', href: '/admin/prompts', icon: Sparkles },
  { name: 'Support', href: '/admin/support', icon: Mail },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen flex" style={{ backgroundColor: 'var(--color-bg)' }}>
      {/* Desktop Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col fixed top-0 left-0 h-full z-40 transition-all duration-300 ${
          sidebarOpen ? 'w-64' : 'w-20'
        }`}
        style={{ backgroundColor: 'var(--color-surface)', borderRight: '1px solid var(--color-border)' }}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          {sidebarOpen ? (
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[var(--color-bg)]" />
              </div>
              <span className="font-bold" style={{ color: 'var(--color-text)' }}>Admin Panel</span>
            </Link>
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center mx-auto">
              <Sparkles className="w-5 h-5 text-[var(--color-bg)]" />
            </div>
          )}
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-1.5 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <ChevronLeft className={`w-5 h-5 transition-transform ${!sidebarOpen && 'rotate-180'}`} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive ? 'bg-[rgba(0,227,165,0.1)]' : 'hover:bg-[var(--color-bg)]'
                }`}
                style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
              >
                <Icon className="w-5 h-5 shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{link.name}</span>}
              </Link>
            );
          })}
        </nav>

        {/* User Section */}
        <div className="p-4" style={{ borderTop: '1px solid var(--color-border)' }}>
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-[var(--color-bg)] transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Settings className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Settings</span>}
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 transition-colors text-red-400"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            {sidebarOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Mobile Sidebar */}
      <aside 
        className={`lg:hidden fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="h-16 flex items-center justify-between px-4" style={{ borderBottom: '1px solid var(--color-border)' }}>
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)] flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-[var(--color-bg)]" />
            </div>
            <span className="font-bold" style={{ color: 'var(--color-text)' }}>Admin</span>
          </Link>
          <button onClick={() => setMobileSidebarOpen(false)}>
            <X className="w-6 h-6" style={{ color: 'var(--color-text)' }} />
          </button>
        </div>
        <nav className="p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.href;
            return (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setMobileSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  isActive ? 'bg-[rgba(0,227,165,0.1)]' : ''
                }`}
                style={{ color: isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)' }}
              >
                <Icon className="w-5 h-5" />
                <span className="text-sm font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-20'}`}>
        {/* Top Bar */}
        <header 
          className="h-16 flex items-center justify-between px-4 lg:px-8 sticky top-0 z-30"
          style={{ backgroundColor: 'var(--color-surface)', borderBottom: '1px solid var(--color-border)' }}
        >
          <button 
            onClick={() => setMobileSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-bg)]"
            style={{ color: 'var(--color-text)' }}
          >
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex-1" />

          <div className="flex items-center gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-3">
              <div 
                className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium"
                style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}
              >
                {user?.name?.charAt(0).toUpperCase()}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium" style={{ color: 'var(--color-text)' }}>{user?.name}</p>
                <p className="text-xs" style={{ color: 'var(--color-text-muted)' }}>Administrator</p>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

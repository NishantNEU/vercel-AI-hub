import { motion } from 'framer-motion';
import { 
  Book, Code, Zap, Shield, Database, Cloud,
  ChevronRight, ExternalLink, Terminal, FileCode
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Documentation() {
  const sections = [
    {
      icon: Zap,
      title: 'Getting Started',
      description: 'Quick start guide to begin using AI Super Hub',
      links: [
        { name: 'Installation Guide', href: '#installation' },
        { name: 'Your First Course', href: '#first-course' },
        { name: 'Setting Up Profile', href: '#profile-setup' },
        { name: 'Understanding Roles', href: '#roles' },
      ]
    },
    {
      icon: Book,
      title: 'Features',
      description: 'Learn about all platform features',
      links: [
        { name: 'AI Chat Guide', href: '#ai-chat' },
        { name: 'Course System', href: '#courses' },
        { name: 'AI Tools Directory', href: '#tools' },
        { name: 'Prompt Library', href: '#prompts' },
        { name: 'Certificates', href: '#certificates' },
      ]
    },
    {
      icon: Shield,
      title: 'Authentication',
      description: 'User authentication and security',
      links: [
        { name: 'Creating an Account', href: '#register' },
        { name: 'Google OAuth Login', href: '#oauth' },
        { name: 'Password Reset', href: '#password-reset' },
        { name: 'Email Verification', href: '#email-verify' },
      ]
    },
    {
      icon: Code,
      title: 'For Developers',
      description: 'Technical documentation for developers',
      links: [
        { name: 'API Reference', href: '/api-docs', external: true },
        { name: 'Tech Stack', href: '#tech-stack' },
        { name: 'Architecture', href: '#architecture' },
        { name: 'Contributing', href: '#contributing' },
      ]
    },
  ];

  const quickLinks = [
    { name: 'Browse Courses', href: '/courses', icon: Book },
    { name: 'Explore Tools', href: '/tools', icon: Code },
    { name: 'AI Chat', href: '/chat', icon: Terminal },
    { name: 'Get Support', href: '/support', icon: Shield },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-custom max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm mb-6">
            <Book className="w-4 h-4" />
            Documentation
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            Documentation & Guides
          </h1>
          
          <p className="text-xl max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Everything you need to know about using AI Super Hub effectively
          </p>
        </motion.div>

        {/* Quick Links */}
        <div className="grid md:grid-cols-4 gap-4 mb-16">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={link.href}
                  className="card group hover:border-purple-500/50 transition-all block"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-cyan-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-purple-400" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium" style={{ color: 'var(--color-text)' }}>
                        {link.name}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Documentation Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-16">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 + index * 0.1 }}
                className="card"
              >
                <div className="flex items-start gap-4 mb-6">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-2" style={{ color: 'var(--color-text)' }}>
                      {section.title}
                    </h2>
                    <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                      {section.description}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  {section.links.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--color-surface-hover)] transition-colors group"
                    >
                      <span className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                        {link.name}
                      </span>
                      {link.external ? (
                        <ExternalLink className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      )}
                    </a>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Key Sections */}
        <div className="space-y-12">
          {/* Installation */}
          <div id="installation" className="card">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--color-text)' }}>
              <Terminal className="w-6 h-6 text-[var(--color-primary)]" />
              Installation
            </h2>
            <div className="space-y-4" style={{ color: 'var(--color-text-secondary)' }}>
              <p>To run AI Super Hub locally, follow these steps:</p>
              
              <div className="bg-[var(--color-surface-elevated)] rounded-xl p-4 font-mono text-sm">
                <p className="text-green-400"># Clone the repository</p>
                <p>git clone &lt;repository-url&gt;</p>
                <br/>
                <p className="text-green-400"># Install backend dependencies</p>
                <p>cd server && npm install</p>
                <br/>
                <p className="text-green-400"># Install frontend dependencies</p>
                <p>cd client && npm install</p>
                <br/>
                <p className="text-green-400"># Start backend server</p>
                <p>cd server && npm start</p>
                <br/>
                <p className="text-green-400"># Start frontend (in new terminal)</p>
                <p>cd client && npm run dev</p>
              </div>
            </div>
          </div>

          {/* Tech Stack */}
          <div id="tech-stack" className="card">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-3" style={{ color: 'var(--color-text)' }}>
              <Database className="w-6 h-6 text-[var(--color-primary)]" />
              Tech Stack
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Frontend</h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>• React 18 with Vite</li>
                  <li>• Tailwind CSS for styling</li>
                  <li>• Framer Motion for animations</li>
                  <li>• React Router for navigation</li>
                  <li>• Lucide React for icons</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Backend</h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>• Node.js + Express</li>
                  <li>• MongoDB + Mongoose</li>
                  <li>• JWT Authentication</li>
                  <li>• Google OAuth 2.0</li>
                  <li>• Swagger/OpenAPI</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>AI & Services</h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>• Google Gemini AI</li>
                  <li>• Cloudinary (file storage)</li>
                  <li>• SendGrid (email)</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-3" style={{ color: 'var(--color-text)' }}>Security</h3>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                  <li>• bcrypt password hashing</li>
                  <li>• Helmet.js security headers</li>
                  <li>• Rate limiting</li>
                  <li>• CORS configuration</li>
                </ul>
              </div>
            </div>
          </div>

          {/* API Reference CTA */}
          <div className="card text-center">
            <FileCode className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
            <h2 className="text-2xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              Full API Reference
            </h2>
            <p className="mb-6 max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
              Explore our complete API documentation with interactive testing via Swagger UI
            </p>
            <Link
              to="/api-docs"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
            >
              View API Documentation
              <ExternalLink className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

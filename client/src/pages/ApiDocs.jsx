import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileCode, ExternalLink, Book, Zap } from 'lucide-react';

export default function ApiDocs() {
  useEffect(() => {
    // Open in new tab after 1 second
    const timer = setTimeout(() => {
      window.open('http://localhost:5000/api/docs', '_blank', 'noopener,noreferrer');
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const features = [
    { icon: Zap, title: '50+ Endpoints', description: 'Comprehensive REST API' },
    { icon: FileCode, title: 'OpenAPI 3.0', description: 'Industry standard docs' },
    { icon: Book, title: 'Interactive Testing', description: 'Try APIs in browser' },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12 flex items-center justify-center" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-custom max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm mb-6">
            <FileCode className="w-4 h-4" />
            API Documentation
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            Opening{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]">
              Swagger UI
            </span>
          </h1>
          
          <p className="text-xl mb-12" style={{ color: 'var(--color-text-secondary)' }}>
            API documentation will open in a new tab...
          </p>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="card"
                >
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3"
                    style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <h3 className="font-semibold mb-1" style={{ color: 'var(--color-text)' }}>
                    {feature.title}
                  </h3>
                  <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>

          {/* Manual Link */}
          <div className="card">
            <p className="text-sm mb-4" style={{ color: 'var(--color-text-secondary)' }}>
              Not opening automatically? Click below:
            </p>
            <a
              href="http://localhost:5000/api/docs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-transform hover:scale-105"
              style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
            >
              Open Swagger UI
              <ExternalLink className="w-5 h-5" />
            </a>
            <p className="text-xs mt-4" style={{ color: 'var(--color-text-muted)' }}>
              Backend must be running at http://localhost:5000
            </p>
          </div>

          {/* What's in the API */}
          <div className="mt-12 card">
            <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--color-text)' }}>
              What's in Our API?
            </h2>
            <div className="grid md:grid-cols-2 gap-4 text-left text-sm" style={{ color: 'var(--color-text-secondary)' }}>
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Core Features:</h3>
                <ul className="space-y-1">
                  <li>• Authentication & OAuth</li>
                  <li>• User Management</li>
                  <li>• Course CRUD</li>
                  <li>• AI Chat Integration</li>
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2" style={{ color: 'var(--color-text)' }}>Additional APIs:</h3>
                <ul className="space-y-1">
                  <li>• AI Tools Directory</li>
                  <li>• Prompt Library</li>
                  <li>• File Uploads</li>
                  <li>• Support System</li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

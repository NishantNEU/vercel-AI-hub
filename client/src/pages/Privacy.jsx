import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, UserCheck, Cookie, Mail } from 'lucide-react';

export default function Privacy() {
  const sections = [
    {
      icon: Database,
      title: 'Information We Collect',
      content: `We collect information you provide directly to us, including:
• Account information (name, email, password)
• Profile information and preferences
• Course progress and quiz results
• Chat history and AI interactions
• Tool bookmarks and favorites

We also automatically collect certain information about your device and usage patterns to improve our service.`
    },
    {
      icon: Lock,
      title: 'How We Use Your Information',
      content: `We use the information we collect to:
• Provide, maintain, and improve our services
• Personalize your learning experience
• Send you course updates and important notifications
• Respond to your questions and support requests
• Analyze usage patterns to enhance our platform
• Ensure platform security and prevent fraud

We do not sell your personal information to third parties.`
    },
    {
      icon: Shield,
      title: 'Data Security',
      content: `We take data security seriously and implement industry-standard measures:
• Encryption of data in transit and at rest
• Secure password hashing with bcrypt
• Regular security audits and updates
• Secure cloud infrastructure
• Access controls and authentication

While we strive to protect your data, no method of transmission over the internet is 100% secure.`
    },
    {
      icon: Eye,
      title: 'Your Privacy Rights',
      content: `You have the right to:
• Access your personal data
• Correct inaccurate information
• Request deletion of your account
• Export your data
• Opt-out of marketing communications
• Control cookie preferences

Contact us at privacy@aisuperhub.com to exercise these rights.`
    },
    {
      icon: Cookie,
      title: 'Cookies and Tracking',
      content: `We use cookies and similar technologies to:
• Keep you logged in
• Remember your preferences
• Analyze site usage and performance
• Provide personalized content

You can control cookie settings in your browser, though some features may not work properly if cookies are disabled.`
    },
    {
      icon: UserCheck,
      title: 'Third-Party Services',
      content: `We use trusted third-party services:
• Google OAuth for authentication
• Cloudinary for image storage
• Google Gemini AI for chat functionality
• Analytics services for usage tracking

These services have their own privacy policies and we encourage you to review them.`
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-12" style={{ backgroundColor: 'var(--color-bg)' }}>
      <div className="container-custom max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 text-sm mb-6">
            <Shield className="w-4 h-4" />
            Privacy Policy
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: 'var(--color-text)' }}>
            Privacy Policy
          </h1>
          
          <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--color-text-secondary)' }}>
            Your privacy is important to us. This policy explains how we collect, use, and protect your personal information.
          </p>
          
          <p className="text-sm mt-4" style={{ color: 'var(--color-text-muted)' }}>
            Last updated: December 8, 2024
          </p>
        </motion.div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          {sections.map((section, index) => {
            const Icon = section.icon;
            return (
              <motion.div
                key={section.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div 
                    className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}
                  >
                    <Icon className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
                      {section.title}
                    </h2>
                    <div 
                      className="prose prose-sm max-w-none whitespace-pre-line"
                      style={{ color: 'var(--color-text-secondary)' }}
                    >
                      {section.content}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="card mt-12 text-center"
        >
          <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: 'var(--color-primary)' }} />
          <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--color-text)' }}>
            Questions About Privacy?
          </h2>
          <p className="mb-6" style={{ color: 'var(--color-text-secondary)' }}>
            If you have any questions about this Privacy Policy, please contact us.
          </p>
          <a 
            href="mailto:privacy@aisuperhub.com"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-white transition-transform hover:scale-105"
            style={{ background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))' }}
          >
            <Mail className="w-5 h-5" />
            privacy@aisuperhub.com
          </a>
        </motion.div>
      </div>
    </div>
  );
}

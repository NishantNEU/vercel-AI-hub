import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MessageCircle, X, Send, Bot, User, Sparkles, 
  BookOpen, Wrench, GraduationCap, Target, Compass,
  LogIn, UserPlus, Loader2, ChevronRight, Zap,
  Brain, Code, Image, Mic, TrendingUp, Award,
  ArrowRight, RotateCcw, Minimize2, Move
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

// BOT NAME
const BOT_NAME = "Nova";
const BOT_TAGLINE = "Your AI Learning Companion";

// Quick action categories
const quickActions = [
  { id: 'beginner', label: "I'm new to AI", icon: Sparkles, color: '#00E3A5' },
  { id: 'learning-path', label: 'Suggest a learning path', icon: Compass, color: '#4FC3F7' },
  { id: 'courses', label: 'Browse courses', icon: BookOpen, color: '#FFB74D' },
  { id: 'tools', label: 'Explore AI tools', icon: Wrench, color: '#F06292' },
  { id: 'certificate', label: 'Get certified', icon: Award, color: '#BA68C8' },
];

// Goal-based quick actions
const goalActions = [
  { id: 'ml', label: 'Learn Machine Learning', icon: Brain },
  { id: 'prompt', label: 'Master Prompt Engineering', icon: Zap },
  { id: 'creative', label: 'AI for Creative Work', icon: Image },
  { id: 'coding', label: 'AI-Assisted Coding', icon: Code },
];

// Pre-defined responses with suggestions
const responses = {
  greeting: {
    text: `👋 Welcome to **AI Super Hub**! I'm ${BOT_NAME}, your AI Learning Guide.

I can help you:
• 🛤️ Find the perfect learning path
• 📚 Discover courses for your goals
• 🛠️ Explore 70+ AI tools
• 🎯 Plan your AI journey

**What would you like to explore today?**`,
    suggestions: ["I'm new to AI", "Browse courses", "Explore tools"]
  },

  beginner: {
    text: `Great choice starting your AI journey! 🚀

Here's my recommended **Beginner's Path**:

**Step 1: Foundations** (Free)
📘 *Introduction to AI & ML* - 8 hours
Learn core concepts, types of AI, and real-world applications

**Step 2: Hands-On Skills** (Free)  
🐍 *Python for AI* - 12 hours
Essential programming for AI/ML projects

**Step 3: First Project**
🔬 *Data Science Fundamentals* - 15 hours
Build your first ML model!

💡 **Tip**: Start with our free courses to build a strong foundation.`,
    suggestions: ["Start learning", "View courses", "Get certified"]
  },

  'learning-path': {
    text: `I'll help you find the perfect path! 🎯

**What's your main goal?**

🧠 **Machine Learning** - Build AI models & algorithms
✨ **Prompt Engineering** - Master ChatGPT, Claude, etc.
🎨 **AI Creative** - Images, videos, music with AI
💻 **AI Coding** - GitHub Copilot, code assistants

Or tell me more about what you want to achieve!`,
    suggestions: ["Machine Learning", "Prompt Engineering", "AI Creative", "AI Coding"]
  },

  courses: {
    text: `📚 **Our Course Categories:**

**By Skill Level:**
• 🟢 Beginner - No prior experience needed
• 🟡 Intermediate - Some AI/ML knowledge
• 🔴 Advanced - For practitioners

**Popular Categories:**
• 🧠 Machine Learning & Deep Learning
• 💬 Natural Language Processing
• 👁️ Computer Vision
• ✨ Prompt Engineering
• 📊 Data Science

**What interests you most?** I can recommend specific courses!`,
    suggestions: ["Beginner courses", "ML courses", "Get certified"]
  },

  tools: {
    text: `🛠️ **AI Tools Directory** - 70+ Tools!

**Categories:**
• 💬 **Chat & Writing**: ChatGPT, Claude, Jasper
• 🎨 **Image Generation**: Midjourney, DALL-E, Stable Diffusion
• 🎥 **Video**: Runway, Synthesia, HeyGen
• 🎵 **Audio**: ElevenLabs, Murf, Resemble
• 💻 **Code**: GitHub Copilot, Tabnine, Cursor
• 📊 **Data**: ChatPDF, Julius, DataRobot

Each tool has detailed info, pricing, and tutorials!`,
    suggestions: ["Explore tools", "ChatGPT tips", "Image generation"]
  },

  certificate: {
    text: `🎓 **Get Certified!**

Here's how to earn your certificate:

**Step 1**: Enroll in a course
**Step 2**: Complete all lessons
**Step 3**: Pass the quiz (70%+ score)
**Step 4**: Download your certificate! ✅

**Certificate Benefits:**
• LinkedIn-ready credentials
• Showcase your AI expertise
• Career advancement
• Community recognition

Ready to start?`,
    suggestions: ["Browse courses", "Requirements", "View sample"]
  },

  ml: {
    text: `🧠 **Machine Learning Learning Path**

**Level 1: Foundations** (8-10 weeks)
1. Python Programming Basics
2. Mathematics for ML (Linear Algebra, Calculus, Stats)
3. Introduction to Machine Learning

**Level 2: Core ML** (10-12 weeks)
4. Supervised Learning Algorithms
5. Unsupervised Learning & Clustering
6. Model Evaluation & Tuning

**Level 3: Deep Learning** (12-15 weeks)
7. Neural Networks Fundamentals
8. CNN for Computer Vision
9. RNN & Transformers for NLP

Start your journey today!`,
    suggestions: ["Start learning", "View courses", "Prerequisites"]
  },

  prompt: {
    text: `✨ **Prompt Engineering Mastery Path**

**Level 1: Basics** (2-3 weeks)
• Fundamentals of Prompting
• ChatGPT & Claude Essentials
• Writing Effective Prompts

**Level 2: Advanced** (3-4 weeks)
• Chain-of-Thought Prompting
• Few-Shot Learning
• Prompt Templates & Frameworks

**Level 3: Expert** (4-5 weeks)
• AI Agent Creation
• Custom GPTs
• Production Prompt Engineering

Plus: Access to 50+ ready-to-use prompt templates!`,
    suggestions: ["Start learning", "View prompts", "ChatGPT course"]
  },

  creative: {
    text: `🎨 **AI for Creative Work**

**Image Generation**:
• Midjourney Mastery
• DALL-E 3 Techniques
• Stable Diffusion Advanced

**Video Creation**:
• AI Video with Runway
• Synthesia for Business
• D-ID Avatar Creation

**Audio & Music**:
• Voice Cloning with ElevenLabs
• AI Music with Suno
• Sound Effects Generation

Transform your creativity with AI!`,
    suggestions: ["Image tools", "Video tools", "Start learning"]
  },

  coding: {
    text: `💻 **AI-Assisted Coding Path**

**Tools to Master**:
• GitHub Copilot - AI pair programmer
• Cursor - AI code editor
• ChatGPT for debugging
• Tabnine - Smart code completion

**Skills You'll Learn**:
✅ Writing code 10x faster
✅ Debugging with AI
✅ Code documentation automation
✅ Learning new frameworks quickly
✅ Refactoring & optimization

Perfect for developers of all levels!`,
    suggestions: ["Coding tools", "Start learning", "ChatGPT for code"]
  },

  login: {
    text: `🔐 **Login Help**

**To log in:**
1. Click "Login" in the top right
2. Enter your email & password
3. Or use "Continue with Google" for quick access

**Forgot password?**
• Click "Forgot Password" on login page
• Enter your email
• Check your inbox for reset link

**New here?** [Register](/register) for free to access all features!`,
    suggestions: ["Create account", "Reset password", "Browse courses"]
  },

  register: {
    text: `✨ **Create Your Free Account!**

**Why sign up?**
• 🎓 Access all courses
• 💾 Save your progress
• 🎯 Track learning paths
• 🏆 Earn certificates
• 💬 AI chat assistance

**It's free** and takes just 30 seconds!

[Create Account](/register) or [Sign in with Google](/auth/google)`,
    suggestions: ["Create account", "Sign in with Google", "Learn more"]
  }
};

export default function HelperChatBot() {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: responses.greeting.text, suggestions: responses.greeting.suggestions }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [showGoalActions, setShowGoalActions] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  
  // Dragging state
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const chatWindowRef = useRef(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen, isMinimized]);

  // Dragging handlers
  const handleMouseDown = (e) => {
    if (e.target.closest('.drag-handle')) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragStart]);

  const formatMessage = (text) => {
    // Format markdown-style text
    const lines = text.split('\n');
    return lines.map((line, i) => {
      // Bold text
      line = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      // Italic text
      line = line.replace(/\*(.*?)\*/g, '<em>$1</em>');
      return <div key={i} dangerouslySetInnerHTML={{ __html: line || '<br/>' }} />;
    });
  };

  const addMessage = (role, content, suggestions = []) => {
    setMessages(prev => [...prev, { role, content, suggestions }]);
  };

  const simulateTyping = (response) => {
    setIsTyping(true);
    // Simulate thinking time
    setTimeout(() => {
      setIsTyping(false);
      addMessage('assistant', response.text, response.suggestions);
      setShowQuickActions(false);
      setShowGoalActions(false);
    }, 800 + Math.random() * 400);
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setHasInteracted(true);
    addMessage('user', userMessage);

    // Check for predefined responses
    const lowerMessage = userMessage.toLowerCase();
    
    let response = null;

    // Goal actions
    if (lowerMessage.includes('machine learning') || lowerMessage === 'ml') {
      response = responses.ml;
    } else if (lowerMessage.includes('prompt engineering') || lowerMessage.includes('prompt')) {
      response = responses.prompt;
    } else if (lowerMessage.includes('creative') || lowerMessage.includes('image') || lowerMessage.includes('video')) {
      response = responses.creative;
    } else if (lowerMessage.includes('coding') || lowerMessage.includes('code') || lowerMessage.includes('programming')) {
      response = responses.coding;
    }
    // Quick actions
    else if (lowerMessage.includes('new') || lowerMessage.includes('beginner') || lowerMessage.includes('start')) {
      response = responses.beginner;
    } else if (lowerMessage.includes('learning path') || lowerMessage.includes('suggest') || lowerMessage.includes('recommend')) {
      response = responses['learning-path'];
    } else if (lowerMessage.includes('course')) {
      response = responses.courses;
    } else if (lowerMessage.includes('tool')) {
      response = responses.tools;
    } else if (lowerMessage.includes('certif')) {
      response = responses.certificate;
    } else if (lowerMessage.includes('login') || lowerMessage.includes('log in') || lowerMessage.includes('sign in')) {
      response = responses.login;
    } else if (lowerMessage.includes('register') || lowerMessage.includes('sign up') || lowerMessage.includes('account')) {
      response = responses.register;
    }
    // Greeting
    else if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
      response = responses.greeting;
    }
    // Default: call API
    else {
      // Call API for AI response
      simulateApiCall(userMessage);
      return;
    }

    if (response) {
      simulateTyping(response);
    }
  };

  const simulateApiCall = async (message) => {
    setIsTyping(true);
    try {
      const res = await fetch('/api/chat/helper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
      });
      const data = await res.json();
      setIsTyping(false);
      addMessage('assistant', data.data.response);
    } catch (error) {
      setIsTyping(false);
      addMessage('assistant', "I'm here to help with courses, tools, and learning paths! Ask me anything about AI Super Hub. 🚀");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickAction = (actionId) => {
    const response = responses[actionId];
    if (response) {
      setHasInteracted(true);
      addMessage('user', quickActions.find(a => a.id === actionId)?.label || actionId);
      simulateTyping(response);
      
      if (actionId === 'learning-path') {
        setTimeout(() => setShowGoalActions(true), 1200);
      }
    }
  };

  const handleGoalAction = (goalId) => {
    const response = responses[goalId];
    if (response) {
      addMessage('user', goalActions.find(g => g.id === goalId)?.label || goalId);
      simulateTyping(response);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion);
    setTimeout(() => handleSend(), 100);
  };

  const resetChat = () => {
    setMessages([
      { role: 'assistant', content: responses.greeting.text, suggestions: responses.greeting.suggestions }
    ]);
    setHasInteracted(false);
    setShowQuickActions(true);
    setShowGoalActions(false);
  };

  // Theme-aware colors
  const bgColor = isDark ? '#0a0a0a' : '#ffffff';
  const surfaceColor = isDark ? '#111' : '#f5f5f5';
  const borderColor = isDark ? '#1a1a1a' : '#e5e5e5';
  const textColor = isDark ? '#e5e5e5' : '#0a0a0a';
  const mutedTextColor = isDark ? '#888' : '#666';

  return (
    <div className="fixed inset-0 pointer-events-none z-30">
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 left-6 w-16 h-16 rounded-full flex items-center justify-center shadow-2xl group pointer-events-auto"
            style={{ 
              background: 'linear-gradient(135deg, #00E3A5 0%, #4FC3F7 100%)',
              boxShadow: '0 8px 32px rgba(0, 227, 165, 0.4)'
            }}
          >
            <Bot className="w-7 h-7 text-black" />
            
            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20" 
              style={{ background: 'linear-gradient(135deg, #00E3A5 0%, #4FC3F7 100%)' }} 
            />
            
            {/* Tooltip */}
            <span className="absolute left-full ml-3 px-3 py-2 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity text-sm"
              style={{ backgroundColor: bgColor, color: textColor, border: `1px solid ${borderColor}` }}
            >
              Nova - Ask me! 💬
            </span>
            
            {/* Notification badge */}
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center animate-bounce">
              <span className="text-[10px] text-white font-bold">1</span>
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={chatWindowRef}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ 
              opacity: 1, 
              y: 0, 
              scale: 1,
              height: isMinimized ? 'auto' : '580px',
              x: position.x,
              y: position.y
            }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-6 left-6 w-[400px] rounded-2xl overflow-hidden flex flex-col shadow-2xl pointer-events-auto"
            style={{ 
              backgroundColor: bgColor,
              border: `1px solid ${borderColor}`,
              maxHeight: '90vh',
              cursor: isDragging ? 'grabbing' : 'default'
            }}
            onMouseDown={handleMouseDown}
          >
            {/* Header - Draggable */}
            <div 
              className="px-4 py-3 flex items-center justify-between cursor-move drag-handle"
              style={{ 
                background: 'linear-gradient(135deg, rgba(0,227,165,0.15) 0%, rgba(79,195,247,0.15) 100%)',
                borderBottom: `1px solid ${borderColor}`
              }}
              onClick={() => isMinimized && setIsMinimized(false)}
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'linear-gradient(135deg, #00E3A5 0%, #4FC3F7 100%)' }}
                >
                  <GraduationCap className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm flex items-center gap-2" style={{ color: textColor }}>
                    {BOT_NAME}
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs" style={{ color: mutedTextColor }}>
                      Online • {BOT_TAGLINE}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => { e.stopPropagation(); resetChat(); }}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--color-surface-hover)]"
                  style={{ color: mutedTextColor }}
                  title="Reset chat"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setIsMinimized(!isMinimized); }}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--color-surface-hover)]"
                  style={{ color: mutedTextColor }}
                >
                  <Minimize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg transition-colors hover:bg-[var(--color-surface-hover)]"
                  style={{ color: mutedTextColor }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {!isMinimized && (
              <>
                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ maxHeight: '380px' }}>
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      {/* Avatar */}
                      <div 
                        className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center ${
                          msg.role === 'user' ? 'bg-blue-500/20' : ''
                        }`}
                        style={msg.role === 'assistant' ? { 
                          background: 'linear-gradient(135deg, #00E3A5 0%, #4FC3F7 100%)' 
                        } : {}}
                      >
                        {msg.role === 'user' ? (
                          <User className="w-4 h-4 text-blue-400" />
                        ) : (
                          <Bot className="w-4 h-4 text-black" />
                        )}
                      </div>
                      
                      {/* Message Bubble */}
                      <div className="flex flex-col gap-2 max-w-[85%]">
                        <div 
                          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                            msg.role === 'user' ? 'rounded-tr-sm' : 'rounded-tl-sm'
                          }`}
                          style={{ 
                            backgroundColor: msg.role === 'user' ? 'rgba(79, 195, 247, 0.15)' : surfaceColor,
                            color: textColor
                          }}
                        >
                          {formatMessage(msg.content)}
                        </div>
                        
                        {/* Suggestion Chips */}
                        {msg.role === 'assistant' && msg.suggestions && msg.suggestions.length > 0 && idx === messages.length - 1 && (
                          <div className="flex flex-wrap gap-2 mt-1">
                            {msg.suggestions.map((suggestion, i) => (
                              <button
                                key={i}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-3 py-1.5 rounded-full text-xs font-medium transition-all hover:scale-105 active:scale-95"
                                style={{ 
                                  backgroundColor: 'rgba(0, 227, 165, 0.1)',
                                  border: '1px solid rgba(0, 227, 165, 0.3)',
                                  color: '#00E3A5'
                                }}
                              >
                                {suggestion}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  
                  {/* Typing Indicator */}
                  {isTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #00E3A5 0%, #4FC3F7 100%)' }}
                      >
                        <Bot className="w-4 h-4 text-black" />
                      </div>
                      <div className="px-4 py-3 rounded-2xl rounded-tl-sm flex items-center gap-1.5" style={{ backgroundColor: surfaceColor }}>
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: mutedTextColor, animationDelay: '0ms' }} />
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: mutedTextColor, animationDelay: '150ms' }} />
                        <span className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: mutedTextColor, animationDelay: '300ms' }} />
                      </div>
                    </motion.div>
                  )}
                  
                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Actions */}
                {showQuickActions && !hasInteracted && (
                  <div className="px-4 pb-2">
                    <p className="text-xs mb-2" style={{ color: mutedTextColor }}>Quick actions:</p>
                    <div className="flex flex-wrap gap-2">
                      {quickActions.map((action) => {
                        const Icon = action.icon;
                        return (
                          <button
                            key={action.id}
                            onClick={() => handleQuickAction(action.id)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
                            style={{ 
                              backgroundColor: `${action.color}15`,
                              color: action.color,
                              border: `1px solid ${action.color}30`
                            }}
                          >
                            <Icon className="w-3.5 h-3.5" />
                            {action.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Goal Actions */}
                {showGoalActions && (
                  <div className="px-4 pb-2">
                    <p className="text-xs mb-2" style={{ color: mutedTextColor }}>Choose your goal:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {goalActions.map((goal) => {
                        const Icon = goal.icon;
                        return (
                          <button
                            key={goal.id}
                            onClick={() => handleGoalAction(goal.id)}
                            className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all hover:scale-105 active:scale-95"
                            style={{
                              backgroundColor: surfaceColor,
                              color: textColor,
                              border: `1px solid ${borderColor}`
                            }}
                          >
                            <Icon className="w-3.5 h-3.5 text-[#00E3A5]" />
                            {goal.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Input Area */}
                <div className="p-3" style={{ borderTop: `1px solid ${borderColor}` }}>
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-colors" 
                    style={{ 
                      backgroundColor: surfaceColor,
                      border: `1px solid ${borderColor}`
                    }}
                  >
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Ask about courses, tools, learning paths..."
                      className="flex-1 bg-transparent text-sm focus:outline-none"
                      style={{ color: textColor }}
                      disabled={isTyping}
                    />
                    <button
                      onClick={handleSend}
                      disabled={!input.trim() || isTyping}
                      className="p-2 rounded-lg transition-all disabled:opacity-30 disabled:cursor-not-allowed hover:scale-110 active:scale-95"
                      style={{ 
                        background: input.trim() ? 'linear-gradient(135deg, #00E3A5 0%, #4FC3F7 100%)' : 'transparent',
                        color: input.trim() ? '#000' : mutedTextColor
                      }}
                    >
                      {isTyping ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  <p className="text-center text-[10px] mt-2" style={{ color: mutedTextColor }}>
                    Powered by AI Super Hub • {BOT_NAME} 🎓
                  </p>
                </div>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

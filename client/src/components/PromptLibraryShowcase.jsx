/**
 * @fileoverview Prompt Library Showcase - THEME FIXED
 * @description Featured prompts section for Home page with proper dark/light theme support
 */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Sparkles, Copy, ArrowRight, Check, Wand2,
  Code, Lightbulb, PenTool, Brain, Target, BookOpen
} from 'lucide-react';
import api from '../services/api';
import toast from 'react-hot-toast';

// Icon mapping
const ICONS = {
  Sparkles, Code, Lightbulb, PenTool, Brain, Target, BookOpen, Wand2
};

export default function PromptLibraryShowcase() {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState(null);
  const [stats, setStats] = useState({ total: 50, categories: 9 });

  useEffect(() => {
    fetchFeaturedPrompts();
  }, []);

  const fetchFeaturedPrompts = async () => {
    try {
      const response = await api.get('/prompts/featured?limit=6');
      setPrompts(response.data.data.prompts);
      
      const statsRes = await api.get('/prompts/stats');
      setStats(statsRes.data.data);
    } catch (error) {
      // Use fallback data if API fails
      setPrompts([
        { _id: '1', title: "Explain Like I'm New", description: "Get simple explanations of complex AI concepts", category: "Learning", color: "#FFB74D", example: "Explain gradient descent in simple terms with analogies." },
        { _id: '2', title: "Code Review Expert", description: "Get thorough code review with suggestions", category: "Coding", color: "#00D4FF", example: "Review this code and suggest improvements with comments." },
        { _id: '3', title: "Midjourney Prompt Builder", description: "Create AI image generation prompts", category: "Creative", color: "#F093FB", example: "Create a Midjourney prompt for cyberpunk city at sunset." },
        { _id: '4', title: "Data Cleaning Pipeline", description: "Generate preprocessing code", category: "Data & ML", color: "#6C63FF", example: "Generate pandas code to clean a customer dataset." },
        { _id: '5', title: "Professional Email Writer", description: "Craft perfect professional emails", category: "Writing", color: "#FF6B6B", example: "Write a professional email requesting deadline extension." },
        { _id: '6', title: "Interview Prep Coach", description: "Practice interview questions", category: "Career", color: "#FFC107", example: "Give 5 senior ML Engineer interview questions." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async (prompt) => {
    try {
      await navigator.clipboard.writeText(prompt.example);
      setCopiedId(prompt._id);
      toast.success('Prompt copied!');
      setTimeout(() => setCopiedId(null), 2000);
    } catch (error) {
      toast.error('Failed to copy');
    }
  };

  return (
    <section className="py-20 relative overflow-hidden bg-[var(--color-bg)]">
      {/* Background Effects - Adaptive to theme */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-500/5 to-transparent" />
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[120px] -translate-y-1/2" />
      <div className="absolute top-1/2 right-1/4 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] -translate-y-1/2" />
      
      <div className="container mx-auto px-4 relative">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-sm mb-6">
            <Wand2 className="w-4 h-4" />
            {stats.total || '50'}+ AI Prompts
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text)] mb-4">
            AI Prompt Library
          </h2>
          <p className="text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-8">
            Curated prompts to supercharge your AI workflows. Copy, customize, and create amazing results.
          </p>

          {/* CTA Button */}
          <Link
            to="/prompts"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold text-white transition-all hover:scale-105 hover:shadow-xl hover:shadow-purple-500/25"
            style={{ background: 'linear-gradient(135deg, #6c63ff 0%, #764ba2 100%)' }}
          >
            <Sparkles className="w-5 h-5" />
            Explore All Prompts
            <ArrowRight className="w-5 h-5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}

/**
 * Prompt Seed Data - Run: node seeds/promptSeeds.js
 */

const mongoose = require('mongoose');
require('dotenv').config();

const prompts = [
  // LEARNING
  { title: "Explain Like I'm New", description: "Get simple explanations of complex AI concepts", template: "Explain [CONCEPT] in simple terms with a 3-step analogy and one real-world example.", example: "Explain gradient descent in simple terms with a 3-step analogy and one real-world example.", category: "Learning", difficulty: "Beginner", tags: ["learning", "explanation"], color: "#FFB74D", isFeatured: true },
  { title: "Compare & Contrast", description: "Understand differences between concepts", template: "Compare [CONCEPT A] and [CONCEPT B]. Create a table with: key differences, when to use each, pros and cons.", example: "Compare Random Forest and Gradient Boosting with a comparison table.", category: "Learning", difficulty: "Intermediate", tags: ["comparison", "learning"], color: "#FFB74D", isFeatured: true },
  { title: "Create Study Guide", description: "Generate comprehensive study guides", template: "Create a study guide for [TOPIC]. Include: key concepts, formulas, common mistakes, practice questions.", example: "Create a study guide for Neural Networks with key concepts and practice questions.", category: "Learning", difficulty: "Beginner", tags: ["study", "guide"], color: "#FFB74D" },
  { title: "Socratic Teacher", description: "Learn through guided questions", template: "Be my Socratic teacher for [TOPIC]. Guide me with questions instead of direct answers.", example: "Be my Socratic teacher for machine learning overfitting.", category: "Learning", difficulty: "Intermediate", tags: ["teaching", "socratic"], color: "#FFB74D" },
  { title: "ELI5 Technical Concept", description: "Explain like I'm 5 years old", template: "Explain [CONCEPT] like I'm 5 years old. Use simple words and fun analogies.", example: "Explain how neural networks learn like I'm 5 years old.", category: "Learning", difficulty: "Beginner", tags: ["eli5", "simple"], color: "#FFB74D" },
  
  // CODING
  { title: "Code Review Expert", description: "Get thorough code review with suggestions", template: "Review this code: [CODE]. Identify bugs, suggest improvements, and rewrite with comments.", example: "Review this Python function and suggest improvements with comments.", category: "Coding", difficulty: "Intermediate", tags: ["code review", "debugging"], color: "#00D4FF", isFeatured: true },
  { title: "Debug Like a Senior Dev", description: "Systematic debugging approach", template: "Debug this error: [ERROR] in code: [CODE]. Explain cause and provide step-by-step fix.", example: "Debug TypeError: Cannot read property of undefined. Explain and fix.", category: "Coding", difficulty: "Intermediate", tags: ["debugging", "error handling"], color: "#00D4FF", isFeatured: true },
  { title: "Optimize Performance", description: "Improve code efficiency", template: "Optimize this code for performance: [CODE]. Consider time complexity and memory.", example: "Optimize this Python loop using NumPy vectorization.", category: "Coding", difficulty: "Advanced", tags: ["optimization", "performance"], color: "#00D4FF" },
  { title: "Convert Between Languages", description: "Translate code to another language", template: "Convert this [SOURCE] code to [TARGET]: [CODE]. Use idiomatic patterns.", example: "Convert this Python code to JavaScript with idiomatic patterns.", category: "Coding", difficulty: "Intermediate", tags: ["conversion", "languages"], color: "#00D4FF" },
  { title: "Write Unit Tests", description: "Generate test cases for code", template: "Write unit tests for: [CODE]. Include normal, edge, and error cases.", example: "Write pytest tests for this function including edge cases.", category: "Coding", difficulty: "Intermediate", tags: ["testing", "unit tests"], color: "#00D4FF" },
  { title: "Refactor Legacy Code", description: "Modernize old code", template: "Refactor this legacy code: [CODE]. Apply SOLID principles and modern practices.", example: "Refactor this old JavaScript to use ES6+ features.", category: "Coding", difficulty: "Advanced", tags: ["refactoring", "clean code"], color: "#00D4FF" },
  
  // WRITING
  { title: "Professional Email Writer", description: "Craft perfect professional emails", template: "Write a professional email for: [SITUATION]. Tone: [TONE]. Key points: [POINTS].", example: "Write a professional email requesting deadline extension.", category: "Writing", difficulty: "Beginner", tags: ["email", "professional"], color: "#FF6B6B", isFeatured: true },
  { title: "Blog Post Structure", description: "Create engaging blog outlines", template: "Create a blog post about [TOPIC] for [AUDIENCE]. Include title options, hook, subheadings.", example: "Create a blog post about AI in healthcare for tech professionals.", category: "Writing", difficulty: "Intermediate", tags: ["blog", "content"], color: "#FF6B6B" },
  { title: "LinkedIn Post Generator", description: "Create engaging LinkedIn posts", template: "Write a LinkedIn post about [TOPIC]. Include hook, insight, call-to-engagement, hashtags.", example: "Write a LinkedIn post about completing my first ML project.", category: "Writing", difficulty: "Beginner", tags: ["linkedin", "social media"], color: "#FF6B6B" },
  { title: "Technical Documentation", description: "Write clear technical docs", template: "Write documentation for [PROJECT]. Include overview, setup, usage, API reference.", example: "Write a README.md for a Python ML library.", category: "Writing", difficulty: "Intermediate", tags: ["documentation", "technical"], color: "#FF6B6B" },
  { title: "Summarize Long Content", description: "Get concise summaries", template: "Summarize: [CONTENT]. Provide one-sentence summary, key points, takeaways.", example: "Summarize this research paper with key points.", category: "Writing", difficulty: "Beginner", tags: ["summary", "productivity"], color: "#FF6B6B" },
  
  // CREATIVE
  { title: "Midjourney Prompt Builder", description: "Create AI image generation prompts", template: "Create a Midjourney prompt for: [DESCRIPTION]. Include style, lighting, mood, camera angle.", example: "Create a Midjourney prompt for cyberpunk city at sunset.", category: "Creative", difficulty: "Beginner", tags: ["midjourney", "image generation"], color: "#F093FB", isFeatured: true },
  { title: "Story Idea Generator", description: "Generate creative story concepts", template: "Generate a [GENRE] story with: premise, unique character, conflict, plot twist.", example: "Generate a sci-fi story idea with unique protagonist and plot twist.", category: "Creative", difficulty: "Beginner", tags: ["storytelling", "creative writing"], color: "#F093FB" },
  { title: "DALL-E Prompt Engineer", description: "Craft DALL-E prompts", template: "Create DALL-E prompt for: [DESCRIPTION]. Provide realistic, artistic, minimalist variations.", example: "Create DALL-E prompts for cozy coffee shop interior.", category: "Creative", difficulty: "Intermediate", tags: ["dall-e", "art"], color: "#F093FB" },
  { title: "Video Script Writer", description: "Create video scripts", template: "Write a [DURATION] video script about [TOPIC]. Include hook, main points, CTA.", example: "Write a 5-minute YouTube script about learning Python.", category: "Creative", difficulty: "Intermediate", tags: ["video", "youtube"], color: "#F093FB" },
  
  // DATA & ML
  { title: "Data Cleaning Pipeline", description: "Generate preprocessing code", template: "Generate data cleaning code for [DATASET]. Handle missing values, outliers, scaling.", example: "Generate pandas code to clean a customer dataset.", category: "Data & ML", difficulty: "Intermediate", tags: ["data cleaning", "pandas"], color: "#6C63FF", isFeatured: true },
  { title: "Feature Engineering Ideas", description: "Suggest ML features", template: "Suggest features for [PROBLEM] with columns: [COLUMNS]. Include derived and interaction features.", example: "Suggest features for house price prediction.", category: "Data & ML", difficulty: "Intermediate", tags: ["feature engineering", "ml"], color: "#6C63FF" },
  { title: "Model Selection Guide", description: "Choose the right algorithm", template: "Recommend ML algorithms for: [PROBLEM]. For each: why it fits, hyperparameters, pros/cons.", example: "Recommend algorithms for customer churn prediction.", category: "Data & ML", difficulty: "Advanced", tags: ["model selection", "algorithms"], color: "#6C63FF" },
  { title: "SQL Query Optimizer", description: "Optimize slow queries", template: "Optimize this SQL: [QUERY]. Provide improved query and suggested indexes.", example: "Optimize this slow query with multiple JOINs.", category: "Data & ML", difficulty: "Advanced", tags: ["sql", "optimization"], color: "#6C63FF" },
  { title: "EDA Report Generator", description: "Create exploratory analysis", template: "Generate EDA code for columns: [COLUMNS]. Include distributions, correlations, insights.", example: "Generate EDA code for sales dataset.", category: "Data & ML", difficulty: "Beginner", tags: ["eda", "analysis"], color: "#6C63FF" },
  
  // BUSINESS
  { title: "SWOT Analysis", description: "Strategic business analysis", template: "Conduct SWOT analysis for [COMPANY/PRODUCT]. Include strengths, weaknesses, opportunities, threats.", example: "Conduct SWOT analysis for an AI fitness app.", category: "Business", difficulty: "Intermediate", tags: ["swot", "strategy"], color: "#38EF7D" },
  { title: "Pitch Deck Outline", description: "Structure investor presentations", template: "Create pitch deck for [STARTUP]. Include problem, solution, market, model, traction, ask.", example: "Create pitch deck outline for AI tutoring platform.", category: "Business", difficulty: "Intermediate", tags: ["pitch", "startup"], color: "#38EF7D" },
  { title: "Meeting Agenda Creator", description: "Structure effective meetings", template: "Create agenda for [MEETING TYPE] about [TOPIC]. Include objectives, topics, time allocation.", example: "Create agenda for product roadmap planning meeting.", category: "Business", difficulty: "Beginner", tags: ["meetings", "productivity"], color: "#38EF7D" },
  
  // RESEARCH
  { title: "Literature Review Helper", description: "Analyze research papers", template: "Analyze this paper: [ABSTRACT]. Provide contribution, methodology, findings, limitations.", example: "Analyze this ML paper and summarize methodology.", category: "Research", difficulty: "Advanced", tags: ["research", "academic"], color: "#667EEA", isFeatured: true },
  { title: "Research Question Generator", description: "Develop research questions", template: "Generate research questions for [TOPIC]. Include exploratory, comparative, causal questions.", example: "Generate research questions for AI bias in hiring.", category: "Research", difficulty: "Advanced", tags: ["research", "questions"], color: "#667EEA" },
  
  // PRODUCTIVITY
  { title: "Task Breakdown Expert", description: "Break complex tasks into steps", template: "Break down [COMPLEX TASK] into actionable steps. Include time estimates and dependencies.", example: "Break down 'Build ML model' into actionable steps.", category: "Productivity", difficulty: "Beginner", tags: ["planning", "tasks"], color: "#00E3A5" },
  { title: "Weekly Planning Assistant", description: "Plan your week effectively", template: "Create weekly plan for goals: [GOALS]. Balance work, learning, rest. Include daily focus areas.", example: "Create weekly plan balancing work, learning ML, and exercise.", category: "Productivity", difficulty: "Beginner", tags: ["planning", "weekly"], color: "#00E3A5" },
  { title: "Decision Matrix Creator", description: "Make better decisions", template: "Create decision matrix for [DECISION]. Options: [OPTIONS]. Criteria: [CRITERIA]. Weight and score.", example: "Create decision matrix for choosing ML framework.", category: "Productivity", difficulty: "Intermediate", tags: ["decisions", "analysis"], color: "#00E3A5" },
  
  // CAREER
  { title: "Interview Prep Coach", description: "Practice interview questions", template: "Give [NUMBER] [LEVEL] interview questions for [ROLE]. Include key points and sample answers.", example: "Give 5 senior ML Engineer interview questions with answers.", category: "Career", difficulty: "Intermediate", tags: ["interview", "career"], color: "#FFC107", isFeatured: true },
  { title: "Resume Bullet Points", description: "Write impactful achievements", template: "Write resume bullets for [ROLE] at [COMPANY]. Focus on: [ACHIEVEMENTS]. Use STAR method with metrics.", example: "Write resume bullets for Data Scientist role with ML projects.", category: "Career", difficulty: "Beginner", tags: ["resume", "career"], color: "#FFC107" },
  { title: "Salary Negotiation Script", description: "Prepare for negotiations", template: "Create salary negotiation script for [ROLE]. Current offer: [OFFER]. Target: [TARGET]. Include talking points.", example: "Create negotiation script for ML Engineer role.", category: "Career", difficulty: "Intermediate", tags: ["negotiation", "salary"], color: "#FFC107" },
  { title: "LinkedIn Profile Optimizer", description: "Improve your LinkedIn", template: "Optimize LinkedIn [SECTION] for [TARGET ROLE]. Current: [CURRENT TEXT]. Make it compelling.", example: "Optimize LinkedIn summary for Data Scientist role.", category: "Career", difficulty: "Beginner", tags: ["linkedin", "profile"], color: "#FFC107" },
];

const seedPrompts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const Prompt = require('../src/models/Prompt');
    await Prompt.deleteMany({});
    console.log('Cleared existing prompts');
    
    await Prompt.insertMany(prompts);
    console.log(`Seeded ${prompts.length} prompts`);
    
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
};

seedPrompts();

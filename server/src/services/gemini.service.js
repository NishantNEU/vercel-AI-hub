/**
 * @fileoverview Gemini AI Service
 * @description Handles communication with Google's Gemini API
 * 
 * @author AI Super Hub Team
 * @version 3.0.0 - Bulletproof version for presentation
 * @updated December 2025
 */

const { GoogleGenerativeAI } = require('@google/generative-ai');
const logger = require('../utils/logger');

// Initialize Gemini AI
let genAI = null;

// Working models (December 2025)
// gemini-2.5-flash WORKS, gemini-2.0-flash has quota issues
const AVAILABLE_MODELS = {
  // Primary models (use these)
  'gemini-2.5-flash': 'gemini-2.5-flash',
  'gemini-2.5-pro': 'gemini-2.5-pro',
  'gemini-2.5-flash-lite': 'gemini-2.5-flash-lite',
  
  // Aliases
  'gemini-flash': 'gemini-2.5-flash',
  'gemini-pro': 'gemini-2.5-pro',
  'flash': 'gemini-2.5-flash',
  'pro': 'gemini-2.5-pro',
  
  // Legacy redirects (these models have quota issues, redirect to working ones)
  'gemini-2.0-flash': 'gemini-2.5-flash',
  'gemini-2.0-flash-lite': 'gemini-2.5-flash-lite',
  'gemini-1.5-flash': 'gemini-2.5-flash',
  'gemini-1.5-pro': 'gemini-2.5-pro',
  'gemini-1.0-pro': 'gemini-2.5-pro',
};

// Default model - MUST be one that works
const DEFAULT_MODEL = 'gemini-2.5-flash';

// Fallback models to try if primary fails
const FALLBACK_MODELS = ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-2.5-flash-lite'];

/**
 * Initialize the Gemini client
 */
const initializeGemini = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey || apiKey === 'placeholder' || apiKey === 'your_gemini_api_key_here') {
    logger.warn('Gemini API key not configured or using placeholder');
    return null;
  }
  
  try {
    genAI = new GoogleGenerativeAI(apiKey);
    logger.info('Gemini AI initialized successfully');
    return genAI;
  } catch (error) {
    logger.error('Failed to initialize Gemini AI', { error: error.message });
    return null;
  }
};

/**
 * System prompts for different chat modes
 */
const SYSTEM_PROMPTS = {
  general: `You are a helpful AI assistant. Be concise, friendly, and informative.`,
  
  tutor: `You are an expert tutor and educator. Your role is to:
- Explain concepts clearly and simply
- Use examples and analogies
- Break down complex topics step by step
- Encourage learning and ask guiding questions
- Be patient and supportive`,
  
  coder: `You are an expert programmer and software engineer. Your role is to:
- Write clean, efficient, and well-commented code
- Explain code logic clearly
- Debug and fix issues
- Suggest best practices and optimizations
- Support multiple programming languages`,
  
  summarizer: `You are a summarization expert. Your role is to:
- Condense long content into key points
- Extract main ideas and themes
- Present information in bullet points when helpful
- Maintain accuracy while being concise
- Highlight important details`
};

/**
 * Get the correct model name
 */
const getModelName = (model) => {
  const modelName = AVAILABLE_MODELS[model] || AVAILABLE_MODELS[model?.toLowerCase()] || DEFAULT_MODEL;
  return modelName;
};

/**
 * Generate AI response using Gemini with automatic fallback
 */
const generateResponse = async (messages, model = DEFAULT_MODEL, mode = 'general') => {
  // Initialize if not already done
  if (!genAI) {
    initializeGemini();
  }
  
  if (!genAI) {
    logger.error('Gemini AI not initialized - API key may be missing');
    return "AI service is not configured. Please set up the Gemini API key in your .env file.";
  }

  const modelName = getModelName(model);
  const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.general;
  const lastMessage = messages[messages.length - 1];
  
  // Build conversation context
  let conversationContext = '';
  if (messages.length > 1) {
    const recentMessages = messages.slice(-10, -1);
    conversationContext = recentMessages.map(msg => 
      `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
    ).join('\n\n');
  }

  const fullPrompt = conversationContext 
    ? `${systemPrompt}\n\nPrevious conversation:\n${conversationContext}\n\nUser: ${lastMessage.content}\n\nAssistant:`
    : `${systemPrompt}\n\nUser: ${lastMessage.content}\n\nAssistant:`;

  // Try primary model first, then fallbacks
  const modelsToTry = [modelName, ...FALLBACK_MODELS.filter(m => m !== modelName)];
  
  for (const tryModel of modelsToTry) {
    try {
      logger.debug('Trying Gemini model', { model: tryModel });
      
      const geminiModel = genAI.getGenerativeModel({ model: tryModel });
      const result = await geminiModel.generateContent(fullPrompt);
      const response = await result.response;
      const text = response.text();

      logger.debug('Gemini response generated', { 
        model: tryModel, 
        mode, 
        responseLength: text.length 
      });

      return text;

    } catch (error) {
      const errorMessage = error.message?.toLowerCase() || '';
      
      logger.warn('Model failed, trying next', { 
        model: tryModel, 
        error: error.message 
      });

      // If it's a safety block, don't retry with other models
      if (errorMessage.includes('safety') || errorMessage.includes('blocked')) {
        return "I can't respond to that request due to content safety guidelines. Please try rephrasing your question.";
      }

      // If it's an API key error, don't retry
      if (errorMessage.includes('api key') || errorMessage.includes('invalid') || errorMessage.includes('401')) {
        return "AI service configuration error. Please check that your GEMINI_API_KEY is valid.";
      }

      // Continue to next model for quota/rate limit errors
      continue;
    }
  }

  // All models failed
  logger.error('All Gemini models failed');
  return "I'm having trouble connecting to the AI service. Please try again in a moment.";
};

/**
 * Generate a title for a chat
 */
const generateChatTitle = async (firstMessage) => {
  try {
    if (!genAI) initializeGemini();
    if (!genAI) return firstMessage.substring(0, 50) + '...';

    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
    const prompt = `Generate a very short title (max 5 words) for a conversation that starts with: "${firstMessage.substring(0, 200)}". Reply with only the title, nothing else.`;
    
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim().substring(0, 50) || firstMessage.substring(0, 50);

  } catch (error) {
    logger.error('Error generating chat title', { error: error.message });
    return firstMessage.substring(0, 50) + '...';
  }
};

/**
 * Text analysis (sentiment, summary, keywords)
 */
const analyzeText = async (text, analysisType = 'sentiment') => {
  try {
    if (!genAI) initializeGemini();
    if (!genAI) return { error: 'AI service not configured' };

    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
    
    const prompts = {
      sentiment: `Analyze the sentiment and respond with JSON only: {"sentiment": "positive/negative/neutral", "confidence": 0.0-1.0, "explanation": "brief"}. Text: "${text}"`,
      summary: `Summarize in 2-3 sentences: "${text}"`,
      keywords: `Extract 5-10 keywords as JSON: {"keywords": ["word1", "word2"]}. Text: "${text}"`
    };

    const result = await model.generateContent(prompts[analysisType] || prompts.sentiment);
    const responseText = result.response.text();

    try {
      return JSON.parse(responseText);
    } catch {
      return { result: responseText };
    }

  } catch (error) {
    logger.error('Text analysis error', { error: error.message });
    return { error: 'Analysis failed' };
  }
};

/**
 * Test the API connection
 */
const testConnection = async () => {
  try {
    if (!genAI) initializeGemini();
    if (!genAI) {
      return { success: false, error: 'API key not configured' };
    }

    const model = genAI.getGenerativeModel({ model: DEFAULT_MODEL });
    const result = await model.generateContent('Say "Hello" in one word.');
    const text = result.response.text();
    
    return { 
      success: true, 
      model: DEFAULT_MODEL,
      response: text.substring(0, 50)
    };
  } catch (error) {
    return { 
      success: false, 
      error: error.message,
      hint: error.message.includes('quota') ? 'Check your API quota at https://aistudio.google.com/' : 
            error.message.includes('key') ? 'Check your GEMINI_API_KEY in .env file' :
            'Check your network connection and API configuration'
    };
  }
};

module.exports = {
  initializeGemini,
  generateResponse,
  generateChatTitle,
  analyzeText,
  testConnection,
  SYSTEM_PROMPTS,
  AVAILABLE_MODELS,
  DEFAULT_MODEL
};

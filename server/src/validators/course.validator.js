/**
 * @fileoverview Course request validators
 * @description Validation rules for course endpoints
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const { body, param, query } = require('express-validator');

// Valid categories
const VALID_CATEGORIES = [
  'ai-fundamentals', 'machine-learning', 'deep-learning', 
  'nlp', 'computer-vision', 'generative-ai', 
  'ai-tools', 'prompt-engineering', 'ai-ethics', 'other'
];

// Valid difficulty levels
const VALID_DIFFICULTY = ['beginner', 'intermediate', 'advanced'];

/**
 * Validation for creating a course
 */
const createCourseValidator = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Course title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('shortDescription')
    .optional()
    .trim()
    .isLength({ max: 300 })
    .withMessage('Short description cannot exceed 300 characters'),

  body('category')
    .trim()
    .notEmpty()
    .withMessage('Category is required')
    .isIn(VALID_CATEGORIES)
    .withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),

  body('difficulty')
    .trim()
    .notEmpty()
    .withMessage('Difficulty is required')
    .isIn(VALID_DIFFICULTY)
    .withMessage(`Difficulty must be one of: ${VALID_DIFFICULTY.join(', ')}`),

  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),

  body('prerequisites')
    .optional()
    .isArray()
    .withMessage('Prerequisites must be an array'),

  body('learningOutcomes')
    .optional()
    .isArray()
    .withMessage('Learning outcomes must be an array'),

  body('thumbnail')
    .optional()
    .trim()
];

/**
 * Validation for updating a course
 */
const updateCourseValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),

  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),

  body('category')
    .optional()
    .isIn(VALID_CATEGORIES)
    .withMessage(`Invalid category`),

  body('difficulty')
    .optional()
    .isIn(VALID_DIFFICULTY)
    .withMessage(`Invalid difficulty`)
];

/**
 * Validation for adding a lesson
 */
const addLessonValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('Lesson title is required')
    .isLength({ max: 200 })
    .withMessage('Title cannot exceed 200 characters'),

  body('content')
    .trim()
    .notEmpty()
    .withMessage('Lesson content is required'),

  body('videoUrl')
    .optional()
    .trim(),

  body('duration')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Duration must be a positive number'),

  body('order')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Order must be a positive number')
];

/**
 * Validation for adding quiz questions
 */
const addQuizValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),

  body('questions')
    .isArray({ min: 1 })
    .withMessage('At least one question is required'),

  body('questions.*.question')
    .trim()
    .notEmpty()
    .withMessage('Question text is required'),

  body('questions.*.options')
    .isArray({ min: 2 })
    .withMessage('At least 2 options are required'),

  body('questions.*.correctAnswer')
    .isInt({ min: 0 })
    .withMessage('Correct answer index is required')
];

/**
 * Validation for submitting quiz
 */
const submitQuizValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),

  body('answers')
    .isArray()
    .withMessage('Answers must be an array'),

  body('answers.*.questionId')
    .isMongoId()
    .withMessage('Invalid question ID'),

  body('answers.*.selectedAnswer')
    .isInt({ min: 0 })
    .withMessage('Selected answer must be a number')
];

/**
 * Validation for course ID parameter
 */
const courseIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID')
];

/**
 * Validation for lesson ID parameter
 */
const lessonIdValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid course ID'),
  
  param('lessonId')
    .isMongoId()
    .withMessage('Invalid lesson ID')
];

/**
 * Validation for listing courses
 */
const listCoursesValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),

  query('category')
    .optional()
    .isIn(VALID_CATEGORIES)
    .withMessage('Invalid category'),

  query('difficulty')
    .optional()
    .isIn(VALID_DIFFICULTY)
    .withMessage('Invalid difficulty'),

  query('search')
    .optional()
    .trim()
];

module.exports = {
  createCourseValidator,
  updateCourseValidator,
  addLessonValidator,
  addQuizValidator,
  submitQuizValidator,
  courseIdValidator,
  lessonIdValidator,
  listCoursesValidator,
  VALID_CATEGORIES,
  VALID_DIFFICULTY
};

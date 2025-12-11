/**
 * @fileoverview Course controller
 * @description Handles course CRUD, lessons, quizzes, and enrollment
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');
const { validationResult } = require('express-validator');
const { catchAsync } = require('../middlewares/error.middleware');
const logger = require('../utils/logger');

/**
 * @desc    Get all courses (admins see all, others see only published)
 * @route   GET /api/courses
 * @access  Public (filtered by role)
 */
exports.getCourses = catchAsync(async (req, res) => {
  const { 
    page = 1, 
    limit = 10, 
    category, 
    difficulty,
    search,
    featured,
    sort = '-createdAt',
    showAll  // NEW: Allow admin to see all courses including drafts
  } = req.query;

  // FIXED: Build filter based on user role
  const filter = {};
  
  // Admins can see all courses when showAll=true
  // Non-admins and guests only see published courses
  const isAdmin = req.user && req.user.role === 'admin';
  
  if (!isAdmin || showAll !== 'true') {
    filter.isPublished = true;
  }
  
  if (category) filter.category = category;
  if (difficulty) filter.difficulty = difficulty;
  if (featured === 'true') filter.isFeatured = true;
  if (search) filter.$text = { $search: search };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const courses = await Course.find(filter)
    .select('-lessons -quiz')
    .sort(sort)
    .skip(skip)
    .limit(parseInt(limit))
    .populate('createdBy', 'name avatar');

  const total = await Course.countDocuments(filter);

  res.status(200).json({
    success: true,
    message: 'Courses retrieved successfully',
    data: { courses },
    meta: {
      pagination: {
        currentPage: parseInt(page),
        itemsPerPage: parseInt(limit),
        totalItems: total,
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

/**
 * @desc    Get single course with lessons
 * @route   GET /api/courses/:id
 * @access  Public
 */
exports.getCourse = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.id)
    .populate('createdBy', 'name avatar');

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Check if user is enrolled (if authenticated)
  let enrollment = null;
  if (req.user) {
    enrollment = await Enrollment.findOne({
      user: req.user._id,
      course: course._id
    });
  }

  res.status(200).json({
    success: true,
    message: 'Course retrieved successfully',
    data: { 
      course,
      enrollment: enrollment || null,
      isEnrolled: !!enrollment
    }
  });
});

/**
 * @desc    Create new course
 * @route   POST /api/courses
 * @access  Private (Admin)
 */
exports.createCourse = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  req.body.createdBy = req.user._id;

  const course = await Course.create(req.body);

  logger.info('New course created', { courseId: course._id, title: course.title });

  res.status(201).json({
    success: true,
    message: 'Course created successfully',
    data: { course }
  });
});

/**
 * @desc    Update course
 * @route   PUT /api/courses/:id
 * @access  Private (Admin)
 */
exports.updateCourse = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const course = await Course.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  logger.info('Course updated', { courseId: course._id });

  res.status(200).json({
    success: true,
    message: 'Course updated successfully',
    data: { course }
  });
});

/**
 * @desc    Delete course
 * @route   DELETE /api/courses/:id
 * @access  Private (Admin)
 */
exports.deleteCourse = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Delete all enrollments for this course
  await Enrollment.deleteMany({ course: req.params.id });
  await Course.findByIdAndDelete(req.params.id);

  logger.info('Course deleted', { courseId: req.params.id });

  res.status(200).json({
    success: true,
    message: 'Course deleted successfully',
    data: null
  });
});

/**
 * @desc    Add lesson to course
 * @route   POST /api/courses/:id/lessons
 * @access  Private (Admin)
 */
exports.addLesson = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Set order if not provided
  if (!req.body.order) {
    req.body.order = course.lessons.length + 1;
  }

  course.lessons.push(req.body);
  await course.save();

  logger.info('Lesson added', { courseId: course._id, lessonTitle: req.body.title });

  res.status(201).json({
    success: true,
    message: 'Lesson added successfully',
    data: { course }
  });
});

/**
 * @desc    Update lesson
 * @route   PUT /api/courses/:id/lessons/:lessonId
 * @access  Private (Admin)
 */
exports.updateLesson = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  const lesson = course.lessons.id(req.params.lessonId);

  if (!lesson) {
    return res.status(404).json({
      success: false,
      message: 'Lesson not found'
    });
  }

  Object.assign(lesson, req.body);
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Lesson updated successfully',
    data: { course }
  });
});

/**
 * @desc    Delete lesson
 * @route   DELETE /api/courses/:id/lessons/:lessonId
 * @access  Private (Admin)
 */
exports.deleteLesson = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  course.lessons.pull(req.params.lessonId);
  await course.save();

  res.status(200).json({
    success: true,
    message: 'Lesson deleted successfully',
    data: { course }
  });
});

/**
 * @desc    Add quiz questions to course
 * @route   POST /api/courses/:id/quiz
 * @access  Private (Admin)
 */
exports.addQuiz = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  // Add questions to quiz
  course.quiz.push(...req.body.questions);
  await course.save();

  logger.info('Quiz questions added', { courseId: course._id, count: req.body.questions.length });

  res.status(201).json({
    success: true,
    message: 'Quiz questions added successfully',
    data: { course }
  });
});

/**
 * @desc    Enroll in a course
 * @route   POST /api/courses/:id/enroll
 * @access  Private
 */
exports.enrollCourse = catchAsync(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  if (!course.isPublished) {
    return res.status(400).json({
      success: false,
      message: 'Cannot enroll in unpublished course'
    });
  }

  // Check if already enrolled
  const existingEnrollment = await Enrollment.findOne({
    user: req.user._id,
    course: course._id
  });

  if (existingEnrollment) {
    return res.status(400).json({
      success: false,
      message: 'Already enrolled in this course'
    });
  }

  // Create enrollment
  const enrollment = await Enrollment.create({
    user: req.user._id,
    course: course._id
  });

  // Update enrollment count
  course.enrollmentCount += 1;
  await course.save();

  logger.info('User enrolled in course', { 
    userId: req.user._id, 
    courseId: course._id 
  });

  res.status(201).json({
    success: true,
    message: 'Enrolled successfully',
    data: { enrollment }
  });
});

/**
 * @desc    Mark lesson as complete
 * @route   POST /api/courses/:id/lessons/:lessonId/complete
 * @access  Private
 */
exports.completeLesson = catchAsync(async (req, res) => {
  const { id: courseId, lessonId } = req.params;

  const course = await Course.findById(courseId);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: courseId
  });

  if (!enrollment) {
    return res.status(400).json({
      success: false,
      message: 'Not enrolled in this course'
    });
  }

  // Check if lesson exists
  const lesson = course.lessons.id(lessonId);
  if (!lesson) {
    return res.status(404).json({
      success: false,
      message: 'Lesson not found'
    });
  }

  // Check if already completed
  const alreadyCompleted = enrollment.completedLessons.some(
    l => l.lessonId.toString() === lessonId
  );

  if (!alreadyCompleted) {
    enrollment.completedLessons.push({ lessonId });
    enrollment.updateProgress(course.lessons.length);
    enrollment.lastAccessedAt = new Date();
    await enrollment.save();
  }

  res.status(200).json({
    success: true,
    message: 'Lesson marked as complete',
    data: { 
      enrollment,
      progress: enrollment.progress
    }
  });
});

/**
 * @desc    Submit quiz answers
 * @route   POST /api/courses/:id/quiz/submit
 * @access  Private
 */
exports.submitQuiz = catchAsync(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }

  const course = await Course.findById(req.params.id);
  if (!course) {
    return res.status(404).json({
      success: false,
      message: 'Course not found'
    });
  }

  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: req.params.id
  });

  if (!enrollment) {
    return res.status(400).json({
      success: false,
      message: 'Not enrolled in this course'
    });
  }

  const { answers } = req.body;
  let score = 0;
  const processedAnswers = [];

  // Grade the quiz
  for (const answer of answers) {
    const question = course.quiz.id(answer.questionId);
    if (question) {
      const isCorrect = question.correctAnswer === answer.selectedAnswer;
      if (isCorrect) score++;
      processedAnswers.push({
        questionId: answer.questionId,
        selectedAnswer: answer.selectedAnswer,
        isCorrect
      });
    }
  }

  const percentage = Math.round((score / course.quiz.length) * 100);

  // Save quiz attempt
  enrollment.quizAttempts.push({
    score,
    totalQuestions: course.quiz.length,
    percentage,
    answers: processedAnswers
  });

  // Update best score
  if (percentage > enrollment.bestQuizScore) {
    enrollment.bestQuizScore = percentage;
  }

  // Check if course is completed (all lessons + quiz passed with 70%+)
  const allLessonsCompleted = enrollment.completedLessons.length === course.lessons.length;
  const quizPassed = percentage >= 70;
  
  if (allLessonsCompleted && quizPassed && !enrollment.certificateIssued) {
    enrollment.status = 'completed';
    enrollment.certificateIssued = true;
    enrollment.completedAt = new Date();
  }

  await enrollment.save();

  logger.info('Quiz submitted', { 
    userId: req.user._id, 
    courseId: course._id,
    score: percentage
  });

  res.status(200).json({
    success: true,
    message: 'Quiz submitted successfully',
    data: {
      score,
      totalQuestions: course.quiz.length,
      percentage,
      passed: percentage >= 70,
      answers: processedAnswers,
      certificateIssued: enrollment.certificateIssued,
      courseCompleted: enrollment.status === 'completed'
    }
  });
});

/**
 * @desc    Get user's enrolled courses
 * @route   GET /api/courses/my-courses
 * @access  Private
 */
exports.getMyCourses = catchAsync(async (req, res) => {
  const enrollments = await Enrollment.find({ user: req.user._id })
    .populate({
      path: 'course',
      select: 'title shortDescription thumbnail category difficulty duration lessons'
    })
    .sort('-lastAccessedAt');

  // Map enrollments with proper structure for frontend
  const formattedEnrollments = enrollments.map(enrollment => ({
    _id: enrollment._id,
    course: enrollment.course,
    progress: {
      percentage: enrollment.progress,
      completed: enrollment.status === 'completed'
    },
    status: enrollment.status,
    completedLessons: enrollment.completedLessons.length,
    totalLessons: enrollment.course.lessons?.length || 0,
    lastAccessedAt: enrollment.lastAccessedAt,
    bestQuizScore: enrollment.bestQuizScore,
    certificate: enrollment.certificateIssued,
    certificateIssued: enrollment.certificateIssued,
    completedAt: enrollment.completedAt
  }));

  res.status(200).json({
    success: true,
    message: 'Enrolled courses retrieved',
    data: { enrollments: formattedEnrollments }
  });
});

/**
 * @desc    Get featured courses
 * @route   GET /api/courses/featured
 * @access  Public
 */
exports.getFeaturedCourses = catchAsync(async (req, res) => {
  const courses = await Course.find({ isPublished: true, isFeatured: true })
    .select('-lessons -quiz')
    .limit(6)
    .sort('-enrollmentCount');

  res.status(200).json({
    success: true,
    message: 'Featured courses retrieved',
    data: { courses }
  });
});

/**
 * @desc    Get course categories with count
 * @route   GET /api/courses/categories
 * @access  Public
 */
exports.getCategories = catchAsync(async (req, res) => {
  const categories = await Course.aggregate([
    { $match: { isPublished: true } },
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);

  res.status(200).json({
    success: true,
    message: 'Categories retrieved',
    data: { categories }
  });
});

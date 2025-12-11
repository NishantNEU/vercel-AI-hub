/**
 * @fileoverview Course routes
 * @description API endpoints for courses, lessons, quizzes, and enrollment
 * 
 * @author AI Super Hub Team
 * @version 1.0.0
 */

const express = require('express');
const router = express.Router();
const courseController = require('../controllers/course.controller');
const { protect, adminOnly, optionalAuth } = require('../middlewares/auth.middleware');
const {
  createCourseValidator,
  updateCourseValidator,
  addLessonValidator,
  addQuizValidator,
  submitQuizValidator,
  courseIdValidator,
  lessonIdValidator,
  listCoursesValidator
} = require('../validators/course.validator');

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all published courses (admins can see drafts with showAll=true)
 *     tags: [Courses]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *       - in: query
 *         name: showAll
 *         schema:
 *           type: string
 *         description: Set to 'true' for admins to see draft courses
 *     responses:
 *       200:
 *         description: Courses retrieved successfully
 */
// FIXED: Added optionalAuth so req.user is available for admin check
router.get('/', optionalAuth, listCoursesValidator, courseController.getCourses);

/**
 * @swagger
 * /api/courses/featured:
 *   get:
 *     summary: Get featured courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Featured courses retrieved
 */
router.get('/featured', courseController.getFeaturedCourses);

/**
 * @swagger
 * /api/courses/categories:
 *   get:
 *     summary: Get course categories with count
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Categories retrieved
 */
router.get('/categories', courseController.getCategories);

/**
 * @swagger
 * /api/courses/my-courses:
 *   get:
 *     summary: Get user's enrolled courses
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Enrolled courses retrieved
 */
router.get('/my-courses', protect, courseController.getMyCourses);

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get single course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course retrieved
 */
router.get('/:id', courseIdValidator, optionalAuth, courseController.getCourse);

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - category
 *               - difficulty
 *     responses:
 *       201:
 *         description: Course created
 */
router.post('/', protect, adminOnly, createCourseValidator, courseController.createCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course updated
 */
router.put('/:id', protect, adminOnly, updateCourseValidator, courseController.updateCourse);

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted
 */
router.delete('/:id', protect, adminOnly, courseIdValidator, courseController.deleteCourse);

/**
 * @swagger
 * /api/courses/{id}/enroll:
 *   post:
 *     summary: Enroll in a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Enrolled successfully
 */
router.post('/:id/enroll', protect, courseIdValidator, courseController.enrollCourse);

/**
 * @swagger
 * /api/courses/{id}/lessons:
 *   post:
 *     summary: Add lesson to course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       201:
 *         description: Lesson added
 */
router.post('/:id/lessons', protect, adminOnly, addLessonValidator, courseController.addLesson);

/**
 * @swagger
 * /api/courses/{id}/lessons/{lessonId}:
 *   put:
 *     summary: Update a lesson
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lesson updated
 */
router.put('/:id/lessons/:lessonId', protect, adminOnly, lessonIdValidator, courseController.updateLesson);

/**
 * @swagger
 * /api/courses/{id}/lessons/{lessonId}:
 *   delete:
 *     summary: Delete a lesson
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lesson deleted
 */
router.delete('/:id/lessons/:lessonId', protect, adminOnly, lessonIdValidator, courseController.deleteLesson);

/**
 * @swagger
 * /api/courses/{id}/lessons/{lessonId}/complete:
 *   post:
 *     summary: Mark lesson as complete
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lesson marked complete
 */
router.post('/:id/lessons/:lessonId/complete', protect, lessonIdValidator, courseController.completeLesson);

/**
 * @swagger
 * /api/courses/{id}/quiz:
 *   post:
 *     summary: Add quiz questions
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Quiz questions added
 */
router.post('/:id/quiz', protect, adminOnly, addQuizValidator, courseController.addQuiz);

/**
 * @swagger
 * /api/courses/{id}/quiz/submit:
 *   post:
 *     summary: Submit quiz answers
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Quiz graded
 */
router.post('/:id/quiz/submit', protect, submitQuizValidator, courseController.submitQuiz);

module.exports = router;

/**
 * Migration Script: Issue Certificates for Existing Completed Courses
 * 
 * This script retroactively issues certificates for users who:
 * - Completed all lessons
 * - Passed the quiz with 70% or higher
 * - Haven't received a certificate yet
 * 
 * Usage:
 * 1. Place this file in server/src/scripts/
 * 2. Run from project root: node server/src/scripts/migrateCertificates.js
 */

const mongoose = require('mongoose');
const path = require('path');

// Load .env from server directory
require('dotenv').config({ path: path.join(__dirname, '../../.env') });

// Import models
const Enrollment = require('../models/Enrollment');
const Course = require('../models/Course');

async function migrateCertificates() {
  try {
    console.log('🚀 Starting certificate migration...');
    
    // Check if MONGODB_URI is loaded
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI not found in environment variables. Please check your .env file.');
    }
    
    console.log('📝 MongoDB URI loaded:', process.env.MONGODB_URI.substring(0, 20) + '...');
    
    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to database');

    // Find all enrollments with populated courses
    const enrollments = await Enrollment.find()
      .populate('course');
    
    console.log(`📊 Found ${enrollments.length} total enrollments`);

    let certificatesIssued = 0;
    let alreadyHadCertificates = 0;
    let notQualified = 0;

    for (const enrollment of enrollments) {
      const course = enrollment.course;
      
      // Skip if course not found
      if (!course) {
        console.log(`⚠️  Skipping enrollment ${enrollment._id} - course not found`);
        continue;
      }

      // Check if already has certificate
      if (enrollment.certificateIssued) {
        alreadyHadCertificates++;
        continue;
      }

      // Check completion criteria
      const totalLessons = course.lessons?.length || 0;
      const allLessonsCompleted = 
        enrollment.completedLessons.length === totalLessons && 
        totalLessons > 0;
      const quizPassed = enrollment.bestQuizScore >= 70;

      if (allLessonsCompleted && quizPassed) {
        // Issue certificate
        enrollment.status = 'completed';
        enrollment.certificateIssued = true;
        // Use the last quiz attempt date or updatedAt as completion date
        const lastQuizAttempt = enrollment.quizAttempts[enrollment.quizAttempts.length - 1];
        enrollment.completedAt = lastQuizAttempt?.attemptedAt || enrollment.updatedAt;
        
        await enrollment.save();
        
        certificatesIssued++;
        console.log(`✅ Certificate issued for user ${enrollment.user} - Course: ${course.title}`);
      } else {
        notQualified++;
        console.log(`ℹ️  User ${enrollment.user} not qualified yet - Lessons: ${enrollment.completedLessons.length}/${totalLessons}, Quiz: ${enrollment.bestQuizScore}%`);
      }
    }

    console.log('\n📈 Migration Summary:');
    console.log(`  ✅ New certificates issued: ${certificatesIssued}`);
    console.log(`  📜 Already had certificates: ${alreadyHadCertificates}`);
    console.log(`  ⏳ Not yet qualified: ${notQualified}`);
    console.log(`  📊 Total processed: ${enrollments.length}`);
    
    console.log('\n🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('👋 Database connection closed');
  }
}

// Run migration
if (require.main === module) {
  migrateCertificates()
    .then(() => {
      console.log('✨ Done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Fatal error:', error);
      process.exit(1);
    });
}

module.exports = migrateCertificates;

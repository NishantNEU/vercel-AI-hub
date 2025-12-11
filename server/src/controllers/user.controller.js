const User = require('../models/User');
const Enrollment = require('../models/Enrollment');
const Chat = require('../models/Chat');
const { catchAsync } = require('../middlewares/error.middleware');

exports.getUserStats = catchAsync(async (req, res) => {
  const userId = req.user._id;

  const enrollments = await Enrollment.find({ user: userId }).populate('course', 'duration lessons');
  const enrollmentsCount = enrollments.length;
  
  // Count completed courses (status is 'completed' and certificate issued)
  const completedCourses = enrollments.filter(e => e.status === 'completed' && e.certificateIssued).length;
  
  const chatSessionsCount = await Chat.countDocuments({ user: userId });
  const user = await User.findById(userId);
  const bookmarkedToolsCount = user.bookmarkedTools?.length || 0;

  // Calculate learning hours from completed lessons
  let totalLearningMinutes = 0;
  enrollments.forEach(enrollment => {
    const completedLessons = enrollment.completedLessons?.length || 0;
    const totalLessons = enrollment.course?.lessons?.length || 1;
    const courseDurationMinutes = enrollment.course?.duration || 0;
    // Calculate proportional minutes based on completed lessons
    totalLearningMinutes += (courseDurationMinutes * completedLessons) / totalLessons;
  });

  // Convert minutes to hours and round to 1 decimal place
  const totalLearningHours = totalLearningMinutes / 60;

  res.status(200).json({
    success: true,
    data: {
      enrollmentsCount,
      completedCourses,
      chatSessionsCount,
      bookmarkedToolsCount,
      favoritePromptsCount: 0,
      learningHours: Math.round(totalLearningHours * 10) / 10
    }
  });
});

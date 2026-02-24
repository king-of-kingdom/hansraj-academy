const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Certificate = require('../models/Certificate');
const Course = require('../models/Course');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/quiz/course/:courseId
// @desc    Get quiz for a course
// @access  Private
router.get('/course/:courseId', protect, async (req, res) => {
  try {
    const quiz = await Quiz.findOne({ 
      courseId: req.params.courseId,
      isActive: true 
    });

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'No quiz available for this course'
      });
    }

    // Check if user has completed 80% of course
    const enrollment = req.user.enrolledCourses.find(
      e => e.courseId.toString() === req.params.courseId
    );

    if (!enrollment || enrollment.progress < 80) {
      return res.status(403).json({
        success: false,
        message: 'Complete at least 80% of the course to take the quiz',
        currentProgress: enrollment?.progress || 0
      });
    }

    // Check if already has certificate
    const existingCert = await Certificate.findOne({
      userId: req.user._id,
      courseId: req.params.courseId
    });

    if (existingCert) {
      return res.json({
        success: true,
        hasCertificate: true,
        certificate: existingCert
      });
    }

    // Return quiz without correct answers
    const quizData = {
      id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      passingScore: quiz.passingScore,
      timeLimit: quiz.timeLimit,
      questionCount: quiz.questions.length,
      questions: quiz.questions.map(q => ({
        id: q._id,
        question: q.question,
        options: q.options
        // correctAnswer is not sent to client
      }))
    };

    res.json({
      success: true,
      quiz: quizData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quiz',
      error: error.message
    });
  }
});

// @route   POST /api/quiz/:quizId/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/:quizId/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, answer }
    
    const quiz = await Quiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if already has certificate
    const existingCert = await Certificate.findOne({
      userId: req.user._id,
      courseId: quiz.courseId
    });

    if (existingCert) {
      return res.status(400).json({
        success: false,
        message: 'You already have a certificate for this course'
      });
    }

    // Calculate score
    let correctCount = 0;
    const results = [];

    for (const question of quiz.questions) {
      const userAnswer = answers.find(
        a => a.questionId === question._id.toString()
      );
      const isCorrect = userAnswer?.answer === question.correctAnswer;
      
      if (isCorrect) correctCount++;
      
      results.push({
        questionId: question._id,
        correct: isCorrect,
        correctAnswer: question.correctAnswer,
        userAnswer: userAnswer?.answer
      });
    }

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const passed = score >= quiz.passingScore;

    // If passed, create certificate
    let certificate = null;
    if (passed) {
      const course = await Course.findById(quiz.courseId);
      certificate = await Certificate.create({
        userId: req.user._id,
        courseId: quiz.courseId,
        userName: req.user.name,
        courseName: course.title,
        score
      });
    }

    res.json({
      success: true,
      score,
      passed,
      correctCount,
      totalQuestions: quiz.questions.length,
      passingScore: quiz.passingScore,
      results,
      certificate
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
});

// @route   POST /api/quiz
// @desc    Create quiz (Admin)
// @access  Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.create(req.body);

    res.status(201).json({
      success: true,
      message: 'Quiz created successfully',
      quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to create quiz',
      error: error.message
    });
  }
});

// @route   PUT /api/quiz/:id
// @desc    Update quiz (Admin)
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      message: 'Quiz updated successfully',
      quiz
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update quiz',
      error: error.message
    });
  }
});

// @route   DELETE /api/quiz/:id
// @desc    Delete quiz (Admin)
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete quiz',
      error: error.message
    });
  }
});

// @route   GET /api/quiz/all
// @desc    Get all quizzes (Admin)
// @access  Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const quizzes = await Quiz.find()
      .populate('courseId', 'title')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      quizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes',
      error: error.message
    });
  }
});

module.exports = router;

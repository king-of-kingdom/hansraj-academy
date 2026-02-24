const express = require('express');
const router = express.Router();
const DailyQuiz = require('../models/DailyQuiz');
const QuizResponse = require('../models/QuizResponse');
const { protect, adminOnly } = require('../middleware/auth');

// @route   GET /api/daily-quiz/today
// @desc    Get today's quiz for students
// @access  Private
router.get('/today', protect, async (req, res) => {
  try {
    // Get today's date (start of day)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    // Find today's active quizzes
    const quizzes = await DailyQuiz.find({
      date: { $gte: today, $lt: tomorrow },
      isActive: true
    }).sort({ createdAt: -1 });

    // Check if user already submitted
    const userResponses = await QuizResponse.find({
      userId: req.user._id,
      quizId: { $in: quizzes.map(q => q._id) }
    });

    const submittedQuizIds = userResponses.map(r => r.quizId.toString());

    // Format quizzes - hide correct answers
    const formattedQuizzes = quizzes.map(quiz => {
      const isSubmitted = submittedQuizIds.includes(quiz._id.toString());
      const response = userResponses.find(r => r.quizId.toString() === quiz._id.toString());
      
      return {
        _id: quiz._id,
        title: quiz.title,
        date: quiz.date,
        questionCount: quiz.questions.length,
        isSubmitted,
        score: response?.score || null,
        questions: isSubmitted ? [] : quiz.questions.map(q => ({
          _id: q._id,
          question: q.question,
          options: q.options
          // correctAnswer NOT included for students
        }))
      };
    });

    res.json({
      success: true,
      quizzes: formattedQuizzes
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch daily quiz',
      error: error.message
    });
  }
});

// @route   POST /api/daily-quiz/:quizId/submit
// @desc    Submit quiz answers
// @access  Private
router.post('/:quizId/submit', protect, async (req, res) => {
  try {
    const { answers } = req.body; // Array of { questionId, selectedAnswer }

    const quiz = await DailyQuiz.findById(req.params.quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: 'Quiz not found'
      });
    }

    // Check if already submitted
    const existingResponse = await QuizResponse.findOne({
      quizId: req.params.quizId,
      userId: req.user._id
    });

    if (existingResponse) {
      return res.status(400).json({
        success: false,
        message: 'You have already submitted this quiz'
      });
    }

    // Process answers
    let correctCount = 0;
    const processedAnswers = quiz.questions.map(question => {
      const userAnswer = answers.find(a => a.questionId === question._id.toString());
      const isCorrect = userAnswer?.selectedAnswer === question.correctAnswer;
      if (isCorrect) correctCount++;

      return {
        questionId: question._id,
        questionText: question.question,
        selectedAnswer: userAnswer?.selectedAnswer ?? -1,
        correctAnswer: question.correctAnswer,
        isCorrect
      };
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);

    // Create response record
    const quizResponse = await QuizResponse.create({
      quizId: quiz._id,
      quizTitle: quiz.title,
      userId: req.user._id,
      userName: req.user.name,
      userEmail: req.user.email,
      userPhone: req.user.phone || '',
      answers: processedAnswers,
      totalQuestions: quiz.questions.length,
      correctAnswers: correctCount,
      score
    });

    res.json({
      success: true,
      message: 'Quiz submitted successfully!',
      result: {
        totalQuestions: quiz.questions.length,
        correctAnswers: correctCount,
        score,
        answers: processedAnswers
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to submit quiz',
      error: error.message
    });
  }
});

// =============== ADMIN ROUTES ===============

// @route   GET /api/daily-quiz/all
// @desc    Get all daily quizzes (Admin)
// @access  Admin
router.get('/all', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const quizzes = await DailyQuiz.find()
      .sort({ date: -1, createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await DailyQuiz.countDocuments();

    // Get response counts for each quiz
    const quizzesWithStats = await Promise.all(
      quizzes.map(async (quiz) => {
        const responseCount = await QuizResponse.countDocuments({ quizId: quiz._id });
        return {
          ...quiz.toObject(),
          responseCount
        };
      })
    );

    res.json({
      success: true,
      quizzes: quizzesWithStats,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch quizzes',
      error: error.message
    });
  }
});

// @route   POST /api/daily-quiz
// @desc    Create daily quiz (Admin)
// @access  Admin
router.post('/', protect, adminOnly, async (req, res) => {
  try {
    const { title, date, questions } = req.body;

    const quiz = await DailyQuiz.create({
      title,
      date: date || new Date(),
      questions,
      createdBy: req.user._id,
      isActive: true
    });

    res.status(201).json({
      success: true,
      message: 'Daily quiz created successfully!',
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

// @route   PUT /api/daily-quiz/:id
// @desc    Update daily quiz (Admin)
// @access  Admin
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
    const quiz = await DailyQuiz.findByIdAndUpdate(
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

// @route   DELETE /api/daily-quiz/:id
// @desc    Delete daily quiz (Admin)
// @access  Admin
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    await DailyQuiz.findByIdAndDelete(req.params.id);
    await QuizResponse.deleteMany({ quizId: req.params.id });

    res.json({
      success: true,
      message: 'Quiz and all responses deleted'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to delete quiz',
      error: error.message
    });
  }
});

// @route   GET /api/daily-quiz/:quizId/responses
// @desc    Get all responses for a quiz (Admin)
// @access  Admin
router.get('/:quizId/responses', protect, adminOnly, async (req, res) => {
  try {
    const responses = await QuizResponse.find({ quizId: req.params.quizId })
      .sort({ submittedAt: -1 });

    const quiz = await DailyQuiz.findById(req.params.quizId);

    res.json({
      success: true,
      quiz: quiz ? {
        _id: quiz._id,
        title: quiz.title,
        date: quiz.date,
        questionCount: quiz.questions.length
      } : null,
      responses,
      totalResponses: responses.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch responses',
      error: error.message
    });
  }
});

// @route   GET /api/daily-quiz/responses/all
// @desc    Get all quiz responses (Admin) - like payment messages
// @access  Admin
router.get('/responses/all', protect, adminOnly, async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;

    const responses = await QuizResponse.find()
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await QuizResponse.countDocuments();

    // Stats
    const stats = {
      totalResponses: total,
      todayResponses: await QuizResponse.countDocuments({
        submittedAt: { $gte: new Date(new Date().setHours(0, 0, 0, 0)) }
      }),
      averageScore: await QuizResponse.aggregate([
        { $group: { _id: null, avgScore: { $avg: '$score' } } }
      ]).then(result => Math.round(result[0]?.avgScore || 0))
    };

    res.json({
      success: true,
      responses,
      stats,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page)
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch responses',
      error: error.message
    });
  }
});

module.exports = router;

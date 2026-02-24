import { useState, useEffect } from 'react';
import { Navigate, Link } from 'react-router-dom';
import { 
  Brain, CheckCircle, XCircle, Clock, Trophy, 
  ArrowRight, Sparkles, Target, Award, RefreshCw
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

interface Question {
  id: string;
  question: string;
  options: string[];
}

interface Quiz {
  id: string;
  title: string;
  date: string;
  questions: Question[];
  isSubmitted: boolean;
  score: number | null;
}

interface QuizResult {
  totalQuestions: number;
  correctAnswers: number;
  score: number;
  answers: {
    questionId: string;
    questionText: string;
    selectedAnswer: number;
    correctAnswer: number;
    isCorrect: boolean;
  }[];
}

// Sample daily quizzes (in production, fetch from API)
const sampleQuizzes: Quiz[] = [
  {
    id: 'dq-1',
    title: "Today's Knowledge Test",
    date: new Date().toISOString(),
    isSubmitted: false,
    score: null,
    questions: [
      {
        id: 'q1',
        question: 'What is the shortcut key to copy in Windows?',
        options: ['Ctrl + C', 'Ctrl + V', 'Ctrl + X', 'Ctrl + Z']
      },
      {
        id: 'q2',
        question: 'Which function is used to add numbers in Excel?',
        options: ['ADD()', 'SUM()', 'TOTAL()', 'PLUS()']
      },
      {
        id: 'q3',
        question: 'What does HTML stand for?',
        options: ['Hyper Text Markup Language', 'High Tech Modern Language', 'Home Tool Markup Language', 'Hyper Transfer Markup Language']
      },
      {
        id: 'q4',
        question: 'Which software is used for photo editing?',
        options: ['MS Word', 'Adobe Photoshop', 'VLC Player', 'Notepad']
      }
    ]
  }
];

// Correct answers (in production, this would be on server)
const correctAnswers: { [key: string]: number } = {
  'q1': 0,
  'q2': 1,
  'q3': 0,
  'q4': 1
};

export function DailyQuizPage() {
  const { user } = useApp();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Load quizzes and check localStorage for submitted ones
    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedDailyQuizzes') || '{}');
    
    const updatedQuizzes = sampleQuizzes.map(quiz => ({
      ...quiz,
      isSubmitted: !!submittedQuizzes[quiz.id],
      score: submittedQuizzes[quiz.id]?.score || null
    }));
    
    setQuizzes(updatedQuizzes);
  }, []);

  if (!user) {
    return <Navigate to="/login" />;
  }

  const handleSelectAnswer = (questionId: string, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleSubmit = () => {
    if (!selectedQuiz) return;
    
    setIsSubmitting(true);

    // Calculate results
    let correctCount = 0;
    const processedAnswers = selectedQuiz.questions.map(q => {
      const userAnswer = selectedAnswers[q.id] ?? -1;
      const correct = correctAnswers[q.id];
      const isCorrect = userAnswer === correct;
      if (isCorrect) correctCount++;

      return {
        questionId: q.id,
        questionText: q.question,
        selectedAnswer: userAnswer,
        correctAnswer: correct,
        isCorrect
      };
    });

    const score = Math.round((correctCount / selectedQuiz.questions.length) * 100);

    // Save to localStorage (in production, send to API)
    const submittedQuizzes = JSON.parse(localStorage.getItem('submittedDailyQuizzes') || '{}');
    submittedQuizzes[selectedQuiz.id] = {
      score,
      submittedAt: new Date().toISOString(),
      userName: user.name,
      userEmail: user.email,
      answers: processedAnswers
    };
    localStorage.setItem('submittedDailyQuizzes', JSON.stringify(submittedQuizzes));

    // Also save to quiz responses for admin
    const allResponses = JSON.parse(localStorage.getItem('dailyQuizResponses') || '[]');
    allResponses.push({
      id: `resp-${Date.now()}`,
      quizId: selectedQuiz.id,
      quizTitle: selectedQuiz.title,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      answers: processedAnswers,
      totalQuestions: selectedQuiz.questions.length,
      correctAnswers: correctCount,
      score,
      submittedAt: new Date().toISOString()
    });
    localStorage.setItem('dailyQuizResponses', JSON.stringify(allResponses));

    setTimeout(() => {
      setResult({
        totalQuestions: selectedQuiz.questions.length,
        correctAnswers: correctCount,
        score,
        answers: processedAnswers
      });
      setIsSubmitting(false);

      // Update quiz list
      setQuizzes(prev => prev.map(q => 
        q.id === selectedQuiz.id ? { ...q, isSubmitted: true, score } : q
      ));

      if (score >= 70) {
        toast.success('🎉 Excellent! You passed the quiz!');
      } else {
        toast.error('Keep learning! Try again tomorrow.');
      }
    }, 1000);
  };

  const resetQuiz = () => {
    setSelectedQuiz(null);
    setCurrentQuestion(0);
    setSelectedAnswers({});
    setResult(null);
  };

  // Quiz Selection Screen
  if (!selectedQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-indigo-100 to-purple-100 mb-6">
              <Sparkles className="w-5 h-5 text-indigo-600 mr-2 animate-pulse" />
              <span className="text-indigo-700 font-semibold">Daily Quiz Challenge</span>
            </div>
            <h1 className="text-4xl font-black text-gray-900 mb-4">
              Test Your <span className="text-gradient">Knowledge</span>
            </h1>
            <p className="text-gray-600 text-lg">
              Take daily quizzes to improve your skills and track your progress!
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Trophy className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {quizzes.filter(q => q.isSubmitted && (q.score || 0) >= 70).length}
              </p>
              <p className="text-gray-500 text-sm">Quizzes Passed</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Target className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {quizzes.filter(q => q.isSubmitted).length}
              </p>
              <p className="text-gray-500 text-sm">Attempted</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-lg text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Award className="w-6 h-6 text-white" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {quizzes.filter(q => q.isSubmitted).length > 0 
                  ? Math.round(quizzes.filter(q => q.isSubmitted).reduce((sum, q) => sum + (q.score || 0), 0) / quizzes.filter(q => q.isSubmitted).length)
                  : 0}%
              </p>
              <p className="text-gray-500 text-sm">Avg Score</p>
            </div>
          </div>

          {/* Quiz List */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Available Quizzes</h2>
            
            {quizzes.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center shadow-lg">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700">No quizzes available today</h3>
                <p className="text-gray-500 mt-2">Check back later for new quizzes!</p>
              </div>
            ) : (
              quizzes.map((quiz) => (
                <div 
                  key={quiz.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${
                        quiz.isSubmitted 
                          ? (quiz.score || 0) >= 70 
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                            : 'bg-gradient-to-r from-orange-400 to-red-500'
                          : 'bg-gradient-to-r from-indigo-500 to-purple-500'
                      }`}>
                        {quiz.isSubmitted ? (
                          (quiz.score || 0) >= 70 ? (
                            <CheckCircle className="w-7 h-7 text-white" />
                          ) : (
                            <XCircle className="w-7 h-7 text-white" />
                          )
                        ) : (
                          <Brain className="w-7 h-7 text-white" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg">{quiz.title}</h3>
                        <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {new Date(quiz.date).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>{quiz.questions.length} Questions</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {quiz.isSubmitted ? (
                        <div className="text-right">
                          <p className={`text-2xl font-bold ${
                            (quiz.score || 0) >= 70 ? 'text-green-600' : 'text-orange-600'
                          }`}>
                            {quiz.score}%
                          </p>
                          <p className="text-sm text-gray-500">Score</p>
                        </div>
                      ) : (
                        <button
                          onClick={() => setSelectedQuiz(quiz)}
                          className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/30 transition-all"
                        >
                          Start Quiz
                          <ArrowRight className="w-5 h-5 ml-2" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Back to Dashboard */}
          <div className="text-center mt-8">
            <Link 
              to="/dashboard" 
              className="text-indigo-600 font-semibold hover:underline"
            >
              ← Back to Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Result Screen
  if (result) {
    const passed = result.score >= 70;
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12">
        <div className="max-w-2xl mx-auto px-4">
          <div className={`bg-white rounded-3xl shadow-2xl p-8 text-center border-4 ${
            passed ? 'border-green-400' : 'border-orange-400'
          }`}>
            {/* Result Header */}
            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
              passed 
                ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                : 'bg-gradient-to-r from-orange-400 to-red-500'
            }`}>
              {passed ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <Target className="w-12 h-12 text-white" />
              )}
            </div>

            <h1 className="text-3xl font-black text-gray-900">
              {passed ? '🎉 Congratulations!' : 'Keep Learning!'}
            </h1>
            <p className="text-gray-600 mt-2">
              {passed 
                ? 'You did an excellent job!' 
                : 'Practice makes perfect. Try again tomorrow!'}
            </p>

            {/* Score Display */}
            <div className="mt-8 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
              <p className="text-6xl font-black text-gradient">{result.score}%</p>
              <p className="text-gray-500 mt-2">Your Score</p>
              
              <div className="flex justify-center space-x-8 mt-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{result.correctAnswers}</p>
                  <p className="text-sm text-gray-500">Correct</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-red-600">{result.totalQuestions - result.correctAnswers}</p>
                  <p className="text-sm text-gray-500">Wrong</p>
                </div>
              </div>
            </div>

            {/* Answer Review */}
            <div className="mt-8 text-left">
              <h3 className="font-bold text-gray-900 mb-4">Answer Review:</h3>
              <div className="space-y-3">
                {result.answers.map((answer, index) => (
                  <div 
                    key={answer.questionId}
                    className={`p-4 rounded-xl ${
                      answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        answer.isCorrect ? 'bg-green-500' : 'bg-red-500'
                      }`}>
                        {answer.isCorrect ? (
                          <CheckCircle className="w-4 h-4 text-white" />
                        ) : (
                          <XCircle className="w-4 h-4 text-white" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Q{index + 1}: {answer.questionText}</p>
                        {!answer.isCorrect && (
                          <p className="text-sm text-gray-600 mt-1">
                            Correct Answer: {selectedQuiz?.questions[index].options[answer.correctAnswer]}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={resetQuiz}
                className="flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-semibold hover:bg-gray-200 transition"
              >
                <RefreshCw className="w-5 h-5 mr-2" />
                Back to Quizzes
              </button>
              <Link
                to="/dashboard"
                className="flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition"
              >
                Go to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Taking Screen
  const currentQ = selectedQuiz.questions[currentQuestion];
  const allAnswered = selectedQuiz.questions.every(q => selectedAnswers[q.id] !== undefined);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-white">{selectedQuiz.title}</h1>
            <p className="text-sm text-white/60">
              Question {currentQuestion + 1} of {selectedQuiz.questions.length}
            </p>
          </div>
          <button
            onClick={resetQuiz}
            className="text-white/70 hover:text-white transition"
          >
            Exit Quiz
          </button>
        </div>

        {/* Progress Bar */}
        <div className="bg-white/10 rounded-full h-2 mb-8">
          <div 
            className="bg-gradient-to-r from-indigo-400 to-purple-400 h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentQuestion + 1) / selectedQuiz.questions.length) * 100}%` }}
          />
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            {currentQ.question}
          </h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(currentQ.id, index)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-300 ${
                  selectedAnswers[currentQ.id] === index
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center">
                  <span className={`w-10 h-10 rounded-xl flex items-center justify-center mr-4 font-bold transition-all ${
                    selectedAnswers[currentQ.id] === index
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-900 font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              Previous
            </button>

            {currentQuestion === selectedQuiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                disabled={!allAnswered || isSubmitting}
                className="flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-8 py-3 rounded-xl font-bold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5 mr-2" />
                    Submit Quiz
                  </>
                )}
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(selectedQuiz.questions.length - 1, prev + 1))}
                className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-lg transition-all"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 mt-6">
          <p className="text-white/60 text-sm mb-3">Question Navigator</p>
          <div className="flex flex-wrap gap-2">
            {selectedQuiz.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  currentQuestion === index
                    ? 'bg-white text-indigo-600'
                    : selectedAnswers[q.id] !== undefined
                    ? 'bg-green-500 text-white'
                    : 'bg-white/20 text-white hover:bg-white/30'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

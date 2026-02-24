import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import { Clock, CheckCircle, XCircle, Award, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export function QuizPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { courses, quizzes, user, submitQuizResult, certificates } = useApp();

  const course = courses.find(c => c.id === courseId);
  const quiz = quizzes.find(q => q.courseId === courseId);
  const enrollment = user?.enrolledCourses.find(e => e.courseId === courseId);
  const existingCert = certificates.find(c => c.courseId === courseId && c.userId === user?.id);

  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(quiz?.timeLimit ? quiz.timeLimit * 60 : 1800);
  const [isFinished, setIsFinished] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    if (isFinished || !quiz) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isFinished, quiz]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (!course || !quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-500 mb-4">Quiz not available for this course yet.</p>
          <button
            onClick={() => navigate(-1)}
            className="text-indigo-600 hover:underline"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!enrollment || enrollment.progress < 80) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900">Complete the Course First!</h2>
          <p className="text-gray-500 mt-2">
            You need to complete at least 80% of the course to take the certification test.
          </p>
          <p className="text-indigo-600 font-semibold mt-2">
            Current Progress: {enrollment?.progress || 0}%
          </p>
          <button
            onClick={() => navigate(`/course/${courseId}`)}
            className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
          >
            Continue Learning
          </button>
        </div>
      </div>
    );
  }

  if (existingCert) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto px-4">
          <div className="bg-white rounded-xl shadow-lg p-8 text-center border-4 border-yellow-400">
            <Award className="w-20 h-20 text-yellow-500 mx-auto" />
            <h1 className="text-2xl font-bold text-gray-900 mt-4">🎉 Congratulations!</h1>
            <p className="text-gray-600 mt-2">You have already earned this certificate!</p>
            
            <div className="mt-6 p-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl">
              <p className="text-sm text-gray-500">Certificate of Completion</p>
              <h2 className="text-xl font-bold text-indigo-600 mt-1">{course.title}</h2>
              <p className="text-gray-600 mt-2">Awarded to: {user.name}</p>
              <p className="text-lg font-bold text-green-600 mt-2">Score: {existingCert.score}%</p>
              <p className="text-sm text-gray-400 mt-2">
                Issued on: {new Date(existingCert.issuedAt).toLocaleDateString()}
              </p>
              <div className="mt-4 p-3 bg-white rounded-lg">
                <p className="text-xs text-gray-500">Certificate ID</p>
                <p className="font-mono text-sm">{existingCert.id}</p>
              </div>
            </div>

            <button
              onClick={() => navigate('/dashboard')}
              className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleSelectAnswer = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.questions.forEach((q, index) => {
      if (selectedAnswers[index] === q.correctAnswer) {
        correctCount++;
      }
    });
    
    const calculatedScore = Math.round((correctCount / quiz.questions.length) * 100);
    setScore(calculatedScore);
    setIsFinished(true);
    
    submitQuizResult(quiz.id, calculatedScore);
    
    if (calculatedScore >= quiz.passingScore) {
      toast.success('🎉 Congratulations! You passed the test!');
    } else {
      toast.error('Sorry, you did not pass. Try again!');
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isFinished) {
    const passed = score >= quiz.passingScore;
    
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-lg mx-auto px-4">
          <div className={`bg-white rounded-xl shadow-lg p-8 text-center border-4 ${
            passed ? 'border-green-400' : 'border-red-400'
          }`}>
            {passed ? (
              <>
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mt-4">🎉 Congratulations!</h1>
                <p className="text-gray-600 mt-2">You passed the certification test!</p>
              </>
            ) : (
              <>
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900 mt-4">Keep Learning!</h1>
                <p className="text-gray-600 mt-2">You need {quiz.passingScore}% to pass.</p>
              </>
            )}

            <div className="mt-6 p-6 bg-gray-50 rounded-xl">
              <p className="text-5xl font-bold text-gray-900">{score}%</p>
              <p className="text-gray-500 mt-2">Your Score</p>
              <div className="flex justify-center space-x-8 mt-4">
                <div>
                  <p className="text-green-600 font-bold text-xl">
                    {selectedAnswers.filter((a, i) => a === quiz.questions[i].correctAnswer).length}
                  </p>
                  <p className="text-sm text-gray-500">Correct</p>
                </div>
                <div>
                  <p className="text-red-600 font-bold text-xl">
                    {quiz.questions.length - selectedAnswers.filter((a, i) => a === quiz.questions[i].correctAnswer).length}
                  </p>
                  <p className="text-sm text-gray-500">Wrong</p>
                </div>
              </div>
            </div>

            {passed ? (
              <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <Award className="w-8 h-8 text-yellow-500 mx-auto" />
                <p className="text-yellow-800 font-semibold mt-2">Certificate Issued!</p>
                <p className="text-sm text-yellow-600">Check your dashboard for the certificate</p>
              </div>
            ) : (
              <button
                onClick={() => {
                  setIsFinished(false);
                  setCurrentQuestion(0);
                  setSelectedAnswers([]);
                  setTimeLeft(quiz.timeLimit * 60);
                }}
                className="mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700"
              >
                Try Again
              </button>
            )}

            <button
              onClick={() => navigate('/dashboard')}
              className="mt-4 text-indigo-600 font-semibold hover:underline block mx-auto"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quiz.questions[currentQuestion];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-gray-900">{quiz.title}</h1>
            <p className="text-sm text-gray-500">{course.title}</p>
          </div>
          <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${
            timeLeft < 60 ? 'bg-red-100 text-red-700' : 'bg-indigo-100 text-indigo-700'
          }`}>
            <Clock className="w-5 h-5" />
            <span className="font-mono font-bold">{formatTime(timeLeft)}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-500">Question {currentQuestion + 1} of {quiz.questions.length}</span>
            <span className="text-indigo-600">{Math.round(((currentQuestion + 1) / quiz.questions.length) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-indigo-600 h-2 rounded-full transition-all"
              style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">{currentQ.question}</h2>

          <div className="space-y-3">
            {currentQ.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleSelectAnswer(index)}
                className={`w-full text-left p-4 rounded-lg border-2 transition ${
                  selectedAnswers[currentQuestion] === index
                    ? 'border-indigo-600 bg-indigo-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center">
                  <span className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                    selectedAnswers[currentQuestion] === index
                      ? 'bg-indigo-600 text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </span>
                  <span className="text-gray-900">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
              disabled={currentQuestion === 0}
              className="px-6 py-3 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            {currentQuestion === quiz.questions.length - 1 ? (
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center"
              >
                Submit Test
                <CheckCircle className="w-5 h-5 ml-2" />
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestion(prev => Math.min(quiz.questions.length - 1, prev + 1))}
                className="bg-indigo-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center"
              >
                Next
                <ArrowRight className="w-5 h-5 ml-2" />
              </button>
            )}
          </div>
        </div>

        {/* Question Navigator */}
        <div className="bg-white rounded-xl shadow-md p-4 mt-6">
          <p className="text-sm text-gray-500 mb-3">Question Navigator</p>
          <div className="flex flex-wrap gap-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-10 h-10 rounded-lg font-semibold transition ${
                  currentQuestion === index
                    ? 'bg-indigo-600 text-white'
                    : selectedAnswers[index] !== undefined
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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

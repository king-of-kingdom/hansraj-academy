import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { BookOpen, Play, Award, Share2, Copy, Calendar, MessageCircle, TrendingUp, Brain } from 'lucide-react';
import { useApp } from '../context/AppContext';
import toast from 'react-hot-toast';

export function StudentDashboard() {
  const { user, courses, certificates, liveClasses, quizzes } = useApp();
  const [activeTab, setActiveTab] = useState('courses');

  if (!user) {
    return <Navigate to="/login" />;
  }

  const enrolledCourses = courses.filter(c => 
    user.enrolledCourses.some(e => e.courseId === c.id)
  );

  const userCertificates = certificates.filter(c => c.userId === user.id);
  // Free trial removed - users get first 2-3 videos free instead

  const copyReferralCode = () => {
    navigator.clipboard.writeText(user.referralCode);
    toast.success('Referral code copied!');
  };

  const tabs = [
    { id: 'courses', label: 'My Courses', icon: BookOpen },
    { id: 'dailyquiz', label: 'Daily Quiz', icon: Brain },
    { id: 'certificates', label: 'Certificates', icon: Award },
    { id: 'live', label: 'Live Classes', icon: Calendar },
    { id: 'referral', label: 'Refer & Earn', icon: Share2 },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 md:p-8 text-white mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Welcome, {user.name}! 👋</h1>
              <p className="text-white/80 mt-1">{user.email}</p>
              
              {/* Free trial feature removed */}
            </div>
            
            <div className="mt-4 md:mt-0 flex items-center space-x-4">
              <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{enrolledCourses.length}</p>
                <p className="text-sm text-white/80">Courses</p>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-lg p-4 text-center">
                <p className="text-3xl font-bold">{userCertificates.length}</p>
                <p className="text-sm text-white/80">Certificates</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 overflow-x-auto pb-2 mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-2 rounded-lg whitespace-nowrap transition ${
                activeTab === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-100'
              }`}
            >
              <tab.icon className="w-5 h-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'courses' && (
          <div className="space-y-6">
            {enrolledCourses.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">No courses enrolled yet</h2>
                <p className="text-gray-500 mt-2">Start learning by enrolling in a course</p>
                <Link 
                  to="/courses" 
                  className="inline-block mt-6 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                >
                  Browse Courses
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrolledCourses.map(course => {
                  const enrollment = user.enrolledCourses.find(e => e.courseId === course.id);
                  const isUnlocked = enrollment?.isUnlocked;
                  const progress = enrollment?.progress || 0;
                  const quiz = quizzes.find(q => q.courseId === course.id);

                  return (
                    <div key={course.id} className="bg-white rounded-xl shadow-md overflow-hidden">
                      <div className="relative">
                        <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover" />
                        <div className="absolute top-3 right-3">
                          {isUnlocked ? (
                            <span className="bg-green-500 text-white px-2 py-1 rounded text-xs font-bold">
                              Unlocked
                            </span>
                          ) : (
                            <span className="bg-yellow-500 text-white px-2 py-1 rounded text-xs font-bold">
                              {enrollment?.paymentStatus === 'pending' ? 'Payment Pending' : 'Locked'}
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="p-4">
                        <h3 className="font-bold text-gray-900">{course.title}</h3>
                        
                        {/* Progress Bar */}
                        <div className="mt-4">
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Progress</span>
                            <span className="text-indigo-600 font-medium">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className="bg-indigo-600 h-2 rounded-full transition-all"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="mt-4 flex space-x-2">
                          {isUnlocked ? (
                            <Link
                              to={`/watch/${course.id}/${course.videos[0]?.id}`}
                              className="flex-1 bg-indigo-600 text-white text-center py-2 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center"
                            >
                              <Play className="w-4 h-4 mr-1" /> Continue
                            </Link>
                          ) : (
                            <span className="flex-1 bg-gray-300 text-gray-500 text-center py-2 rounded-lg cursor-not-allowed">
                              Locked
                            </span>
                          )}
                          
                          {quiz && progress >= 80 && (
                            <Link
                              to={`/quiz/${course.id}`}
                              className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-yellow-600 transition"
                            >
                              <Award className="w-4 h-4" />
                            </Link>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Browse More */}
            <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-xl p-6 text-white text-center">
              <h3 className="text-xl font-bold mb-2">Want to Learn More?</h3>
              <p className="text-white/80 mb-4">Explore our wide range of courses and upskill yourself!</p>
              <Link 
                to="/courses" 
                className="inline-block bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
              >
                Browse All Courses
              </Link>
            </div>
          </div>
        )}

        {activeTab === 'dailyquiz' && (
          <div className="space-y-6">
            {/* Daily Quiz Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-white text-center">
              <Brain className="w-16 h-16 mx-auto mb-4 animate-pulse" />
              <h2 className="text-2xl font-bold mb-2">Daily Quiz Challenge</h2>
              <p className="text-white/80 mb-6">
                Test your knowledge with daily quizzes! New questions every day.
              </p>
              <Link
                to="/daily-quiz"
                className="inline-flex items-center bg-white text-indigo-600 px-8 py-3 rounded-xl font-bold hover:bg-gray-100 transition"
              >
                <Brain className="w-5 h-5 mr-2" />
                Start Today's Quiz
              </Link>
            </div>

            {/* Benefits */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-3">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="font-bold text-gray-900">Track Progress</h3>
                <p className="text-sm text-gray-500 mt-1">See your improvement over time</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                  <TrendingUp className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="font-bold text-gray-900">Build Skills</h3>
                <p className="text-sm text-gray-500 mt-1">Reinforce what you've learned</p>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm">
                <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                  <Brain className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="font-bold text-gray-900">Stay Sharp</h3>
                <p className="text-sm text-gray-500 mt-1">Keep your mind active daily</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'certificates' && (
          <div>
            {userCertificates.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Award className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">No certificates yet</h2>
                <p className="text-gray-500 mt-2">Complete a course and pass the test to earn a certificate</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {userCertificates.map(cert => {
                  const course = courses.find(c => c.id === cert.courseId);
                  return (
                    <div key={cert.id} className="bg-white rounded-xl shadow-md p-6 border-2 border-yellow-400">
                      <div className="text-center">
                        <Award className="w-16 h-16 text-yellow-500 mx-auto" />
                        <h3 className="text-xl font-bold text-gray-900 mt-4">Certificate of Completion</h3>
                        <p className="text-indigo-600 font-medium mt-2">{course?.title}</p>
                        <p className="text-gray-500 mt-2">Score: {cert.score}%</p>
                        <p className="text-sm text-gray-400 mt-1">
                          Issued: {new Date(cert.issuedAt).toLocaleDateString()}
                        </p>
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <p className="text-xs text-gray-500">Certificate ID</p>
                          <p className="font-mono text-sm">{cert.id}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'live' && (
          <div>
            {liveClasses.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center">
                <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h2 className="text-xl font-semibold text-gray-700">No live classes scheduled</h2>
                <p className="text-gray-500 mt-2">Check back later for upcoming live sessions</p>
              </div>
            ) : (
              <div className="space-y-4">
                {liveClasses.map(liveClass => {
                  const course = courses.find(c => c.id === liveClass.courseId);
                  const isUpcoming = new Date(liveClass.scheduledAt) > new Date();
                  
                  return (
                    <div key={liveClass.id} className="bg-white rounded-xl shadow-md p-6 flex items-center justify-between">
                      <div>
                        <span className={`text-xs font-bold px-2 py-1 rounded ${isUpcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                          {isUpcoming ? 'Upcoming' : 'Completed'}
                        </span>
                        <h3 className="text-lg font-bold text-gray-900 mt-2">{liveClass.title}</h3>
                        <p className="text-gray-500">{course?.title}</p>
                        <p className="text-sm text-gray-400 mt-1">
                          {new Date(liveClass.scheduledAt).toLocaleString()}
                        </p>
                      </div>
                      
                      {isUpcoming && (
                        <a 
                          href={liveClass.meetLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-red-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
                        >
                          Join Now
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'referral' && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-8 text-center">
              <Share2 className="w-16 h-16 text-indigo-600 mx-auto" />
              <h2 className="text-2xl font-bold text-gray-900 mt-4">Refer & Earn</h2>
              <p className="text-gray-600 mt-2">
                Share your referral code with friends. When they enroll, you both get benefits!
              </p>

              <div className="mt-8 bg-indigo-50 rounded-xl p-6">
                <p className="text-sm text-gray-500 mb-2">Your Referral Code</p>
                <div className="flex items-center justify-center space-x-3">
                  <span className="text-3xl font-bold text-indigo-600 font-mono">{user.referralCode}</span>
                  <button
                    onClick={copyReferralCode}
                    className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    <Copy className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <TrendingUp className="w-8 h-8 text-indigo-600 mx-auto" />
                  <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
                  <p className="text-sm text-gray-500">Referrals</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <MessageCircle className="w-8 h-8 text-green-600 mx-auto" />
                  <p className="text-2xl font-bold text-gray-900 mt-2">0</p>
                  <p className="text-sm text-gray-500">Enrolled</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4">
                  <Award className="w-8 h-8 text-yellow-500 mx-auto" />
                  <p className="text-2xl font-bold text-gray-900 mt-2">₹0</p>
                  <p className="text-sm text-gray-500">Earned</p>
                </div>
              </div>

              <div className="mt-8">
                <p className="text-sm text-gray-500">Share on</p>
                <div className="flex justify-center space-x-4 mt-3">
                  <a
                    href={`https://wa.me/?text=Join Hansraj Academy and learn with me! Use my referral code: ${user.referralCode} https://hansrajacademy.com`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition"
                  >
                    WhatsApp
                  </a>
                  <button
                    onClick={copyReferralCode}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Copy Link
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

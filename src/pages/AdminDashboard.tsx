import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { 
  LayoutDashboard, BookOpen, Users, CreditCard, Settings, Plus, 
  Edit, Trash2, CheckCircle, XCircle, Video, Calendar,
  DollarSign, Eye, Search, MoreVertical,
  Bell, ChevronRight, Download, RefreshCw, BarChart3, Clock,
  Sparkles, Award, Zap, ArrowUpRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Course, Video as VideoType, LiveClass } from '../types';
import toast from 'react-hot-toast';

export function AdminDashboard() {
  const { 
    user, isAdmin, courses, addCourse, updateCourse, deleteCourse,
    paymentRequests, verifyPayment, rejectPayment,
    settings, updateSettings,
    liveClasses, addLiveClass, deleteLiveClass,
    allUsers, certificates
  } = useApp();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  if (!user || !isAdmin) {
    return <Navigate to="/login" />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'courses', label: 'Courses', icon: BookOpen },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'dailyquiz', label: 'Daily Quiz', icon: Award },
    { id: 'students', label: 'Students', icon: Users },
    { id: 'live', label: 'Live Classes', icon: Calendar },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const pendingPayments = paymentRequests.filter(p => p.status === 'pending');
  const verifiedPayments = paymentRequests.filter(p => p.status === 'verified');
  const totalRevenue = verifiedPayments.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalEnrollments = allUsers.reduce((sum, u) => sum + u.enrolledCourses.filter(e => e.isUnlocked).length, 0);

  // Calculate growth (mock data for demo)
  const revenueGrowth = 23.5;
  const userGrowth = 15.2;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden lg:flex flex-col w-72 admin-sidebar min-h-screen p-6 fixed left-0 top-0">
          {/* Logo */}
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              <p className="text-indigo-300 text-sm">Hansraj Academy</p>
            </div>
          </div>
          
          {/* Navigation */}
          <nav className="space-y-2 flex-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-white/20 text-white shadow-lg'
                    : 'text-indigo-300 hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
                {tab.id === 'payments' && pendingPayments.length > 0 && (
                  <span className="ml-auto bg-red-500 text-white text-xs rounded-full px-2 py-0.5 animate-pulse">
                    {pendingPayments.length}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* User Info */}
          <div className="mt-auto pt-6 border-t border-white/10">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">A</span>
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{user.name}</p>
                <p className="text-indigo-300 text-sm">Administrator</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Tabs */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50 shadow-lg">
          <div className="flex">
            {tabs.slice(0, 5).map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-center relative ${
                  activeTab === tab.id ? 'text-indigo-600' : 'text-gray-500'
                }`}
              >
                <tab.icon className="w-5 h-5 mx-auto" />
                <span className="text-xs mt-1 block">{tab.label}</span>
                {tab.id === 'payments' && pendingPayments.length > 0 && (
                  <span className="absolute top-1 right-1/4 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {pendingPayments.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 lg:ml-72 p-4 lg:p-8 pb-24 lg:pb-8 mt-16 lg:mt-0">
          {/* Header */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-8 gap-4">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                {tabs.find(t => t.id === activeTab)?.label}
              </h1>
              <p className="text-gray-500 mt-1">
                Welcome back, {user.name}! Here's what's happening.
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              <button className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {pendingPayments.length > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-white text-xs flex items-center justify-center">
                    {pendingPayments.length}
                  </span>
                )}
              </button>
              <button className="p-2 bg-white rounded-xl shadow-sm hover:shadow-md transition">
                <RefreshCw className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          </div>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/20">
                      <DollarSign className="w-6 h-6 text-white" />
                    </div>
                    <span className="flex items-center text-green-600 text-sm font-medium">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      {revenueGrowth}%
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">Total Revenue</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">₹{totalRevenue.toLocaleString()}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <span className="flex items-center text-green-600 text-sm font-medium">
                      <ArrowUpRight className="w-4 h-4 mr-1" />
                      {userGrowth}%
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">Total Students</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{allUsers.length}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
                      <BookOpen className="w-6 h-6 text-white" />
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm">Total Courses</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{courses.length}</p>
                </div>
                
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-500/20">
                      <CreditCard className="w-6 h-6 text-white" />
                    </div>
                    {pendingPayments.length > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full animate-pulse">
                        Action Needed
                      </span>
                    )}
                  </div>
                  <p className="text-gray-500 text-sm">Pending Payments</p>
                  <p className="text-2xl lg:text-3xl font-bold text-gray-900 mt-1">{pendingPayments.length}</p>
                </div>
              </div>

              {/* Quick Stats Cards */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Total Enrollments</h3>
                    <BarChart3 className="w-5 h-5 text-white/60" />
                  </div>
                  <p className="text-4xl font-bold">{totalEnrollments}</p>
                  <p className="text-indigo-200 text-sm mt-2">Across all courses</p>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Certificates Issued</h3>
                    <Award className="w-5 h-5 text-white/60" />
                  </div>
                  <p className="text-4xl font-bold">{certificates.length}</p>
                  <p className="text-green-200 text-sm mt-2">Students certified</p>
                </div>

                <div className="bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl p-6 text-white">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold">Live Classes</h3>
                    <Calendar className="w-5 h-5 text-white/60" />
                  </div>
                  <p className="text-4xl font-bold">{liveClasses.length}</p>
                  <p className="text-orange-200 text-sm mt-2">Scheduled sessions</p>
                </div>
              </div>

              {/* Recent Activity */}
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Recent Payments */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Recent Payments</h2>
                    <button 
                      onClick={() => setActiveTab('payments')}
                      className="text-indigo-600 text-sm font-medium hover:underline flex items-center"
                    >
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {paymentRequests.slice(0, 5).map(payment => (
                      <div key={payment.id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{payment.userName.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{payment.userName}</p>
                            <p className="text-sm text-gray-500">{payment.userPhone}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-gray-900">₹{payment.totalAmount}</p>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            payment.status === 'verified' ? 'bg-green-100 text-green-700' :
                            payment.status === 'rejected' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Students */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                    <h2 className="text-lg font-bold text-gray-900">Recent Students</h2>
                    <button 
                      onClick={() => setActiveTab('students')}
                      className="text-indigo-600 text-sm font-medium hover:underline flex items-center"
                    >
                      View All <ChevronRight className="w-4 h-4 ml-1" />
                    </button>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {allUsers.slice(0, 5).map(student => (
                      <div key={student.id} className="p-4 hover:bg-gray-50 transition flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-400 rounded-full flex items-center justify-center">
                            <span className="text-white font-semibold text-sm">{student.name.charAt(0)}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{student.name}</p>
                            <p className="text-sm text-gray-500">{student.email}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium">
                            {student.enrolledCourses.length} courses
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Courses Tab */}
          {activeTab === 'courses' && (
            <div>
              {/* Header */}
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search courses..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-12 pr-4 py-3 bg-white rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
                  />
                </div>
                <button
                  onClick={() => { setEditingCourse(null); setShowCourseForm(true); }}
                  className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:-translate-y-0.5"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add Course
                </button>
              </div>

              {showCourseForm && (
                <CourseForm 
                  course={editingCourse}
                  onSave={(course) => {
                    if (editingCourse) {
                      updateCourse(course);
                      toast.success('Course updated successfully!');
                    } else {
                      addCourse(course);
                      toast.success('Course added successfully!');
                    }
                    setShowCourseForm(false);
                    setEditingCourse(null);
                  }}
                  onCancel={() => { setShowCourseForm(false); setEditingCourse(null); }}
                />
              )}

              {/* Course Grid */}
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {courses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).map(course => (
                  <div key={course.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 group">
                    <div className="relative">
                      <img src={course.thumbnail} alt={course.title} className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-300" />
                      <div className="absolute top-3 left-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          course.isPublished ? 'bg-green-500 text-white' : 'bg-gray-500 text-white'
                        }`}>
                          {course.isPublished ? 'Published' : 'Draft'}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <button className="p-2 bg-white/90 rounded-lg shadow-sm hover:bg-white transition">
                          <MoreVertical className="w-4 h-4 text-gray-600" />
                        </button>
                      </div>
                    </div>
                    
                    <div className="p-5">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-2 py-1 rounded-full">{course.category}</span>
                        <span className="text-lg font-bold text-gray-900">₹{course.price}</span>
                      </div>
                      <h3 className="font-bold text-gray-900 line-clamp-1">{course.title}</h3>
                      <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
                      
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Video className="w-4 h-4 mr-1" />
                            {course.videos.length}
                          </span>
                          <span className="flex items-center">
                            <Clock className="w-4 h-4 mr-1" />
                            {course.duration}
                          </span>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => { setEditingCourse(course); setShowCourseForm(true); }}
                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => { deleteCourse(course.id); toast.success('Course deleted'); }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Payments Tab */}
          {activeTab === 'payments' && (
            <div>
              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                  <p className="text-yellow-800 font-semibold">Pending</p>
                  <p className="text-2xl font-bold text-yellow-900">{pendingPayments.length}</p>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                  <p className="text-green-800 font-semibold">Verified</p>
                  <p className="text-2xl font-bold text-green-900">{verifiedPayments.length}</p>
                </div>
                <div className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
                  <p className="text-indigo-800 font-semibold">Total Revenue</p>
                  <p className="text-2xl font-bold text-indigo-900">₹{totalRevenue.toLocaleString()}</p>
                </div>
              </div>

              {/* Payments List */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {paymentRequests.length === 0 ? (
                  <div className="p-12 text-center">
                    <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500 text-lg">No payment requests yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {paymentRequests.map(payment => (
                      <div key={payment.id} className="p-6 hover:bg-gray-50 transition">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                          <div className="flex items-start space-x-4">
                            <div className="w-12 h-12 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-xl flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold">{payment.userName.charAt(0)}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900">{payment.userName}</h3>
                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  payment.status === 'verified' ? 'bg-green-100 text-green-700' :
                                  payment.status === 'rejected' ? 'bg-red-100 text-red-700' :
                                  'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {payment.status}
                                </span>
                              </div>
                              <p className="text-sm text-gray-500 mt-1">{payment.userEmail} • {payment.userPhone}</p>
                              <p className="text-sm text-gray-500">
                                Courses: {payment.courseIds.map(id => courses.find(c => c.id === id)?.title).join(', ')}
                              </p>
                              <div className="flex items-center space-x-4 mt-2 text-sm">
                                <span className="text-gray-500">
                                  Transaction ID: <span className="font-mono text-gray-700">{payment.transactionId}</span>
                                </span>
                                <span className="text-gray-400">
                                  {new Date(payment.createdAt).toLocaleString()}
                                </span>
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <div className="text-right">
                              <p className="text-2xl font-bold text-gray-900">₹{payment.totalAmount}</p>
                              {payment.discountApplied > 0 && (
                                <p className="text-sm text-green-600">Saved ₹{payment.discountApplied}</p>
                              )}
                            </div>
                            
                            {payment.status === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => { verifyPayment(payment.id); toast.success('Payment verified! Course unlocked.'); }}
                                  className="flex items-center bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-green-500/30 transition"
                                >
                                  <CheckCircle className="w-4 h-4 mr-2" /> Verify
                                </button>
                                <button
                                  onClick={() => { rejectPayment(payment.id); toast.error('Payment rejected'); }}
                                  className="flex items-center bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-xl font-semibold hover:shadow-lg hover:shadow-red-500/30 transition"
                                >
                                  <XCircle className="w-4 h-4 mr-2" /> Reject
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Students Tab */}
          {activeTab === 'students' && (
            <div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-bold text-gray-900">All Students ({allUsers.length})</h2>
                  <button className="flex items-center text-indigo-600 hover:text-indigo-700 font-medium">
                    <Download className="w-4 h-4 mr-2" /> Export CSV
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Student</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Contact</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Courses</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Joined</th>
                        <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {allUsers.map(student => (
                        <tr key={student.id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full flex items-center justify-center">
                                <span className="text-white font-semibold">{student.name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{student.name}</p>
                                <p className="text-sm text-gray-500">{student.email}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">{student.phone}</td>
                          <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                              <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-sm font-medium">
                                {student.enrolledCourses.length} enrolled
                              </span>
                              <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                                {student.enrolledCourses.filter(e => e.isUnlocked).length} active
                              </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(student.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            <button className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
                              <Eye className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* Live Classes Tab */}
          {activeTab === 'live' && (
            <LiveClassesTab 
              liveClasses={liveClasses}
              courses={courses}
              onAdd={addLiveClass}
              onDelete={deleteLiveClass}
            />
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <SettingsTab settings={settings} onUpdate={updateSettings} />
          )}

          {/* Daily Quiz Tab */}
          {activeTab === 'dailyquiz' && (
            <DailyQuizTab />
          )}
        </div>
      </div>
    </div>
  );
}

// Course Form Component
function CourseForm({ 
  course, 
  onSave, 
  onCancel 
}: { 
  course: Course | null; 
  onSave: (course: Course) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState<Course>(course || {
    id: `course-${Date.now()}`,
    title: '',
    description: '',
    instructor: 'Amit Sir',
    price: 499,
    originalPrice: 999,
    thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop',
    category: 'MS Office',
    language: 'Hindi',
    level: 'Beginner',
    duration: '10+ Hours',
    isPublished: true,
    createdAt: new Date().toISOString(),
    videos: []
  });

  const [newVideo, setNewVideo] = useState<Partial<VideoType>>({
    title: '',
    youtubeUrl: '',
    duration: '',
    isFree: false
  });

  const addVideo = () => {
    if (newVideo.title && newVideo.youtubeUrl) {
      const video: VideoType = {
        id: `v-${Date.now()}`,
        title: newVideo.title,
        youtubeUrl: newVideo.youtubeUrl,
        duration: newVideo.duration || '10:00',
        isFree: newVideo.isFree || false,
        order: formData.videos.length + 1
      };
      setFormData({ ...formData, videos: [...formData.videos, video] });
      setNewVideo({ title: '', youtubeUrl: '', duration: '', isFree: false });
    }
  };

  const removeVideo = (videoId: string) => {
    setFormData({ ...formData, videos: formData.videos.filter(v => v.id !== videoId) });
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 animate-scale-in">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
          {course ? 'Edit Course' : 'Add New Course'}
        </h2>
        <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-lg transition">
          <XCircle className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Course Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            placeholder="Enter course title"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
          >
            <option>MS Office</option>
            <option>Programming</option>
            <option>Graphics</option>
            <option>Web Development</option>
            <option>Hardware</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹)</label>
          <input
            type="number"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Original Price (₹)</label>
          <input
            type="number"
            value={formData.originalPrice}
            onChange={(e) => setFormData({ ...formData, originalPrice: Number(e.target.value) })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Thumbnail URL</label>
          <input
            type="url"
            value={formData.thumbnail}
            onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
          <input
            type="text"
            value={formData.duration}
            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
            placeholder="e.g., 10+ Hours"
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
          />
        </div>
        
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition"
            placeholder="Enter course description"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="published"
            checked={formData.isPublished}
            onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
            className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="published" className="text-sm font-medium text-gray-700">Published</label>
        </div>
      </div>

      {/* Videos Section */}
      <div className="border-t border-gray-100 pt-6">
        <h3 className="font-bold text-gray-900 mb-4 flex items-center">
          <Video className="w-5 h-5 mr-2 text-indigo-600" /> 
          Videos ({formData.videos.length})
        </h3>
        
        <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
          {formData.videos.map((video, index) => (
            <div key={video.id} className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl">
              <span className="w-8 h-8 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="font-medium text-gray-900">{video.title}</p>
                <p className="text-sm text-gray-500">{video.duration}</p>
              </div>
              {video.isFree && (
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium">FREE</span>
              )}
              <button onClick={() => removeVideo(video.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-5 gap-3 items-end bg-gray-50 p-4 rounded-xl">
          <div>
            <label className="block text-xs text-gray-500 mb-1">Video Title</label>
            <input
              type="text"
              value={newVideo.title}
              onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
              placeholder="Title"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs text-gray-500 mb-1">YouTube Embed URL</label>
            <input
              type="url"
              value={newVideo.youtubeUrl}
              onChange={(e) => setNewVideo({ ...newVideo, youtubeUrl: e.target.value })}
              placeholder="https://youtube.com/embed/..."
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs text-gray-500 mb-1">Duration</label>
            <input
              type="text"
              value={newVideo.duration}
              onChange={(e) => setNewVideo({ ...newVideo, duration: e.target.value })}
              placeholder="15:00"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm"
            />
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center text-sm">
              <input
                type="checkbox"
                checked={newVideo.isFree}
                onChange={(e) => setNewVideo({ ...newVideo, isFree: e.target.checked })}
                className="mr-2 rounded"
              />
              Free
            </label>
            <button 
              onClick={addVideo} 
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 mt-6 pt-6 border-t border-gray-100">
        <button onClick={onCancel} className="px-6 py-2.5 text-gray-600 hover:text-gray-900 font-medium">
          Cancel
        </button>
        <button 
          onClick={() => onSave(formData)}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition"
        >
          Save Course
        </button>
      </div>
    </div>
  );
}

// Live Classes Tab
function LiveClassesTab({ 
  liveClasses, 
  courses, 
  onAdd, 
  onDelete 
}: { 
  liveClasses: LiveClass[];
  courses: Course[];
  onAdd: (liveClass: LiveClass) => void;
  onDelete: (id: string) => void;
}) {
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    courseId: courses[0]?.id || '',
    scheduledAt: '',
    meetLink: '',
    description: ''
  });

  const handleSubmit = () => {
    const newClass: LiveClass = {
      id: `live-${Date.now()}`,
      ...formData
    };
    onAdd(newClass);
    setShowForm(false);
    setFormData({ title: '', courseId: courses[0]?.id || '', scheduledAt: '', meetLink: '', description: '' });
    toast.success('Live class scheduled!');
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Live Classes</h2>
          <p className="text-gray-500 text-sm">Schedule and manage live sessions</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition"
        >
          <Plus className="w-5 h-5 mr-2" /> Schedule Class
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6 border border-gray-100 animate-scale-in">
          <h2 className="text-lg font-bold mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-indigo-600" />
            Schedule New Live Class
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                placeholder="Class title"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              >
                {courses.map(c => (
                  <option key={c.id} value={c.id}>{c.title}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date & Time</label>
              <input
                type="datetime-local"
                value={formData.scheduledAt}
                onChange={(e) => setFormData({ ...formData, scheduledAt: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meeting Link</label>
              <input
                type="url"
                value={formData.meetLink}
                onChange={(e) => setFormData({ ...formData, meetLink: e.target.value })}
                placeholder="Google Meet / Zoom link"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl"
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-gray-600">Cancel</button>
            <button onClick={handleSubmit} className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-medium">Schedule</button>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {liveClasses.map(liveClass => {
          const course = courses.find(c => c.id === liveClass.courseId);
          const isUpcoming = new Date(liveClass.scheduledAt) > new Date();
          
          return (
            <div key={liveClass.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-lg transition">
              <div className="flex items-center justify-between mb-4">
                <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                  isUpcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                }`}>
                  {isUpcoming ? 'Upcoming' : 'Completed'}
                </span>
                <button onClick={() => onDelete(liveClass.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-bold text-gray-900">{liveClass.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{course?.title}</p>
              <div className="flex items-center text-sm text-gray-400 mt-3">
                <Clock className="w-4 h-4 mr-2" />
                {new Date(liveClass.scheduledAt).toLocaleString()}
              </div>
              {isUpcoming && (
                <a 
                  href={liveClass.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 w-full bg-gradient-to-r from-red-500 to-pink-500 text-white py-2 rounded-xl font-medium text-center block hover:shadow-lg transition"
                >
                  Start Meeting
                </a>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Daily Quiz Tab
function DailyQuizTab() {
  const [quizzes, setQuizzes] = useState<{
    id: string;
    title: string;
    date: string;
    questions: { id: string; question: string; options: string[]; correctAnswer: number }[];
    isActive: boolean;
  }[]>(() => {
    const saved = localStorage.getItem('adminDailyQuizzes');
    return saved ? JSON.parse(saved) : [];
  });

  const [responses] = useState<{
    id: string;
    quizId: string;
    quizTitle: string;
    userName: string;
    userEmail: string;
    userPhone: string;
    score: number;
    totalQuestions: number;
    correctAnswers: number;
    submittedAt: string;
    answers: { questionText: string; isCorrect: boolean }[];
  }[]>(() => {
    const saved = localStorage.getItem('dailyQuizResponses');
    return saved ? JSON.parse(saved) : [];
  });

  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedResponse, setSelectedResponse] = useState<typeof responses[0] | null>(null);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    date: new Date().toISOString().split('T')[0],
    questions: [
      { id: 'nq-1', question: '', options: ['', '', '', ''], correctAnswer: 0 }
    ]
  });

  const saveQuizzes = (updatedQuizzes: typeof quizzes) => {
    setQuizzes(updatedQuizzes);
    localStorage.setItem('adminDailyQuizzes', JSON.stringify(updatedQuizzes));
  };

  const handleAddQuestion = () => {
    setNewQuiz(prev => ({
      ...prev,
      questions: [
        ...prev.questions,
        { id: `nq-${Date.now()}`, question: '', options: ['', '', '', ''], correctAnswer: 0 }
      ]
    }));
  };

  const handleRemoveQuestion = (index: number) => {
    if (newQuiz.questions.length > 1) {
      setNewQuiz(prev => ({
        ...prev,
        questions: prev.questions.filter((_, i) => i !== index)
      }));
    }
  };

  const handleSaveQuiz = () => {
    if (!newQuiz.title.trim() || newQuiz.questions.some(q => !q.question.trim() || q.options.some(o => !o.trim()))) {
      toast.error('Please fill all fields');
      return;
    }

    const quiz = {
      id: `quiz-${Date.now()}`,
      ...newQuiz,
      isActive: true
    };

    saveQuizzes([quiz, ...quizzes]);
    setShowAddForm(false);
    setNewQuiz({
      title: '',
      date: new Date().toISOString().split('T')[0],
      questions: [{ id: 'nq-1', question: '', options: ['', '', '', ''], correctAnswer: 0 }]
    });
    toast.success('Daily Quiz added successfully!');
  };

  const handleDeleteQuiz = (quizId: string) => {
    saveQuizzes(quizzes.filter(q => q.id !== quizId));
    toast.success('Quiz deleted');
  };

  const handleToggleActive = (quizId: string) => {
    saveQuizzes(quizzes.map(q => 
      q.id === quizId ? { ...q, isActive: !q.isActive } : q
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Daily Quiz Management</h2>
          <p className="text-gray-500">Create daily quizzes and view student responses</p>
        </div>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Daily Quiz
        </button>
      </div>

      {/* Add Quiz Form */}
      {showAddForm && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 animate-scale-in">
          <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
            <Sparkles className="w-5 h-5 mr-2 text-indigo-600" />
            Create New Daily Quiz
          </h3>

          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Quiz Title</label>
              <input
                type="text"
                value={newQuiz.title}
                onChange={(e) => setNewQuiz(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Today's Knowledge Test"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={newQuiz.date}
                onChange={(e) => setNewQuiz(prev => ({ ...prev, date: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {newQuiz.questions.map((question, qIndex) => (
              <div key={question.id} className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="font-semibold text-gray-700">Question {qIndex + 1}</span>
                  {newQuiz.questions.length > 1 && (
                    <button
                      onClick={() => handleRemoveQuestion(qIndex)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                
                <input
                  type="text"
                  value={question.question}
                  onChange={(e) => {
                    const updated = [...newQuiz.questions];
                    updated[qIndex].question = e.target.value;
                    setNewQuiz(prev => ({ ...prev, questions: updated }));
                  }}
                  placeholder="Enter question"
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg mb-3"
                />

                <div className="grid grid-cols-2 gap-2">
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name={`correct-${question.id}`}
                        checked={question.correctAnswer === oIndex}
                        onChange={() => {
                          const updated = [...newQuiz.questions];
                          updated[qIndex].correctAnswer = oIndex;
                          setNewQuiz(prev => ({ ...prev, questions: updated }));
                        }}
                        className="w-4 h-4"
                      />
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const updated = [...newQuiz.questions];
                          updated[qIndex].options[oIndex] = e.target.value;
                          setNewQuiz(prev => ({ ...prev, questions: updated }));
                        }}
                        placeholder={`Option ${oIndex + 1}`}
                        className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm"
                      />
                    </div>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">* Select the radio button for correct answer</p>
              </div>
            ))}
          </div>

          <div className="flex justify-between mt-4 pt-4 border-t">
            <button
              onClick={handleAddQuestion}
              className="flex items-center text-indigo-600 font-semibold hover:text-indigo-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Question
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-6 py-2 text-gray-600 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveQuiz}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition"
              >
                Save Quiz
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
          <p className="text-indigo-600 font-semibold">Total Quizzes</p>
          <p className="text-2xl font-bold text-indigo-900">{quizzes.length}</p>
        </div>
        <div className="bg-green-50 border border-green-100 rounded-xl p-4">
          <p className="text-green-600 font-semibold">Active</p>
          <p className="text-2xl font-bold text-green-900">{quizzes.filter(q => q.isActive).length}</p>
        </div>
        <div className="bg-purple-50 border border-purple-100 rounded-xl p-4">
          <p className="text-purple-600 font-semibold">Total Responses</p>
          <p className="text-2xl font-bold text-purple-900">{responses.length}</p>
        </div>
        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4">
          <p className="text-orange-600 font-semibold">Avg Score</p>
          <p className="text-2xl font-bold text-orange-900">
            {responses.length > 0 
              ? Math.round(responses.reduce((sum, r) => sum + r.score, 0) / responses.length)
              : 0}%
          </p>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Quizzes List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <h3 className="font-bold text-gray-900">All Quizzes</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {quizzes.length === 0 ? (
              <div className="p-8 text-center">
                <Award className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No quizzes created yet</p>
              </div>
            ) : (
              quizzes.map(quiz => (
                <div key={quiz.id} className="p-4 hover:bg-gray-50 transition">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-gray-900">{quiz.title}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(quiz.date).toLocaleDateString()} • {quiz.questions.length} Questions
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleActive(quiz.id)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          quiz.isActive 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-500'
                        }`}
                      >
                        {quiz.isActive ? 'Active' : 'Inactive'}
                      </button>
                      <button
                        onClick={() => handleDeleteQuiz(quiz.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Student Responses - Like Payment Messages */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h3 className="font-bold text-gray-900">Student Responses</h3>
          </div>
          <div className="divide-y divide-gray-100 max-h-96 overflow-y-auto">
            {responses.length === 0 ? (
              <div className="p-8 text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No responses yet</p>
              </div>
            ) : (
              responses.map(response => (
                <div 
                  key={response.id} 
                  className="p-4 hover:bg-gray-50 transition cursor-pointer"
                  onClick={() => setSelectedResponse(response)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        response.score >= 70 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                          : 'bg-gradient-to-r from-orange-400 to-red-500'
                      }`}>
                        <span className="text-white font-bold text-sm">
                          {response.userName.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{response.userName}</p>
                        <p className="text-sm text-gray-500">{response.userEmail}</p>
                        {response.userPhone && (
                          <p className="text-xs text-gray-400">{response.userPhone}</p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`text-xl font-bold ${
                        response.score >= 70 ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {response.score}%
                      </p>
                      <p className="text-xs text-gray-500">
                        {response.correctAnswers}/{response.totalQuestions} correct
                      </p>
                      <p className="text-xs text-gray-400">
                        {new Date(response.submittedAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Response Detail Modal */}
      {selectedResponse && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Response Details</h3>
                <button
                  onClick={() => setSelectedResponse(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <XCircle className="w-5 h-5 text-gray-500" />
                </button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center ${
                  selectedResponse.score >= 70 
                    ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                    : 'bg-gradient-to-r from-orange-400 to-red-500'
                }`}>
                  <span className="text-white font-bold text-xl">
                    {selectedResponse.userName.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-xl font-bold text-gray-900">{selectedResponse.userName}</p>
                  <p className="text-gray-500">{selectedResponse.userEmail}</p>
                  {selectedResponse.userPhone && (
                    <p className="text-sm text-gray-400">{selectedResponse.userPhone}</p>
                  )}
                </div>
              </div>

              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-4 mb-6">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p className="text-2xl font-bold text-indigo-600">{selectedResponse.score}%</p>
                    <p className="text-sm text-gray-500">Score</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-green-600">{selectedResponse.correctAnswers}</p>
                    <p className="text-sm text-gray-500">Correct</p>
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-red-600">{selectedResponse.totalQuestions - selectedResponse.correctAnswers}</p>
                    <p className="text-sm text-gray-500">Wrong</p>
                  </div>
                </div>
              </div>

              <h4 className="font-bold text-gray-900 mb-3">Answer Details:</h4>
              <div className="space-y-2">
                {selectedResponse.answers.map((answer, idx) => (
                  <div 
                    key={idx}
                    className={`p-3 rounded-lg flex items-center gap-3 ${
                      answer.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                    }`}
                  >
                    {answer.isCorrect ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    <span className="text-sm text-gray-700">Q{idx + 1}: {answer.questionText}</span>
                  </div>
                ))}
              </div>

              <p className="text-sm text-gray-400 mt-4 text-center">
                Submitted: {new Date(selectedResponse.submittedAt).toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Settings Tab
function SettingsTab({ 
  settings, 
  onUpdate 
}: { 
  settings: ReturnType<typeof useApp>['settings'];
  onUpdate: (settings: ReturnType<typeof useApp>['settings']) => void;
}) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    onUpdate(localSettings);
    toast.success('Settings saved successfully!');
  };

  return (
    <div className="space-y-6">
      {/* Payment Settings */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <CreditCard className="w-5 h-5 mr-2 text-indigo-600" />
          Payment Settings
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">UPI ID</label>
            <input
              type="text"
              value={localSettings.upiId}
              onChange={(e) => setLocalSettings({ ...localSettings, upiId: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
            <input
              type="text"
              value={localSettings.phoneNumber}
              onChange={(e) => setLocalSettings({ ...localSettings, phoneNumber: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">QR Code Image URL</label>
            <input
              type="url"
              value={localSettings.qrCodeImage}
              onChange={(e) => setLocalSettings({ ...localSettings, qrCodeImage: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
        </div>
      </div>

      {/* Bundle Discounts */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <Zap className="w-5 h-5 mr-2 text-yellow-500" />
          Bundle Discounts
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {localSettings.bundleDiscounts.map((bundle, index) => (
            <div key={bundle.courseCount} className="bg-gray-50 rounded-xl p-4 text-center">
              <label className="block text-sm text-gray-500 mb-2">
                {bundle.courseCount} Course{bundle.courseCount > 1 ? 's' : ''}
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={bundle.discountPercent}
                  onChange={(e) => {
                    const newDiscounts = [...localSettings.bundleDiscounts];
                    newDiscounts[index].discountPercent = Number(e.target.value);
                    setLocalSettings({ ...localSettings, bundleDiscounts: newDiscounts });
                  }}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-center font-bold text-lg"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Festival Discount */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <h2 className="text-lg font-bold text-gray-900 mb-6 flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-orange-500" />
          Festival Discount
        </h2>
        <div className="grid md:grid-cols-4 gap-4">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="festivalEnabled"
              checked={localSettings.festivalDiscount.enabled}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                festivalDiscount: { ...localSettings.festivalDiscount, enabled: e.target.checked }
              })}
              className="w-5 h-5 rounded border-gray-300 text-indigo-600"
            />
            <label htmlFor="festivalEnabled" className="text-sm font-medium text-gray-700">Enable</label>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              value={localSettings.festivalDiscount.name}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                festivalDiscount: { ...localSettings.festivalDiscount, name: e.target.value }
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Discount %</label>
            <input
              type="number"
              value={localSettings.festivalDiscount.percent}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                festivalDiscount: { ...localSettings.festivalDiscount, percent: Number(e.target.value) }
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
            <input
              type="date"
              value={(localSettings.festivalDiscount.endDate || '').split('T')[0]}
              onChange={(e) => setLocalSettings({
                ...localSettings,
                festivalDiscount: { ...localSettings.festivalDiscount, endDate: new Date(e.target.value).toISOString() }
              })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl"
            />
          </div>
        </div>
      </div>

      <button 
        onClick={handleSave} 
        className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transition-all"
      >
        Save All Settings
      </button>
    </div>
  );
}

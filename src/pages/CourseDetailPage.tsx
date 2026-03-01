import { useParams, useNavigate, Link } from 'react-router-dom';
import { Play, Clock, PlayCircle, Lock, CheckCircle, ShoppingCart, Star, Users, Award, MessageCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fallbackCourses } from '../data/fallbackCourses';
import toast from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { Course } from '../types';

export function CourseDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { courses, user, cart, addToCart, discussions, addDiscussion, loading } = useApp();
  const [course, setCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to find course from context
    let foundCourse = courses.find(c => c.id === id || c.id === id?.toString());
    
    // If not found, try fallback courses
    if (!foundCourse) {
      foundCourse = fallbackCourses.find(c => c.id === id || c.id === id?.toString());
    }
    
    if (foundCourse) {
      setCourse(foundCourse);
    }
    
    setIsLoading(false);
  }, [id, courses]);

  if (isLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen flex items-center justify-center flex-col gap-4">
        <p className="text-gray-500 text-xl">Course not found</p>
        <p className="text-gray-400">Course ID: {id}</p>
        <Link to="/courses" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
          Browse All Courses
        </Link>
      </div>
    );
  }

  const isEnrolled = user?.enrolledCourses.some(e => e.courseId === course.id);
  const enrollment = user?.enrolledCourses.find(e => e.courseId === course.id);
  const isUnlocked = enrollment?.isUnlocked || false;
  const isInCart = cart.includes(course.id);
  const courseDiscussions = discussions.filter(d => d.courseId === course.id);
  const discount = Math.round(((course.originalPrice - course.price) / course.originalPrice) * 100);

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    if (isEnrolled) {
      toast.error('You are already enrolled in this course');
      return;
    }
    addToCart(course.id);
    toast.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login first');
      navigate('/login');
      return;
    }
    if (!isInCart) {
      addToCart(course.id);
    }
    navigate('/cart');
  };

  const handlePostDiscussion = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const message = (form.elements.namedItem('message') as HTMLInputElement).value;
    if (message.trim()) {
      addDiscussion(course.id, message);
      form.reset();
      toast.success('Discussion posted!');
    }
  };

  // Free trial removed - only isFree videos are accessible without purchase

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <div className="bg-gradient-to-r from-gray-900 to-indigo-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <span className="text-indigo-400 font-medium">{course.category}</span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mt-2">{course.title}</h1>
              <p className="text-gray-300 mt-4">{course.description}</p>

              <div className="flex flex-wrap items-center gap-4 mt-6">
                <div className="flex items-center text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-current" />
                  ))}
                  <span className="ml-2 text-white">4.8 (500+ ratings)</span>
                </div>
                <span className="text-gray-400">|</span>
                <span className="text-gray-300 flex items-center">
                  <Users className="w-5 h-5 mr-1" /> 1000+ Students
                </span>
              </div>

              <div className="flex flex-wrap gap-4 mt-6">
                <span className="bg-white/10 px-4 py-2 rounded-lg text-white flex items-center">
                  <PlayCircle className="w-5 h-5 mr-2" /> {course.videos.length} Videos
                </span>
                <span className="bg-white/10 px-4 py-2 rounded-lg text-white flex items-center">
                  <Clock className="w-5 h-5 mr-2" /> {course.duration}
                </span>
                <span className="bg-white/10 px-4 py-2 rounded-lg text-white flex items-center">
                  <Award className="w-5 h-5 mr-2" /> Certificate
                </span>
              </div>

              <p className="text-gray-400 mt-6">Instructor: <span className="text-white font-semibold">{course.instructor}</span></p>
              <p className="text-gray-400">Language: <span className="text-white">{course.language}</span> | Level: <span className="text-white">{course.level}</span></p>
            </div>

            {/* Price Card */}
            <div className="bg-white rounded-xl p-6 shadow-xl h-fit">
              <img src={course.thumbnail} alt={course.title} className="w-full h-48 object-cover rounded-lg" />
              
              <div className="mt-6">
                <div className="flex items-center space-x-3">
                  <span className="text-4xl font-bold text-gray-900">₹{course.price}</span>
                  {course.originalPrice > course.price && (
                    <>
                      <span className="text-xl text-gray-400 line-through">₹{course.originalPrice}</span>
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-sm font-bold">
                        {discount}% OFF
                      </span>
                    </>
                  )}
                </div>

                {isEnrolled ? (
                  <div className="mt-6 space-y-3">
                    {isUnlocked ? (
                      <>
                        <div className="bg-green-100 text-green-700 p-3 rounded-lg text-center">
                          <CheckCircle className="w-5 h-5 inline mr-2" />
                          You have full access!
                        </div>
                        <Link
                          to={`/watch/${course.id}/${course.videos[0]?.id}`}
                          className="block w-full bg-indigo-600 text-white text-center py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
                        >
                          <Play className="w-5 h-5 inline mr-2" />
                          Continue Learning
                        </Link>
                      </>
                    ) : (
                      <div className="bg-yellow-100 text-yellow-700 p-3 rounded-lg text-center">
                        <Clock className="w-5 h-5 inline mr-2" />
                        Payment pending verification
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="mt-6 space-y-3">
                    <button
                      onClick={handleBuyNow}
                      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transition"
                    >
                      Buy Now
                    </button>
                    <button
                      onClick={handleAddToCart}
                      disabled={isInCart}
                      className={`w-full border-2 py-3 rounded-lg font-semibold transition flex items-center justify-center ${
                        isInCart 
                          ? 'border-gray-300 text-gray-400 cursor-not-allowed'
                          : 'border-indigo-600 text-indigo-600 hover:bg-indigo-50'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      {isInCart ? 'Added to Cart' : 'Add to Cart'}
                    </button>
                  </div>
                )}

                <div className="mt-6 pt-6 border-t space-y-2 text-sm text-gray-600">
                  <p className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Lifetime Access</p>
                  <p className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Certificate on Completion</p>
                  <p className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> WhatsApp Support</p>
                  <p className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> First 2-3 Videos Free</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Course Content</h2>
            
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              {course.videos.map((video, index) => {
                const canWatch = video.isFree || isUnlocked;
                
                return (
                  <div key={video.id} className="border-b last:border-b-0">
                    <div className="p-4 flex items-center justify-between hover:bg-gray-50">
                      <div className="flex items-center space-x-4">
                        <span className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-semibold">
                          {index + 1}
                        </span>
                        <div>
                          <p className="font-medium text-gray-900">{video.title}</p>
                          <p className="text-sm text-gray-500">{video.duration}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {video.isFree && (
                          <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                            FREE
                          </span>
                        )}
                        
                        {canWatch ? (
                          <Link
                            to={`/watch/${course.id}/${video.id}`}
                            className="p-2 bg-indigo-100 text-indigo-600 rounded-full hover:bg-indigo-200 transition"
                          >
                            <Play className="w-5 h-5" />
                          </Link>
                        ) : (
                          <div className="p-2 bg-gray-100 text-gray-400 rounded-full">
                            <Lock className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Discussion Forum */}
            <div className="mt-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <MessageCircle className="w-6 h-6 mr-2" /> Discussion Forum
              </h2>

              {user && (
                <form onSubmit={handlePostDiscussion} className="mb-6">
                  <textarea
                    name="message"
                    placeholder="Ask a question or share your thoughts..."
                    rows={3}
                    className="w-full p-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition"
                  >
                    Post
                  </button>
                </form>
              )}

              <div className="space-y-4">
                {courseDiscussions.map(disc => (
                  <div key={disc.id} className="bg-white p-4 rounded-lg shadow-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-indigo-600 font-semibold">{disc.userName[0]}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">{disc.userName}</p>
                        <p className="text-xs text-gray-500">{new Date(disc.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <p className="mt-2 text-gray-700">{disc.message}</p>
                    
                    {disc.replies.length > 0 && (
                      <div className="mt-4 ml-8 space-y-3">
                        {disc.replies.map(reply => (
                          <div key={reply.id} className="bg-gray-50 p-3 rounded-lg">
                            <p className="font-medium text-sm">{reply.userName}</p>
                            <p className="text-sm text-gray-700">{reply.message}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {courseDiscussions.length === 0 && (
                  <p className="text-gray-500 text-center py-8">No discussions yet. Be the first to ask!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-md">
              <h3 className="font-bold text-gray-900 mb-4">What you'll learn</h3>
              <ul className="space-y-3">
                {[
                  'Complete understanding of ' + course.title,
                  'Hands-on practical exercises',
                  'Real-world project experience',
                  'Job-ready skills',
                  'Certificate of completion'
                ].map((item, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 text-white">
              <h3 className="font-bold mb-2">🎁 Bundle Discount Available!</h3>
              <p className="text-sm text-white/80">
                Buy more courses together and save up to 60%! Add more courses to your cart.
              </p>
              <Link to="/courses" className="inline-block mt-4 bg-white text-indigo-600 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
                View All Courses
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from 'react-router-dom';
import { 
  Play, Star, Users, Award, BookOpen, ArrowRight, Sparkles, 
  Zap, Trophy, Clock, CheckCircle, TrendingUp, Globe, 
  Heart, Target, Rocket, Gift, ChevronRight, MonitorPlay,
  GraduationCap, Laptop, Medal
} from 'lucide-react';
import { CourseCard } from '../components/CourseCard';
import { useApp } from '../context/AppContext';
import { fallbackCourses } from '../data/fallbackCourses';

export function HomePage() {
  const { courses, settings } = useApp();
  // Use fallback if no courses
  const displayCourses = courses.length > 0 ? courses : fallbackCourses;
  const featuredCourses = displayCourses.slice(0, 6);

  const stats = [
    { icon: Users, value: '10,000+', label: 'Happy Students', color: 'from-blue-500 to-cyan-500' },
    { icon: BookOpen, value: '50+', label: 'Premium Courses', color: 'from-purple-500 to-pink-500' },
    { icon: Award, value: '20+', label: 'Years Experience', color: 'from-orange-500 to-red-500' },
    { icon: Star, value: '4.9', label: 'Average Rating', color: 'from-yellow-500 to-orange-500' },
  ];

  const features = [
    { icon: MonitorPlay, title: 'HD Video Lessons', desc: 'Crystal clear video tutorials', color: 'from-blue-500 to-indigo-500' },
    { icon: GraduationCap, title: 'Expert Teachers', desc: '20+ years teaching experience', color: 'from-purple-500 to-pink-500' },
    { icon: Trophy, title: 'Certificates', desc: 'Industry recognized credentials', color: 'from-yellow-500 to-orange-500' },
    { icon: Laptop, title: 'Lifetime Access', desc: 'Learn at your own pace', color: 'from-green-500 to-emerald-500' },
    { icon: Target, title: 'Practical Skills', desc: 'Job-ready training', color: 'from-red-500 to-pink-500' },
    { icon: Globe, title: 'Learn Anywhere', desc: 'Access on any device', color: 'from-cyan-500 to-blue-500' },
  ];

  const categories = [
    { name: 'MS Office', icon: '📊', courses: 15, color: 'from-green-400 to-emerald-500' },
    { name: 'Design', icon: '🎨', courses: 8, color: 'from-pink-400 to-rose-500' },
    { name: 'Programming', icon: '💻', courses: 12, color: 'from-blue-400 to-indigo-500' },
    { name: 'Hardware', icon: '🔧', courses: 5, color: 'from-orange-400 to-red-500' },
    { name: 'Web Dev', icon: '🌐', courses: 10, color: 'from-purple-400 to-violet-500' },
    { name: 'More', icon: '✨', courses: 20, color: 'from-yellow-400 to-orange-500' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center overflow-hidden gradient-hero-animated">
        {/* Animated Blobs */}
        <div className="absolute top-20 left-10 w-96 h-96 blob blob-purple animate-blob"></div>
        <div className="absolute bottom-20 right-10 w-80 h-80 blob blob-pink animate-blob" style={{ animationDelay: '-5s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-72 h-72 blob blob-cyan animate-blob" style={{ animationDelay: '-10s' }}></div>
        
        {/* Floating Particles */}
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div 
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 10 + 5}px`,
                height: `${Math.random() * 10 + 5}px`,
                animationDuration: `${Math.random() * 10 + 10}s`,
                animationDelay: `${Math.random() * 5}s`,
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-8 animate-slide-down">
                <Sparkles className="w-4 h-4 text-yellow-400 mr-2 animate-pulse" />
                <span className="text-white/90 text-sm font-medium">Welcome to The Future of Learning</span>
              </div>
              
              {/* Main Heading */}
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-black text-white mb-6 leading-tight">
                <span className="block animate-slide-up">Learn Skills That</span>
                <span className="block mt-2 animate-slide-up delay-200">
                  <span className="text-gradient-animated bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">
                    Transform
                  </span>
                  {' '}Your Life
                </span>
              </h1>
              
              {/* Tagline */}
              <p className="text-xl text-white/80 mb-8 max-w-xl mx-auto lg:mx-0 animate-slide-up delay-300">
                Master practical skills with expert guidance. From Excel to Programming, 
                we make learning easy, fun, and career-focused.
              </p>
              
              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-slide-up delay-400">
                <Link 
                  to="/courses" 
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500 rounded-2xl text-white font-bold text-lg overflow-hidden hover:shadow-2xl hover:shadow-orange-500/30 transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></span>
                  <Rocket className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  <span className="relative">Explore Courses</span>
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
                </Link>
                
                <Link 
                  to="/about" 
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-2xl text-white font-bold text-lg border-2 border-white/30 hover:bg-white/10 hover:border-white/50 backdrop-blur-sm transition-all duration-300"
                >
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </Link>
              </div>
              
              {/* Trust Badges */}
              <div className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start animate-slide-up delay-500">
                <div className="flex items-center text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span>First 2-3 Videos Free</span>
                </div>
                <div className="flex items-center text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span>Lifetime Access</span>
                </div>
                <div className="flex items-center text-white/80">
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                  <span>Certificate Included</span>
                </div>
              </div>
            </div>
            
            {/* Right Content - Floating Cards */}
            <div className="hidden lg:block relative">
              {/* Main Card */}
              <div className="relative glass rounded-3xl p-8 animate-float">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center animate-pulse-glow">
                    <GraduationCap className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-xl">Start Learning Today</h3>
                    <p className="text-white/60">Join 10,000+ students</p>
                  </div>
                </div>
                <div className="space-y-4">
                  {['Excel Mastery', 'Photoshop Pro', 'Python Basics'].map((course, i) => (
                    <div key={i} className="flex items-center justify-between bg-white/10 rounded-xl p-3">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${
                          ['from-green-500 to-emerald-500', 'from-blue-500 to-purple-500', 'from-orange-500 to-red-500'][i]
                        } flex items-center justify-center mr-3`}>
                          <BookOpen className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-white font-medium">{course}</span>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/50" />
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Floating Stats Card */}
              <div className="absolute -top-8 -right-8 glass rounded-2xl p-4 animate-float delay-300">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white font-bold text-xl">95%</p>
                    <p className="text-white/60 text-sm">Success Rate</p>
                  </div>
                </div>
              </div>
              
              {/* Floating Rating Card */}
              <div className="absolute -bottom-4 -left-8 glass rounded-2xl p-4 animate-float delay-500">
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <span className="text-white font-bold">4.9</span>
                </div>
                <p className="text-white/60 text-sm mt-1">10,000+ Reviews</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-14 rounded-full border-2 border-white/30 flex items-start justify-center p-2">
            <div className="w-2 h-4 bg-white rounded-full animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative -mt-20 z-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 group animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${stat.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <stat.icon className="w-7 h-7 text-white" />
                </div>
                <p className="text-3xl font-black text-gray-900 mb-1">{stat.value}</p>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bundle Discount Banner */}
      {settings?.bundleDiscounts && (
        <section className="py-16">
          <div className="max-w-6xl mx-auto px-4">
            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-8 lg:p-12 animate-gradient" style={{ backgroundSize: '200% 200%' }}>
              {/* Decorative Elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
                <div className="text-center lg:text-left">
                  <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-4">
                    <Gift className="w-5 h-5 text-yellow-400 mr-2 animate-pulse" />
                    <span className="text-white font-semibold">Special Offer</span>
                  </div>
                  <h2 className="text-3xl lg:text-4xl font-black text-white mb-4">
                    Bundle & Save Big!
                  </h2>
                  <p className="text-white/80 text-lg max-w-lg">
                    Buy more courses, save more money. Get up to 60% OFF on bundles!
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3 justify-center">
                  {['1 Course = 10%', '2 Courses = 20%', '3+ = 30%+'].map((offer, i) => (
                    <div key={i} className="bg-white/20 backdrop-blur-sm rounded-xl px-5 py-3 text-white font-bold border border-white/20 hover:bg-white/30 transition-all hover:scale-105 cursor-pointer">
                      {offer}
                    </div>
                  ))}
                </div>
                
                <Link 
                  to="/courses" 
                  className="inline-flex items-center px-8 py-4 bg-white rounded-2xl text-indigo-600 font-bold hover:shadow-2xl transition-all hover:scale-105"
                >
                  <Zap className="w-5 h-5 mr-2" />
                  Browse Courses
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Categories Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 font-semibold text-sm mb-4">
              <Sparkles className="w-4 h-4 mr-2" />
              EXPLORE CATEGORIES
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              Find Your <span className="text-gradient">Perfect Course</span>
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              Browse through our diverse range of courses designed for all skill levels
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((cat, index) => (
              <Link
                key={index}
                to="/courses"
                className="group relative bg-white rounded-2xl p-6 border-2 border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300`}></div>
                
                <div className="relative z-10">
                  <span className="text-4xl mb-4 block group-hover:scale-110 transition-transform">{cat.icon}</span>
                  <h3 className="font-bold text-gray-900 group-hover:text-white transition-colors">{cat.name}</h3>
                  <p className="text-sm text-gray-500 group-hover:text-white/80 transition-colors">{cat.courses} Courses</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Courses */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col lg:flex-row justify-between items-center mb-12">
            <div>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-purple-100 text-purple-600 font-semibold text-sm mb-4">
                <Trophy className="w-4 h-4 mr-2" />
                TOP RATED COURSES
              </span>
              <h2 className="text-4xl lg:text-5xl font-black text-gray-900">
                Featured <span className="text-gradient">Courses</span>
              </h2>
            </div>
            <Link 
              to="/courses" 
              className="group mt-6 lg:mt-0 inline-flex items-center text-indigo-600 font-semibold hover:text-purple-600 transition-colors"
            >
              View All Courses
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredCourses.map((course, index) => (
              <div key={course.id} className="animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-green-100 text-green-600 font-semibold text-sm mb-4">
              <Medal className="w-4 h-4 mr-2" />
              WHY CHOOSE US
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-gray-900 mb-4">
              The <span className="text-gradient">Hansraj Academy</span> Advantage
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              We provide the best learning experience with cutting-edge tools and expert guidance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <div 
                key={index}
                className="group relative bg-white rounded-2xl p-8 border border-gray-100 hover:border-transparent hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden"
              >
                {/* Glow Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-500`}></div>
                
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-500">{feature.desc}</p>
                
                {/* Arrow */}
                <div className="mt-6 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="inline-flex items-center text-indigo-600 font-semibold">
                    Learn More <ArrowRight className="w-4 h-4 ml-2" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white font-semibold text-sm mb-4 backdrop-blur-sm">
              <Heart className="w-4 h-4 mr-2 text-red-400" />
              STUDENT TESTIMONIALS
            </span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-4">
              What Our <span className="text-gradient-animated">Students Say</span>
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { name: 'Rahul Kumar', role: 'Software Developer', rating: 5, text: 'The Excel course completely transformed my work efficiency. Now I can complete tasks in minutes that used to take hours!' },
              { name: 'Priya Singh', role: 'Graphic Designer', rating: 5, text: 'Photoshop course was amazing! Clear explanations and practical projects helped me land my dream job.' },
              { name: 'Amit Sharma', role: 'Data Analyst', rating: 5, text: 'Best investment in my career. The Python course gave me skills that doubled my salary within 6 months.' },
            ].map((testimonial, index) => (
              <div 
                key={index}
                className="glass rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:-translate-y-2"
              >
                <div className="flex mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  ))}
                </div>
                <p className="text-white/90 mb-6 leading-relaxed">"{testimonial.text}"</p>
                <div className="flex items-center">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center mr-4">
                    <span className="text-white font-bold">{testimonial.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold">{testimonial.name}</p>
                    <p className="text-white/60 text-sm">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 p-12 lg:p-16 text-center animate-gradient" style={{ backgroundSize: '200% 200%' }}>
            {/* Floating Elements */}
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-xl animate-float"></div>
            <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-float delay-300"></div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm mb-6">
                <Rocket className="w-5 h-5 text-yellow-400 mr-2 animate-bounce" />
                <span className="text-white font-semibold">Start Your Journey Today</span>
              </div>
              
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                Ready to Transform<br />Your Career?
              </h2>
              
              <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
                Join 10,000+ students who have already upgraded their skills and landed their dream jobs.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link 
                  to="/register" 
                  className="group inline-flex items-center justify-center px-8 py-4 bg-white rounded-2xl text-indigo-600 font-bold text-lg hover:shadow-2xl transition-all hover:scale-105"
                >
                  <Zap className="w-5 h-5 mr-2 group-hover:rotate-12 transition-transform" />
                  Get Started Free
                </Link>
                <Link 
                  to="/contact" 
                  className="group inline-flex items-center justify-center px-8 py-4 rounded-2xl text-white font-bold text-lg border-2 border-white/30 hover:bg-white/10 transition-all"
                >
                  <Clock className="w-5 h-5 mr-2" />
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

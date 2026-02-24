import { Link } from 'react-router-dom';
import { Award, Users, BookOpen, Clock, CheckCircle, Play, Star, Target, Heart } from 'lucide-react';

export function AboutPage() {
  const achievements = [
    { icon: Clock, value: '20+', label: 'Years Experience' },
    { icon: Users, value: '10,000+', label: 'Students Trained' },
    { icon: BookOpen, value: '50+', label: 'Video Courses' },
    { icon: Star, value: '4.8', label: 'Average Rating' },
  ];

  const values = [
    {
      icon: Target,
      title: 'Practical Learning',
      description: 'We focus more on practical than theory. Learn from real-world examples and projects.'
    },
    {
      icon: Heart,
      title: 'Simple Teaching Style',
      description: 'Everything is explained in simple language. No complicated jargon, just easy to understand content.'
    },
    {
      icon: Award,
      title: 'Job-Ready Skills',
      description: 'We teach skills that are useful in jobs. Get certificate upon passing the test.'
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Welcome to <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                  The Hansraj Academy
                </span>
              </h1>
              <p className="text-xl text-gray-300 mt-6">
                Learn for Life, Not Just Exams!
              </p>
              <p className="text-gray-400 mt-4">
                At The Hansraj Academy, we believe that education should empower you beyond textbooks. 
                Our mission is to teach real-life skills, practical knowledge, and meaningful insights 
                that help you grow personally and professionally.
              </p>
              
              <div className="flex items-center space-x-4 mt-8">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces"
                  alt="Amit Sir"
                  className="w-16 h-16 rounded-full border-4 border-yellow-400"
                />
                <div>
                  <h3 className="font-bold text-xl">Amit Sir</h3>
                  <p className="text-gray-400">Founder & Lead Instructor</p>
                </div>
              </div>
            </div>

            <div className="relative hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=400&fit=crop"
                alt="Teaching"
                className="rounded-2xl shadow-2xl"
              />
              <div className="absolute -bottom-6 -right-6 bg-white text-gray-900 rounded-xl p-4 shadow-xl">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    <Play className="w-6 h-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-bold">50+ Courses</p>
                    <p className="text-sm text-gray-500">Available Now</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {achievements.map((item, index) => (
              <div key={index} className="text-center">
                <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <item.icon className="w-7 h-7 text-indigo-600" />
                </div>
                <p className="text-3xl font-bold text-gray-900">{item.value}</p>
                <p className="text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Our Story</h2>
            <p className="text-gray-600 mt-2">How this journey began</p>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <p className="text-gray-700 leading-relaxed">
              <span className="text-2xl font-bold text-indigo-600">H</span>ansraj Academy started with 
              a simple idea - quality education should be accessible to everyone. 
              With 20+ years of teaching experience, I noticed that many students and 
              working professionals want to learn practical skills but don't get proper guidance.
            </p>
            
            <p className="text-gray-700 leading-relaxed mt-4">
              That's why I created Hansraj Academy - where job-ready skills like Excel, Word, PowerPoint, Photoshop, 
              Python are taught in simple language. Our focus is on practical learning, 
              more on real-world examples than theory.
            </p>

            <p className="text-gray-700 leading-relaxed mt-4">
              Today, 10,000+ students have learned with us and advanced in their careers. 
              Whether you're a student, job seeker, or working professional - Hansraj Academy 
              is ready to take your skills to the next level.
            </p>

            <div className="mt-6 p-4 bg-indigo-50 rounded-lg">
              <p className="text-indigo-800 font-semibold text-center">
                "Education should empower you beyond textbooks."
              </p>
              <p className="text-indigo-600 text-center mt-1">- Amit Sir</p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why Choose Us?</h2>
            <p className="text-gray-600 mt-2">What makes us different</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-8 text-center">
                <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">{value.title}</h3>
                <p className="text-gray-600 mt-3">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">What We Offer</h2>
            <p className="text-gray-600 mt-2">Courses we teach</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'MS Excel', desc: 'Basic to Advanced', color: 'bg-green-500' },
              { name: 'MS Word', desc: 'Document Mastery', color: 'bg-blue-500' },
              { name: 'PowerPoint', desc: 'Presentations', color: 'bg-orange-500' },
              { name: 'Photoshop', desc: 'Photo Editing', color: 'bg-purple-500' },
              { name: 'Python', desc: 'Programming', color: 'bg-yellow-500' },
              { name: 'HTML/CSS', desc: 'Web Development', color: 'bg-red-500' },
              { name: 'Hardware', desc: 'Computer Repair', color: 'bg-gray-600' },
              { name: 'More Coming', desc: 'Stay Tuned!', color: 'bg-indigo-500' },
            ].map((course, index) => (
              <div key={index} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
                <div className={`w-12 h-12 ${course.color} rounded-lg flex items-center justify-center mb-4`}>
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <h3 className="font-bold text-gray-900">{course.name}</h3>
                <p className="text-gray-500 text-sm">{course.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold">Platform Features</h2>
            <p className="text-white/80 mt-2">What makes our platform special</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              'HD Video Lessons in Hindi',
              'Lifetime Access to Courses',
              'Certificate on Completion',
              'WhatsApp Support',
              'Discussion Forum',
              'Live Classes',
              'Quiz & Tests',
              'Progress Tracking',
              'First 2-3 Videos Free',
              'Bundle Discounts',
              'Referral Program',
              'Mobile Friendly'
            ].map((feature, index) => (
              <div key={index} className="flex items-center space-x-3 bg-white/10 rounded-lg p-4">
                <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0" />
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Journey?</h2>
          <p className="text-gray-400 text-lg mt-4">
            Join 10,000+ students who transformed their skills with Hansraj Academy
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <Link 
              to="/courses" 
              className="inline-flex items-center justify-center bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:from-yellow-500 hover:to-orange-600 transition"
            >
              Explore Courses
            </Link>
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center bg-white text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition"
            >
              Register Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

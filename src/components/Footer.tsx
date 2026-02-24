import { Link } from 'react-router-dom';
import { 
  BookOpen, Mail, Phone, MapPin, Youtube, Facebook, Instagram, 
  Linkedin, Twitter, Heart, ArrowRight, Sparkles, Send, Zap
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'Courses', path: '/courses' },
    { name: 'About Us', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const courses = [
    { name: 'MS Excel', path: '/courses' },
    { name: 'MS Word', path: '/courses' },
    { name: 'PowerPoint', path: '/courses' },
    { name: 'Photoshop', path: '/courses' },
    { name: 'Python', path: '/courses' },
    { name: 'Web Development', path: '/courses' },
  ];

  const socialLinks = [
    { icon: Youtube, href: 'https://www.youtube.com/@TheHansrajAcademy', color: 'hover:bg-red-500', glow: 'hover:shadow-red-500/50' },
    { icon: Facebook, href: 'https://www.facebook.com/', color: 'hover:bg-blue-600', glow: 'hover:shadow-blue-500/50' },
    { icon: Instagram, href: 'https://www.instagram.com/', color: 'hover:bg-gradient-to-br hover:from-purple-600 hover:via-pink-500 hover:to-orange-400', glow: 'hover:shadow-pink-500/50' },
    { icon: Linkedin, href: 'https://www.linkedin.com/', color: 'hover:bg-blue-700', glow: 'hover:shadow-blue-600/50' },
    { icon: Twitter, href: 'https://x.com/', color: 'hover:bg-gray-900', glow: 'hover:shadow-gray-500/50' },
  ];

  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-indigo-950 to-purple-950 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-float"></div>
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float delay-500"></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/10 rounded-full blur-3xl animate-float delay-1000"></div>
      </div>

      {/* Newsletter Section */}
      <div className="relative border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="relative bg-gradient-to-r from-indigo-600/20 via-purple-600/20 to-pink-600/20 rounded-3xl p-8 lg:p-12 backdrop-blur-sm border border-white/10">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-3xl opacity-20 blur-xl"></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-4">
                  <Sparkles className="w-4 h-4 text-yellow-400 mr-2 animate-pulse" />
                  <span className="text-white/90 text-sm font-medium">Stay Updated</span>
                </div>
                <h3 className="text-2xl lg:text-3xl font-bold mb-2">Subscribe to Our Newsletter</h3>
                <p className="text-white/60">Get the latest courses, tips, and exclusive offers!</p>
              </div>
              
              <div className="flex w-full lg:w-auto">
                <div className="relative flex-grow lg:w-80">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-sm border border-white/20 rounded-l-2xl text-white placeholder-white/50 focus:outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  />
                </div>
                <button className="px-6 py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-r-2xl font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all flex items-center gap-2 group">
                  <Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  <span className="hidden sm:inline">Subscribe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="relative max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-6 group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                <BookOpen className="w-7 h-7 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Hansraj Academy</span>
                <p className="text-xs text-white/60">Learn Here, Earn Anytime</p>
              </div>
            </Link>
            <p className="text-white/60 mb-6 leading-relaxed">
              Empowering students with practical, job-ready skills. Join 10,000+ learners transforming their careers.
            </p>
            
            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <a 
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center transition-all duration-300 ${social.color} ${social.glow} hover:shadow-lg hover:scale-110 hover:-translate-y-1`}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <Zap className="w-5 h-5 mr-2 text-yellow-400" />
              Quick Links
            </h4>
            <ul className="space-y-4">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <Link 
                    to={link.path}
                    className="group flex items-center text-white/60 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-indigo-400" />
                    <span className="group-hover:translate-x-1 transition-transform">{link.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Courses */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <BookOpen className="w-5 h-5 mr-2 text-purple-400" />
              Popular Courses
            </h4>
            <ul className="space-y-4">
              {courses.map((course, index) => (
                <li key={index}>
                  <Link 
                    to={course.path}
                    className="group flex items-center text-white/60 hover:text-white transition-colors"
                  >
                    <ArrowRight className="w-4 h-4 mr-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-purple-400" />
                    <span className="group-hover:translate-x-1 transition-transform">{course.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6 flex items-center">
              <Mail className="w-5 h-5 mr-2 text-pink-400" />
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:hansrajeducations@gmail.com"
                  className="flex items-start text-white/60 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Mail className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Email Us</p>
                    <span className="text-sm">hansrajeducations@gmail.com</span>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href="tel:+917903421482"
                  className="flex items-start text-white/60 hover:text-white transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <Phone className="w-5 h-5 text-green-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Call/WhatsApp</p>
                    <span className="text-sm">+91 79034 21482</span>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-start text-white/60 group">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-red-500/20 flex items-center justify-center mr-3 group-hover:scale-110 transition-transform">
                    <MapPin className="w-5 h-5 text-orange-400" />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 mb-0.5">Address</p>
                    <span className="text-sm">Hansrajpur, Ekma, Saran (Bihar)</span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="relative border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-white/50 text-sm text-center md:text-left">
              © {currentYear} Hansraj Academy. All rights reserved.
            </p>
            <p className="text-white/50 text-sm flex items-center">
              Made with 
              <Heart className="w-4 h-4 mx-1.5 text-red-500 fill-red-500 animate-pulse" /> 
              by 
              <span className="ml-1.5 font-semibold text-gradient-animated bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Amit Sir
              </span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}

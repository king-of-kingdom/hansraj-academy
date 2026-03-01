import { useState } from 'react';
import { Search, Filter, Sparkles, BookOpen, TrendingUp, Grid, List } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CourseCard } from '../components/CourseCard';
import { fallbackCourses } from '../data/fallbackCourses';

export function CoursesPage() {
  const { courses: appCourses } = useApp();
  
  // Use fallback if no courses
  const courses = appCourses.length > 0 ? appCourses : fallbackCourses;
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const publishedCourses = courses.filter((c: any) => c.isPublished || c.isActive);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const categories = ['All', ...new Set(publishedCourses.map((c: any) => c.category))];

  const filteredCourses = publishedCourses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || course.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categoryIcons: { [key: string]: string } = {
    'All': '✨',
    'MS Office': '📊',
    'Design': '🎨',
    'Programming': '💻',
    'Web Development': '🌐',
    'Hardware': '🔧',
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 pt-24 pb-16">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-72 h-72 bg-indigo-500/30 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-float delay-500"></div>
          <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/20 rounded-full blur-3xl animate-float delay-1000"></div>
        </div>

        {/* Pattern Overlay */}
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}></div>
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-6">
              <Sparkles className="w-4 h-4 text-yellow-400 mr-2 animate-pulse" />
              <span className="text-white/90 text-sm font-medium">{publishedCourses.length}+ Premium Courses Available</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4">
              Explore Our <span className="text-gradient-animated bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Courses</span>
            </h1>
            <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10">
              Master practical skills with expert-led courses. From Excel to Python, we've got you covered.
            </p>
            
            {/* Search Bar */}
            <div className="max-w-3xl mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-50 group-focus-within:opacity-100 transition-opacity"></div>
                <div className="relative flex items-center bg-white rounded-2xl shadow-2xl">
                  <Search className="absolute left-5 text-gray-400 w-6 h-6" />
                  <input
                    type="text"
                    placeholder="Search courses... (Excel, Python, Photoshop, Web Dev)"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-14 pr-6 py-5 rounded-2xl text-gray-800 placeholder-gray-400 focus:outline-none text-lg"
                  />
                  <button className="absolute right-3 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all">
                    Search
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mx-auto mb-2">
                  <BookOpen className="w-7 h-7 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">{publishedCourses.length}+</p>
                <p className="text-white/60 text-sm">Courses</p>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm mx-auto mb-2">
                  <TrendingUp className="w-7 h-7 text-white" />
                </div>
                <p className="text-2xl font-bold text-white">10K+</p>
                <p className="text-white/60 text-sm">Students</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Bar */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8 border border-gray-100">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 w-full lg:w-auto">
              <Filter className="w-5 h-5 text-gray-500 flex-shrink-0 mr-2" />
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl font-medium whitespace-nowrap transition-all duration-300 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{categoryIcons[category] || '📚'}</span>
                  {category}
                </button>
              ))}
            </div>

            {/* View Toggle & Results Count */}
            <div className="flex items-center gap-4">
              <span className="text-gray-500 font-medium">{filteredCourses.length} courses</span>
              <div className="flex items-center bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'grid' 
                      ? 'bg-white shadow-md text-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg transition-all ${
                    viewMode === 'list' 
                      ? 'bg-white shadow-md text-indigo-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Course Grid */}
        {filteredCourses.length > 0 ? (
          <div className={`grid gap-8 ${
            viewMode === 'grid' 
              ? 'sm:grid-cols-2 lg:grid-cols-3' 
              : 'grid-cols-1'
          }`}>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {filteredCourses.map((course: any, index: number) => (
              <div 
                key={course.id || course._id} 
                className="animate-slide-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CourseCard course={course} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-3xl flex items-center justify-center mx-auto mb-6">
              <Search className="w-12 h-12 text-indigo-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Courses Found</h3>
            <p className="text-gray-500 max-w-md mx-auto">
              We couldn't find any courses matching "{searchTerm}". Try a different search term or browse all categories.
            </p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}
              className="mt-6 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-purple-500/30 transition-all"
            >
              Clear Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

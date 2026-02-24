import { Link } from 'react-router-dom';
import { Clock, PlayCircle, Users, Star, Sparkles, ArrowRight } from 'lucide-react';

interface Video {
  _id?: string;
  id?: string;
  title: string;
  youtubeUrl: string;
  duration: string;
  isFree: boolean;
}

interface CourseCardProps {
  course: {
    _id?: string;
    id?: string;
    title: string;
    description: string;
    category: string;
    price: number;
    originalPrice?: number;
    thumbnail: string;
    videos: Video[];
    language?: string;
    level?: string;
    duration?: string;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const courseId = course.id || course._id;
  const originalPrice = course.originalPrice || Math.round(course.price * 1.5);
  const discount = Math.round(((originalPrice - course.price) / originalPrice) * 100);
  const freeVideos = course.videos.filter(v => v.isFree).length;
  const totalDuration = course.duration || `${course.videos.length * 15} mins`;
  const level = course.level || 'Beginner';
  const language = course.language || 'Hindi';

  return (
    <Link to={`/course/${courseId}`} className="group block h-full">
      <div className="relative bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 h-full flex flex-col">
        {/* Gradient Border Effect on Hover */}
        <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-sm"></div>
        
        {/* Image Container */}
        <div className="relative overflow-hidden">
          <img 
            src={course.thumbnail} 
            alt={course.title}
            className="w-full h-52 object-cover group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          
          {/* Top Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            {discount > 0 && (
              <span className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-red-500/30 animate-pulse flex items-center">
                <Sparkles className="w-3 h-3 mr-1" />
                {discount}% OFF
              </span>
            )}
          </div>
          
          {/* Right Badges */}
          <div className="absolute top-4 right-4">
            {freeVideos > 0 && (
              <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1.5 rounded-full text-xs font-bold shadow-lg shadow-green-500/30 flex items-center">
                <PlayCircle className="w-3 h-3 mr-1" />
                {freeVideos} Free Videos
              </span>
            )}
          </div>
          
          {/* Bottom Info */}
          <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium flex items-center">
              <PlayCircle className="w-4 h-4 mr-1.5" />
              {course.videos.length} Lessons
            </span>
            <span className="bg-white/20 backdrop-blur-md text-white px-3 py-1.5 rounded-lg text-sm font-medium">
              {language}
            </span>
          </div>

          {/* Play button overlay on hover */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-2xl transform scale-50 group-hover:scale-100 transition-transform duration-500 hover-glow">
              <PlayCircle className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
        </div>
        
        {/* Content */}
        <div className="p-6 flex flex-col flex-grow">
          {/* Category & Level */}
          <div className="flex items-center justify-between mb-3">
            <span className="bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-full">
              {course.category}
            </span>
            <span className="text-xs text-gray-500 flex items-center bg-gray-100 px-2 py-1 rounded-full">
              <Users className="w-3 h-3 mr-1" />
              {level}
            </span>
          </div>
          
          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 line-clamp-2 group-hover:text-indigo-600 transition-colors mb-2">
            {course.title}
          </h3>
          
          {/* Description */}
          <p className="text-gray-500 text-sm line-clamp-2 flex-grow">
            {course.description}
          </p>
          
          {/* Meta info */}
          <div className="flex items-center mt-4 text-sm text-gray-500 gap-4">
            <span className="flex items-center bg-gray-50 px-3 py-1.5 rounded-lg">
              <Clock className="w-4 h-4 mr-1.5 text-indigo-500" />
              {totalDuration}
            </span>
            <div className="flex items-center">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <span className="ml-1.5 font-semibold text-gray-700">4.9</span>
            </div>
          </div>
          
          {/* Price & CTA */}
          <div className="flex items-center justify-between mt-5 pt-5 border-t border-gray-100">
            <div className="flex flex-col">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl font-black text-gradient">
                  ₹{course.price}
                </span>
                {originalPrice > course.price && (
                  <span className="text-gray-400 line-through text-sm">₹{originalPrice}</span>
                )}
              </div>
            </div>
            <div className="relative group/btn">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl blur-lg opacity-50 group-hover/btn:opacity-100 transition-opacity"></div>
              <div className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 group-hover:shadow-xl transition-all">
                Enroll
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}

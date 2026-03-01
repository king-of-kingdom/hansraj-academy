import { useParams, Link, Navigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Play, Lock, List, MessageCircle, Loader2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { fallbackCourses } from '../data/fallbackCourses';
import { useState, useEffect } from 'react';
import { Course, Video } from '../types';

export function VideoPlayerPage() {
  const { courseId, videoId } = useParams();
  const { courses, user, updateProgress, discussions, addDiscussion, loading } = useApp();
  const [showSidebar, setShowSidebar] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [course, setCourse] = useState<Course | null>(null);
  const [video, setVideo] = useState<Video | null>(null);

  useEffect(() => {
    // Find course from context or fallback
    const allCourses = courses.length > 0 ? courses : fallbackCourses;
    const foundCourse = allCourses.find(c => c.id === courseId);
    
    if (foundCourse) {
      setCourse(foundCourse);
      const foundVideo = foundCourse.videos.find(v => v.id === videoId);
      if (foundVideo) {
        setVideo(foundVideo);
      }
    }
  }, [courseId, videoId, courses]);

  const enrollment = user?.enrolledCourses.find(e => e.courseId === courseId);
  const isUnlocked = enrollment?.isUnlocked || false;
  const canWatch = video?.isFree || isUnlocked;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!course || !video) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 flex-col gap-4">
        <p className="text-gray-400 text-xl">Video not found</p>
        <Link to="/courses" className="text-indigo-400 hover:underline">
          Browse All Courses
        </Link>
      </div>
    );
  }

  if (!canWatch) {
    return <Navigate to={`/course/${courseId}`} />;
  }

  const currentIndex = course.videos.findIndex(v => v.id === videoId);
  const prevVideo = currentIndex > 0 ? course.videos[currentIndex - 1] : null;
  const nextVideo = currentIndex < course.videos.length - 1 ? course.videos[currentIndex + 1] : null;
  const completedVideos = enrollment?.completedVideos || [];
  const isCompleted = completedVideos.includes(video.id);
  const courseDiscussions = discussions.filter(d => d.courseId === courseId);

  const handleMarkComplete = () => {
    if (user && courseId && videoId) {
      updateProgress(courseId, videoId);
    }
  };

  const handlePostComment = () => {
    if (newMessage.trim()) {
      addDiscussion(courseId!, newMessage);
      setNewMessage('');
    }
  };

  // Convert YouTube URL to embed URL
  const getEmbedUrl = (url: string) => {
    if (url.includes('/embed/')) return url;
    const videoIdMatch = url.match(/(?:youtu\.be\/|youtube\.com\/watch\?v=)([^&]+)/);
    if (videoIdMatch) {
      return `https://www.youtube.com/embed/${videoIdMatch[1]}`;
    }
    return url;
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <div className="flex flex-col lg:flex-row">
        {/* Main Video Area */}
        <div className={`flex-1 ${showSidebar ? 'lg:mr-80' : ''}`}>
          {/* Video Player */}
          <div className="relative bg-black aspect-video">
            <iframe
              src={getEmbedUrl(video.youtubeUrl)}
              title={video.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>

          {/* Video Controls */}
          <div className="bg-gray-800 px-4 py-3 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {prevVideo && (
                <Link
                  to={`/watch/${courseId}/${prevVideo.id}`}
                  className="flex items-center text-gray-300 hover:text-white transition"
                >
                  <ChevronLeft className="w-5 h-5 mr-1" />
                  <span className="hidden sm:inline">Previous</span>
                </Link>
              )}
              
              <button
                onClick={handleMarkComplete}
                className={`flex items-center px-4 py-2 rounded-lg transition ${
                  isCompleted
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                <CheckCircle className="w-5 h-5 mr-2" />
                {isCompleted ? 'Completed' : 'Mark Complete'}
              </button>
              
              {nextVideo && (
                <Link
                  to={`/watch/${courseId}/${nextVideo.id}`}
                  className="flex items-center text-gray-300 hover:text-white transition"
                >
                  <span className="hidden sm:inline">Next</span>
                  <ChevronRight className="w-5 h-5 ml-1" />
                </Link>
              )}
            </div>

            <button
              onClick={() => setShowSidebar(!showSidebar)}
              className="lg:hidden p-2 text-gray-300 hover:text-white"
            >
              <List className="w-6 h-6" />
            </button>
          </div>

          {/* Video Info */}
          <div className="p-6 bg-gray-800">
            <h1 className="text-2xl font-bold text-white">{video.title}</h1>
            <div className="flex items-center space-x-4 mt-2 text-gray-400">
              <span>{course.title}</span>
              <span>•</span>
              <span>{video.duration}</span>
              <span>•</span>
              <span>Lesson {currentIndex + 1} of {course.videos.length}</span>
            </div>

            {/* Progress Bar */}
            <div className="mt-6">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-gray-400">Course Progress</span>
                <span className="text-indigo-400">{enrollment?.progress || 0}%</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2">
                <div 
                  className="bg-indigo-500 h-2 rounded-full transition-all"
                  style={{ width: `${enrollment?.progress || 0}%` }}
                />
              </div>
            </div>
          </div>

          {/* Discussion Section */}
          <div className="p-6 bg-gray-800 border-t border-gray-700">
            <h2 className="text-xl font-bold text-white mb-4 flex items-center">
              <MessageCircle className="w-5 h-5 mr-2" />
              Discussion
            </h2>
            
            {user && (
              <div className="mb-6">
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ask a question or share your thoughts..."
                  rows={3}
                  className="w-full p-3 bg-gray-700 text-white rounded-lg border border-gray-600 focus:outline-none focus:border-indigo-500"
                />
                <button
                  onClick={handlePostComment}
                  className="mt-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition"
                >
                  Post Comment
                </button>
              </div>
            )}

            <div className="space-y-4">
              {courseDiscussions.slice(0, 5).map(disc => (
                <div key={disc.id} className="bg-gray-700 rounded-lg p-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{disc.userName[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-white">{disc.userName}</p>
                      <p className="text-xs text-gray-400">{new Date(disc.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <p className="mt-2 text-gray-300">{disc.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar - Video List */}
        <div className={`fixed lg:fixed right-0 top-16 bottom-0 w-80 bg-gray-800 overflow-y-auto transform transition-transform ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        } lg:translate-x-0 z-40`}>
          <div className="p-4 border-b border-gray-700">
            <h2 className="font-bold text-white">Course Content</h2>
            <p className="text-sm text-gray-400">{completedVideos.length} / {course.videos.length} completed</p>
          </div>

          <div className="divide-y divide-gray-700">
            {course.videos.map((v, index) => {
              const isCurrentVideo = v.id === videoId;
              const isVideoCompleted = completedVideos.includes(v.id);
              const canWatchVideo = v.isFree || isUnlocked;

              return (
                <Link
                  key={v.id}
                  to={canWatchVideo ? `/watch/${courseId}/${v.id}` : '#'}
                  className={`block p-4 hover:bg-gray-700 transition ${
                    isCurrentVideo ? 'bg-indigo-900/50 border-l-4 border-indigo-500' : ''
                  } ${!canWatchVideo ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                      isVideoCompleted ? 'bg-green-600' : 
                      isCurrentVideo ? 'bg-indigo-600' : 'bg-gray-600'
                    }`}>
                      {isVideoCompleted ? (
                        <CheckCircle className="w-4 h-4 text-white" />
                      ) : canWatchVideo ? (
                        <Play className="w-4 h-4 text-white" />
                      ) : (
                        <Lock className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`font-medium truncate ${isCurrentVideo ? 'text-indigo-400' : 'text-white'}`}>
                        {index + 1}. {v.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-400">{v.duration}</span>
                        {v.isFree && (
                          <span className="text-xs bg-green-600 text-white px-1.5 py-0.5 rounded">FREE</span>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Take Quiz Button */}
          {enrollment && enrollment.progress >= 80 && (
            <div className="p-4 border-t border-gray-700">
              <Link
                to={`/quiz/${courseId}`}
                className="block w-full bg-yellow-500 text-gray-900 text-center py-3 rounded-lg font-bold hover:bg-yellow-400 transition"
              >
                🎓 Take Certificate Test
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

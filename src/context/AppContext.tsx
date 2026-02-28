import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Course, User, PaymentRequest, SiteSettings, Quiz, LiveClass, Discussion, Certificate } from '../types';
import { authAPI, coursesAPI, paymentsAPI, usersAPI, settingsAPI, liveClassesAPI, discussionsAPI, quizAPI, certificatesAPI } from '../services/api';
import { initialSettings } from '../data/initialData';

interface AppContextType {
  // Auth
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string, referralCode?: string) => Promise<boolean>;
  logout: () => void;
  isAdmin: boolean;
  loading: boolean;
  
  // Courses
  courses: Course[];
  fetchCourses: () => Promise<void>;
  addCourse: (course: Omit<Course, 'id'>) => Promise<void>;
  updateCourse: (course: Course) => Promise<void>;
  deleteCourse: (id: string) => Promise<void>;
  addVideoToCourse: (courseId: string, video: { title: string; youtubeUrl: string; duration?: string; isFree?: boolean }) => Promise<void>;
  deleteVideoFromCourse: (courseId: string, videoId: string) => Promise<void>;
  
  // Cart
  cart: string[];
  addToCart: (courseId: string) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; discount: number; total: number };
  
  // Payments
  paymentRequests: PaymentRequest[];
  fetchPayments: () => Promise<void>;
  submitPayment: (transactionId: string) => Promise<void>;
  verifyPayment: (requestId: string) => Promise<void>;
  rejectPayment: (requestId: string) => Promise<void>;
  
  // Settings
  settings: SiteSettings;
  fetchSettings: () => Promise<void>;
  updateSettings: (settings: SiteSettings) => Promise<void>;
  
  // Quiz
  quizzes: Quiz[];
  fetchQuizzes: (courseId?: string) => Promise<void>;
  addQuiz: (quiz: Omit<Quiz, 'id'>) => Promise<void>;
  submitQuizResult: (quizId: string, score: number) => Promise<void>;
  
  // Live Classes
  liveClasses: LiveClass[];
  fetchLiveClasses: () => Promise<void>;
  addLiveClass: (liveClass: Omit<LiveClass, 'id'>) => Promise<void>;
  deleteLiveClass: (id: string) => Promise<void>;
  
  // Discussions
  discussions: Discussion[];
  fetchDiscussions: (courseId: string) => Promise<void>;
  addDiscussion: (courseId: string, message: string) => Promise<void>;
  addReply: (discussionId: string, message: string) => Promise<void>;
  
  // Certificates
  certificates: Certificate[];
  fetchCertificates: () => Promise<void>;
  
  // Progress
  updateProgress: (courseId: string, videoId: string) => Promise<void>;
  
  // Users (Admin)
  allUsers: User[];
  fetchUsers: () => Promise<void>;
  
  // Refresh all data
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [cart, setCart] = useState<string[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>([]);
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);

  const isAdmin = user?.role === 'admin';

  // Save cart to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Fetch user profile on token change
  useEffect(() => {
    const fetchProfile = async () => {
      if (token) {
        try {
          const data = await authAPI.getProfile();
          setUser(data.user || data);
        } catch (error) {
          console.error('Failed to fetch profile:', error);
          localStorage.removeItem('token');
          setToken(null);
        }
      }
      setLoading(false);
    };
    fetchProfile();
  }, [token]);

  // Fetch initial data
  useEffect(() => {
    fetchCourses();
    fetchSettings();
    fetchLiveClasses();
  }, []);

  // Fetch admin data when user is admin
  useEffect(() => {
    if (isAdmin) {
      fetchPayments();
      fetchUsers();
    }
  }, [isAdmin]);

  // ============ AUTH ============
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const data = await authAPI.login({ email, password });
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const register = async (name: string, email: string, phone: string, password: string, _referralCode?: string): Promise<boolean> => {
    try {
      const data = await authAPI.register({ name, email, password, phone });
      if (data.token) {
        localStorage.setItem('token', data.token);
        setToken(data.token);
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setCart([]);
  };

  // ============ COURSES ============
  const fetchCourses = useCallback(async () => {
    try {
      const data = await coursesAPI.getAll();
      setCourses(data.courses || data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
    }
  }, []);

  const addCourse = async (course: Omit<Course, 'id'>) => {
    try {
      await coursesAPI.create({
        title: course.title,
        description: course.description,
        category: course.category,
        price: course.price,
        thumbnail: course.thumbnail
      });
      await fetchCourses();
    } catch (error) {
      console.error('Failed to add course:', error);
      throw error;
    }
  };

  const updateCourse = async (course: Course) => {
    try {
      await coursesAPI.update(course.id, {
        title: course.title,
        description: course.description,
        category: course.category,
        price: course.price,
        thumbnail: course.thumbnail,
        isActive: true
      });
      await fetchCourses();
    } catch (error) {
      console.error('Failed to update course:', error);
      throw error;
    }
  };

  const deleteCourse = async (id: string) => {
    try {
      await coursesAPI.delete(id);
      await fetchCourses();
    } catch (error) {
      console.error('Failed to delete course:', error);
      throw error;
    }
  };

  const addVideoToCourse = async (courseId: string, video: { title: string; youtubeUrl: string; duration?: string; isFree?: boolean }) => {
    try {
      await coursesAPI.addVideo(courseId, video);
      await fetchCourses();
    } catch (error) {
      console.error('Failed to add video:', error);
      throw error;
    }
  };

  const deleteVideoFromCourse = async (courseId: string, videoId: string) => {
    try {
      await coursesAPI.deleteVideo(courseId, videoId);
      await fetchCourses();
    } catch (error) {
      console.error('Failed to delete video:', error);
      throw error;
    }
  };

  // ============ CART ============
  const addToCart = (courseId: string) => {
    if (!cart.includes(courseId)) {
      setCart(prev => [...prev, courseId]);
    }
  };

  const removeFromCart = (courseId: string) => {
    setCart(prev => prev.filter(id => id !== courseId));
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    const cartCourses = courses.filter(c => cart.includes(c.id));
    const subtotal = cartCourses.reduce((sum, c) => sum + c.price, 0);
    
    const courseCount = cart.length;
    const bundleDiscount = settings.bundleDiscounts.find(b => b.courseCount === courseCount);
    let discountPercent = bundleDiscount?.discountPercent || 0;
    
    if (settings.festivalDiscount.enabled) {
      discountPercent = Math.max(discountPercent, settings.festivalDiscount.percent);
    }
    
    const discount = (subtotal * discountPercent) / 100;
    const total = subtotal - discount;
    
    return { subtotal, discount, total };
  };

  // ============ PAYMENTS ============
  const fetchPayments = useCallback(async () => {
    try {
      const data = await paymentsAPI.getAllPayments();
      setPaymentRequests(data.payments || data || []);
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  }, []);

  const submitPayment = async (transactionId: string) => {
    if (!user) return;
    
    const { total } = getCartTotal();
    
    try {
      await paymentsAPI.create({
        courseIds: cart,
        amount: total,
        transactionId
      });
      clearCart();
      await fetchPayments();
    } catch (error) {
      console.error('Failed to submit payment:', error);
      throw error;
    }
  };

  const verifyPayment = async (requestId: string) => {
    try {
      await paymentsAPI.verifyPayment(requestId);
      await fetchPayments();
      await fetchUsers();
    } catch (error) {
      console.error('Failed to verify payment:', error);
      throw error;
    }
  };

  const rejectPayment = async (requestId: string) => {
    try {
      await paymentsAPI.rejectPayment(requestId, 'Payment rejected by admin');
      await fetchPayments();
    } catch (error) {
      console.error('Failed to reject payment:', error);
      throw error;
    }
  };

  // ============ SETTINGS ============
  const fetchSettings = useCallback(async () => {
    try {
      const data = await settingsAPI.get();
      if (data) {
        setSettings({
          upiId: data.upiId || initialSettings.upiId,
          qrCodeImage: data.qrCodeUrl || data.qrCodeImage || initialSettings.qrCodeImage,
          qrCodeUrl: data.qrCodeUrl || initialSettings.qrCodeImage,
          phoneNumber: data.phoneNumber || initialSettings.phoneNumber,
          bundleDiscounts: data.bundleDiscounts || initialSettings.bundleDiscounts,
          festivalDiscount: data.festivalDiscount ? {
            enabled: data.festivalDiscount.enabled,
            name: data.festivalDiscount.name || '',
            percent: data.festivalDiscount.percentage || data.festivalDiscount.percent || 0,
            endDate: data.festivalDiscount.endDate || ''
          } : initialSettings.festivalDiscount,
          freeVideosCount: data.freeVideosCount || initialSettings.freeVideosCount
        });
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
    }
  }, []);

  const updateSettingsHandler = async (newSettings: SiteSettings) => {
    try {
      await settingsAPI.update({
        upiId: newSettings.upiId,
        qrCodeUrl: newSettings.qrCodeImage,
        phoneNumber: newSettings.phoneNumber,
        bundleDiscounts: newSettings.bundleDiscounts.map(b => ({ courses: b.courseCount, discount: b.discountPercent })),
        festivalDiscount: { 
          enabled: newSettings.festivalDiscount.enabled, 
          percentage: newSettings.festivalDiscount.percent,
          name: newSettings.festivalDiscount.name 
        },
        freeVideosCount: newSettings.freeVideosCount
      });
      await fetchSettings();
    } catch (error) {
      console.error('Failed to update settings:', error);
      throw error;
    }
  };

  // ============ QUIZZES ============
  const fetchQuizzes = useCallback(async (courseId?: string) => {
    try {
      if (courseId) {
        const data = await quizAPI.getForCourse(courseId);
        setQuizzes(data.quizzes || data || []);
      }
    } catch (error) {
      console.error('Failed to fetch quizzes:', error);
    }
  }, []);

  const addQuiz = async (quiz: Omit<Quiz, 'id'>) => {
    try {
      await quizAPI.create({
        courseId: quiz.courseId,
        title: quiz.title,
        questions: quiz.questions.map(q => ({
          question: q.question,
          options: q.options,
          correctAnswer: q.correctAnswer
        })),
        passingScore: quiz.passingScore,
        timeLimit: quiz.timeLimit
      });
      await fetchQuizzes(quiz.courseId);
    } catch (error) {
      console.error('Failed to add quiz:', error);
      throw error;
    }
  };

  const submitQuizResult = async (quizId: string, score: number) => {
    if (!user) return;
    
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    
    if (score >= quiz.passingScore) {
      // Certificate will be generated by backend
      console.log('Quiz passed with score:', score);
    }
  };

  // ============ LIVE CLASSES ============
  const fetchLiveClasses = useCallback(async () => {
    try {
      const data = await liveClassesAPI.getAll();
      setLiveClasses(data.liveClasses || data || []);
    } catch (error) {
      console.error('Failed to fetch live classes:', error);
    }
  }, []);

  const addLiveClass = async (liveClass: Omit<LiveClass, 'id'>) => {
    try {
      await liveClassesAPI.create({
        title: liveClass.title,
        description: liveClass.description,
        courseId: liveClass.courseId,
        scheduledAt: liveClass.scheduledAt,
        duration: liveClass.duration || 60,
        meetingLink: liveClass.meetLink || liveClass.meetingLink || '',
        platform: liveClass.platform || 'Google Meet'
      });
      await fetchLiveClasses();
    } catch (error) {
      console.error('Failed to add live class:', error);
      throw error;
    }
  };

  const deleteLiveClass = async (id: string) => {
    try {
      await liveClassesAPI.delete(id);
      await fetchLiveClasses();
    } catch (error) {
      console.error('Failed to delete live class:', error);
      throw error;
    }
  };

  // ============ DISCUSSIONS ============
  const fetchDiscussions = useCallback(async (courseId: string) => {
    try {
      const data = await discussionsAPI.getByCourse(courseId);
      setDiscussions(data.discussions || data || []);
    } catch (error) {
      console.error('Failed to fetch discussions:', error);
    }
  }, []);

  const addDiscussion = async (courseId: string, message: string) => {
    try {
      await discussionsAPI.create({ courseId, title: 'Discussion', content: message });
      await fetchDiscussions(courseId);
    } catch (error) {
      console.error('Failed to add discussion:', error);
      throw error;
    }
  };

  const addReply = async (discussionId: string, message: string) => {
    try {
      await discussionsAPI.addReply(discussionId, message);
    } catch (error) {
      console.error('Failed to add reply:', error);
      throw error;
    }
  };

  // ============ CERTIFICATES ============
  const fetchCertificates = useCallback(async () => {
    try {
      const data = await certificatesAPI.getMyCertificates();
      setCertificates(data.certificates || data || []);
    } catch (error) {
      console.error('Failed to fetch certificates:', error);
    }
  }, []);

  // ============ PROGRESS ============
  const updateProgress = async (courseId: string, videoId: string) => {
    try {
      await coursesAPI.markVideoComplete(courseId, videoId);
    } catch (error) {
      console.error('Failed to update progress:', error);
      throw error;
    }
  };

  // ============ USERS ============
  const fetchUsers = useCallback(async () => {
    try {
      const data = await usersAPI.getAll();
      setAllUsers(data.users || data || []);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  }, []);

  // ============ REFRESH ALL DATA ============
  const refreshData = async () => {
    await Promise.all([
      fetchCourses(),
      fetchSettings(),
      fetchLiveClasses(),
      isAdmin ? fetchPayments() : Promise.resolve(),
      isAdmin ? fetchUsers() : Promise.resolve()
    ]);
  };

  return (
    <AppContext.Provider value={{
      user, token, login, register, logout, isAdmin, loading,
      courses, fetchCourses, addCourse, updateCourse, deleteCourse, addVideoToCourse, deleteVideoFromCourse,
      cart, addToCart, removeFromCart, clearCart, getCartTotal,
      paymentRequests, fetchPayments, submitPayment, verifyPayment, rejectPayment,
      settings, fetchSettings, updateSettings: updateSettingsHandler,
      quizzes, fetchQuizzes, addQuiz, submitQuizResult,
      liveClasses, fetchLiveClasses, addLiveClass, deleteLiveClass,
      discussions, fetchDiscussions, addDiscussion, addReply,
      certificates, fetchCertificates,
      updateProgress,
      allUsers, fetchUsers,
      refreshData
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}

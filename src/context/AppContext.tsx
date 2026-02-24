import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Course, User, PaymentRequest, SiteSettings, Quiz, LiveClass, Discussion, Certificate } from '../types';
import { initialCourses, initialQuizzes, initialSettings } from '../data/initialData';

interface AppContextType {
  // Auth
  user: User | null;
  login: (email: string, password: string) => boolean;
  register: (name: string, email: string, phone: string, password: string, referralCode?: string) => boolean;
  logout: () => void;
  isAdmin: boolean;
  
  // Courses
  courses: Course[];
  addCourse: (course: Course) => void;
  updateCourse: (course: Course) => void;
  deleteCourse: (id: string) => void;
  
  // Cart
  cart: string[];
  addToCart: (courseId: string) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  getCartTotal: () => { subtotal: number; discount: number; total: number };
  
  // Payments
  paymentRequests: PaymentRequest[];
  submitPayment: (transactionId: string) => void;
  verifyPayment: (requestId: string) => void;
  rejectPayment: (requestId: string) => void;
  
  // Settings
  settings: SiteSettings;
  updateSettings: (settings: SiteSettings) => void;
  
  // Quiz
  quizzes: Quiz[];
  addQuiz: (quiz: Quiz) => void;
  submitQuizResult: (quizId: string, score: number) => void;
  
  // Live Classes
  liveClasses: LiveClass[];
  addLiveClass: (liveClass: LiveClass) => void;
  deleteLiveClass: (id: string) => void;
  
  // Discussions
  discussions: Discussion[];
  addDiscussion: (courseId: string, message: string) => void;
  addReply: (discussionId: string, message: string) => void;
  
  // Certificates
  certificates: Certificate[];
  
  // Progress
  updateProgress: (courseId: string, videoId: string) => void;
  
  // Users (Admin)
  allUsers: User[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('currentUser');
    return saved ? JSON.parse(saved) : null;
  });
  
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem('courses');
    return saved ? JSON.parse(saved) : initialCourses;
  });
  
  const [cart, setCart] = useState<string[]>(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [paymentRequests, setPaymentRequests] = useState<PaymentRequest[]>(() => {
    const saved = localStorage.getItem('paymentRequests');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [settings, setSettings] = useState<SiteSettings>(() => {
    const saved = localStorage.getItem('siteSettings');
    return saved ? JSON.parse(saved) : initialSettings;
  });
  
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = localStorage.getItem('quizzes');
    return saved ? JSON.parse(saved) : initialQuizzes;
  });
  
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>(() => {
    const saved = localStorage.getItem('liveClasses');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [discussions, setDiscussions] = useState<Discussion[]>(() => {
    const saved = localStorage.getItem('discussions');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem('certificates');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('allUsers');
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage
  useEffect(() => {
    if (user) localStorage.setItem('currentUser', JSON.stringify(user));
    else localStorage.removeItem('currentUser');
  }, [user]);
  
  useEffect(() => { localStorage.setItem('courses', JSON.stringify(courses)); }, [courses]);
  useEffect(() => { localStorage.setItem('cart', JSON.stringify(cart)); }, [cart]);
  useEffect(() => { localStorage.setItem('paymentRequests', JSON.stringify(paymentRequests)); }, [paymentRequests]);
  useEffect(() => { localStorage.setItem('siteSettings', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('quizzes', JSON.stringify(quizzes)); }, [quizzes]);
  useEffect(() => { localStorage.setItem('liveClasses', JSON.stringify(liveClasses)); }, [liveClasses]);
  useEffect(() => { localStorage.setItem('discussions', JSON.stringify(discussions)); }, [discussions]);
  useEffect(() => { localStorage.setItem('certificates', JSON.stringify(certificates)); }, [certificates]);
  useEffect(() => { localStorage.setItem('allUsers', JSON.stringify(allUsers)); }, [allUsers]);

  const isAdmin = user?.role === 'admin';

  const login = (email: string, password: string): boolean => {
    // Admin login
    if (email === 'admin@hansraj.com' && password === 'admin123') {
      const adminUser: User = {
        id: 'admin-1',
        name: 'Amit Sir',
        email: 'admin@hansraj.com',
        phone: '+91 79034 21482',
        role: 'admin',
        enrolledCourses: [],
        referralCode: 'ADMIN',
        createdAt: new Date().toISOString()
      };
      setUser(adminUser);
      return true;
    }
    
    // Student login
    const savedUsers = localStorage.getItem('allUsers');
    const users: User[] = savedUsers ? JSON.parse(savedUsers) : [];
    const foundUser = users.find(u => u.email === email);
    
    if (foundUser) {
      setUser(foundUser);
      return true;
    }
    
    return false;
  };

  const register = (name: string, email: string, phone: string, _password: string, referralCode?: string): boolean => {
    const newUser: User = {
      id: `user-${Date.now()}`,
      name,
      email,
      phone,
      role: 'student',
      enrolledCourses: [],
      referralCode: `REF${Date.now().toString(36).toUpperCase()}`,
      referredBy: referralCode,
      createdAt: new Date().toISOString()
    };
    
    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
    return true;
  };

  const logout = () => {
    setUser(null);
    setCart([]);
  };

  const addCourse = (course: Course) => {
    setCourses(prev => [...prev, course]);
  };

  const updateCourse = (course: Course) => {
    setCourses(prev => prev.map(c => c.id === course.id ? course : c));
  };

  const deleteCourse = (id: string) => {
    setCourses(prev => prev.filter(c => c.id !== id));
  };

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

  const submitPayment = (transactionId: string) => {
    if (!user) return;
    
    const { total, discount } = getCartTotal();
    
    const request: PaymentRequest = {
      id: `pay-${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      userPhone: user.phone,
      courseIds: [...cart],
      totalAmount: total,
      discountApplied: discount,
      transactionId,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    setPaymentRequests(prev => [...prev, request]);
    
    // Add courses to enrolled (but locked)
    const newEnrollments: User['enrolledCourses'] = cart.map(courseId => ({
      courseId,
      enrolledAt: new Date().toISOString(),
      isUnlocked: false,
      progress: 0,
      completedVideos: [],
      paymentStatus: 'pending' as const,
      transactionId
    }));
    
    setUser(prev => prev ? {
      ...prev,
      enrolledCourses: [...prev.enrolledCourses, ...newEnrollments]
    } : null);
    
    setAllUsers(prev => prev.map(u => u.id === user.id ? {
      ...u,
      enrolledCourses: [...u.enrolledCourses, ...newEnrollments]
    } : u));
    
    clearCart();
  };

  const verifyPayment = (requestId: string) => {
    const request = paymentRequests.find(r => r.id === requestId);
    if (!request) return;
    
    setPaymentRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'verified' } : r
    ));
    
    // Unlock courses for user
    setAllUsers(prev => prev.map(u => {
      if (u.id === request.userId) {
        return {
          ...u,
          enrolledCourses: u.enrolledCourses.map(e => 
            request.courseIds.includes(e.courseId) 
              ? { ...e, isUnlocked: true, paymentStatus: 'verified' as const }
              : e
          )
        };
      }
      return u;
    }));
    
    // Update current user if same
    if (user?.id === request.userId) {
      setUser(prev => prev ? {
        ...prev,
        enrolledCourses: prev.enrolledCourses.map(e => 
          request.courseIds.includes(e.courseId)
            ? { ...e, isUnlocked: true, paymentStatus: 'verified' as const }
            : e
        )
      } : null);
    }
  };

  const rejectPayment = (requestId: string) => {
    setPaymentRequests(prev => prev.map(r => 
      r.id === requestId ? { ...r, status: 'rejected' } : r
    ));
  };

  const updateSettings = (newSettings: SiteSettings) => {
    setSettings(newSettings);
  };

  const addQuiz = (quiz: Quiz) => {
    setQuizzes(prev => [...prev, quiz]);
  };

  const submitQuizResult = (quizId: string, score: number) => {
    if (!user) return;
    
    const quiz = quizzes.find(q => q.id === quizId);
    if (!quiz) return;
    
    if (score >= quiz.passingScore) {
      const cert: Certificate = {
        id: `cert-${Date.now()}`,
        courseId: quiz.courseId,
        userId: user.id,
        issuedAt: new Date().toISOString(),
        score
      };
      setCertificates(prev => [...prev, cert]);
    }
  };

  const addLiveClass = (liveClass: LiveClass) => {
    setLiveClasses(prev => [...prev, liveClass]);
  };

  const deleteLiveClass = (id: string) => {
    setLiveClasses(prev => prev.filter(l => l.id !== id));
  };

  const addDiscussion = (courseId: string, message: string) => {
    if (!user) return;
    
    const newDiscussion: Discussion = {
      id: `disc-${Date.now()}`,
      courseId,
      userId: user.id,
      userName: user.name,
      message,
      createdAt: new Date().toISOString(),
      replies: []
    };
    
    setDiscussions(prev => [...prev, newDiscussion]);
  };

  const addReply = (discussionId: string, message: string) => {
    if (!user) return;
    
    setDiscussions(prev => prev.map(d => {
      if (d.id === discussionId) {
        return {
          ...d,
          replies: [...d.replies, {
            id: `reply-${Date.now()}`,
            userId: user.id,
            userName: user.name,
            message,
            createdAt: new Date().toISOString()
          }]
        };
      }
      return d;
    }));
  };

  const updateProgress = (courseId: string, videoId: string) => {
    if (!user) return;
    
    const course = courses.find(c => c.id === courseId);
    if (!course) return;
    
    setUser(prev => {
      if (!prev) return null;
      
      return {
        ...prev,
        enrolledCourses: prev.enrolledCourses.map(e => {
          if (e.courseId === courseId) {
            const completedVideos = e.completedVideos.includes(videoId)
              ? e.completedVideos
              : [...e.completedVideos, videoId];
            const progress = Math.round((completedVideos.length / course.videos.length) * 100);
            return { ...e, completedVideos, progress };
          }
          return e;
        })
      };
    });
    
    setAllUsers(prev => prev.map(u => {
      if (u.id === user.id) {
        return {
          ...u,
          enrolledCourses: u.enrolledCourses.map(e => {
            if (e.courseId === courseId) {
              const completedVideos = e.completedVideos.includes(videoId)
                ? e.completedVideos
                : [...e.completedVideos, videoId];
              const progress = Math.round((completedVideos.length / course.videos.length) * 100);
              return { ...e, completedVideos, progress };
            }
            return e;
          })
        };
      }
      return u;
    }));
  };

  return (
    <AppContext.Provider value={{
      user, login, register, logout, isAdmin,
      courses, addCourse, updateCourse, deleteCourse,
      cart, addToCart, removeFromCart, clearCart, getCartTotal,
      paymentRequests, submitPayment, verifyPayment, rejectPayment,
      settings, updateSettings,
      quizzes, addQuiz, submitQuizResult,
      liveClasses, addLiveClass, deleteLiveClass,
      discussions, addDiscussion, addReply,
      certificates,
      updateProgress,
      allUsers
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

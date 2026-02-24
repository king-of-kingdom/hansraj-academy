// API Service - Connects Frontend to Backend

// API Base URL - Change this when deploying
// For development: http://localhost:5000/api
// For production: Set VITE_API_URL environment variable to your backend URL
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = (): string | null => {
  const user = localStorage.getItem('user');
  if (user) {
    const parsed = JSON.parse(user);
    return parsed.token || null;
  }
  return null;
};

// API Headers
const getHeaders = (includeAuth: boolean = true): Record<string, string> => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (includeAuth) {
    const token = getToken();
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
};

// Generic API call function
const apiCall = async (endpoint: string, options: RequestInit = {}, skipAuth: boolean = false) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: getHeaders(!skipAuth),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Something went wrong');
    }
    
    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
};

// ============ AUTH API ============
export const authAPI = {
  register: async (userData: { name: string; email: string; password: string; phone?: string }) => {
    return apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    }, true);
  },
  
  login: async (credentials: { email: string; password: string }) => {
    return apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }, true);
  },
  
  getProfile: async () => {
    return apiCall('/auth/me');
  },
  
  updateProfile: async (data: { name?: string; phone?: string }) => {
    return apiCall('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  
  changePassword: async (data: { currentPassword: string; newPassword: string }) => {
    return apiCall('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
};

// ============ COURSES API ============
export const coursesAPI = {
  getAll: async (params?: { category?: string; search?: string }) => {
    const queryString = params ? '?' + new URLSearchParams(params as Record<string, string>).toString() : '';
    return apiCall(`/courses${queryString}`, {}, true);
  },
  
  getById: async (id: string) => {
    return apiCall(`/courses/${id}`, {}, true);
  },
  
  create: async (courseData: {
    title: string;
    description: string;
    category: string;
    price: number;
    thumbnail?: string;
  }) => {
    return apiCall('/courses', {
      method: 'POST',
      body: JSON.stringify(courseData),
    });
  },
  
  update: async (id: string, courseData: Partial<{
    title: string;
    description: string;
    category: string;
    price: number;
    thumbnail?: string;
    isActive: boolean;
  }>) => {
    return apiCall(`/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(courseData),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/courses/${id}`, {
      method: 'DELETE',
    });
  },
  
  // Videos
  addVideo: async (courseId: string, videoData: {
    title: string;
    youtubeUrl: string;
    duration?: string;
    isFree?: boolean;
  }) => {
    return apiCall(`/courses/${courseId}/videos`, {
      method: 'POST',
      body: JSON.stringify(videoData),
    });
  },
  
  updateVideo: async (courseId: string, videoId: string, videoData: {
    title?: string;
    youtubeUrl?: string;
    duration?: string;
    isFree?: boolean;
  }) => {
    return apiCall(`/courses/${courseId}/videos/${videoId}`, {
      method: 'PUT',
      body: JSON.stringify(videoData),
    });
  },
  
  deleteVideo: async (courseId: string, videoId: string) => {
    return apiCall(`/courses/${courseId}/videos/${videoId}`, {
      method: 'DELETE',
    });
  },
  
  // Progress
  markVideoComplete: async (courseId: string, videoId: string) => {
    return apiCall(`/courses/${courseId}/videos/${videoId}/complete`, {
      method: 'POST',
    });
  },
  
  getProgress: async (courseId: string) => {
    return apiCall(`/courses/${courseId}/progress`);
  },
};

// ============ PAYMENTS API ============
export const paymentsAPI = {
  create: async (paymentData: {
    courseIds: string[];
    amount: number;
    transactionId: string;
  }) => {
    return apiCall('/payments', {
      method: 'POST',
      body: JSON.stringify(paymentData),
    });
  },
  
  getMyPayments: async () => {
    return apiCall('/payments/my-payments');
  },
  
  // Admin
  getAllPayments: async (status?: string) => {
    const queryString = status ? `?status=${status}` : '';
    return apiCall(`/payments${queryString}`);
  },
  
  verifyPayment: async (paymentId: string) => {
    return apiCall(`/payments/${paymentId}/verify`, {
      method: 'PUT',
    });
  },
  
  rejectPayment: async (paymentId: string, reason: string) => {
    return apiCall(`/payments/${paymentId}/reject`, {
      method: 'PUT',
      body: JSON.stringify({ reason }),
    });
  },
};

// ============ USERS API ============
export const usersAPI = {
  getAll: async () => {
    return apiCall('/users');
  },
  
  getById: async (id: string) => {
    return apiCall(`/users/${id}`);
  },
  
  updateRole: async (id: string, role: string) => {
    return apiCall(`/users/${id}/role`, {
      method: 'PUT',
      body: JSON.stringify({ role }),
    });
  },
  
  getMyCourses: async () => {
    return apiCall('/users/my-courses');
  },
  
  applyReferralCode: async (code: string) => {
    return apiCall('/users/apply-referral', {
      method: 'POST',
      body: JSON.stringify({ code }),
    });
  },
};

// ============ QUIZ API ============
export const quizAPI = {
  getForCourse: async (courseId: string) => {
    return apiCall(`/quiz/course/${courseId}`);
  },
  
  submit: async (quizId: string, answers: { questionId: string; answer: number }[]) => {
    return apiCall(`/quiz/${quizId}/submit`, {
      method: 'POST',
      body: JSON.stringify({ answers }),
    });
  },
  
  // Admin
  create: async (quizData: {
    courseId: string;
    title: string;
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
    passingScore: number;
    timeLimit: number;
  }) => {
    return apiCall('/quiz', {
      method: 'POST',
      body: JSON.stringify(quizData),
    });
  },
  
  update: async (quizId: string, quizData: Partial<{
    title: string;
    questions: {
      question: string;
      options: string[];
      correctAnswer: number;
    }[];
    passingScore: number;
    timeLimit: number;
  }>) => {
    return apiCall(`/quiz/${quizId}`, {
      method: 'PUT',
      body: JSON.stringify(quizData),
    });
  },
  
  delete: async (quizId: string) => {
    return apiCall(`/quiz/${quizId}`, {
      method: 'DELETE',
    });
  },
};

// ============ CERTIFICATES API ============
export const certificatesAPI = {
  getMyCertificates: async () => {
    return apiCall('/certificates/my-certificates');
  },
  
  getById: async (id: string) => {
    return apiCall(`/certificates/${id}`);
  },
  
  verify: async (certificateNumber: string) => {
    return apiCall(`/certificates/verify/${certificateNumber}`, {}, true);
  },
};

// ============ LIVE CLASSES API ============
export const liveClassesAPI = {
  getAll: async () => {
    return apiCall('/live-classes', {}, true);
  },
  
  getUpcoming: async () => {
    return apiCall('/live-classes/upcoming', {}, true);
  },
  
  // Admin
  create: async (classData: {
    title: string;
    description?: string;
    courseId?: string;
    scheduledAt: string;
    duration: number;
    meetingLink: string;
    platform: string;
  }) => {
    return apiCall('/live-classes', {
      method: 'POST',
      body: JSON.stringify(classData),
    });
  },
  
  update: async (id: string, classData: Partial<{
    title: string;
    description?: string;
    scheduledAt: string;
    duration: number;
    meetingLink: string;
    platform: string;
    status: string;
  }>) => {
    return apiCall(`/live-classes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(classData),
    });
  },
  
  delete: async (id: string) => {
    return apiCall(`/live-classes/${id}`, {
      method: 'DELETE',
    });
  },
};

// ============ DISCUSSIONS API ============
export const discussionsAPI = {
  getByCourse: async (courseId: string) => {
    return apiCall(`/discussions/course/${courseId}`, {}, true);
  },
  
  create: async (discussionData: {
    courseId: string;
    title: string;
    content: string;
  }) => {
    return apiCall('/discussions', {
      method: 'POST',
      body: JSON.stringify(discussionData),
    });
  },
  
  addReply: async (discussionId: string, content: string) => {
    return apiCall(`/discussions/${discussionId}/reply`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  },
  
  delete: async (discussionId: string) => {
    return apiCall(`/discussions/${discussionId}`, {
      method: 'DELETE',
    });
  },
};

// ============ SETTINGS API ============
export const settingsAPI = {
  get: async () => {
    return apiCall('/settings', {}, true);
  },
  
  update: async (settings: {
    upiId?: string;
    qrCodeUrl?: string;
    phoneNumber?: string;
    bundleDiscounts?: { courses: number; discount: number }[];
    festivalDiscount?: { enabled: boolean; percentage: number; name: string };
    freeTrialHours?: number;
    freeVideosCount?: number;
  }) => {
    return apiCall('/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

// ============ ADMIN DASHBOARD API ============
export const adminAPI = {
  getDashboardStats: async () => {
    return apiCall('/admin/dashboard');
  },
  
  getRecentPayments: async () => {
    return apiCall('/admin/recent-payments');
  },
  
  getRecentUsers: async () => {
    return apiCall('/admin/recent-users');
  },
};

export default {
  auth: authAPI,
  courses: coursesAPI,
  payments: paymentsAPI,
  users: usersAPI,
  quiz: quizAPI,
  certificates: certificatesAPI,
  liveClasses: liveClassesAPI,
  discussions: discussionsAPI,
  settings: settingsAPI,
  admin: adminAPI,
};

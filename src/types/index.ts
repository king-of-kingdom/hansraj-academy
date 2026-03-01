export interface Course {
  id: string;
  title: string;
  description: string;
  instructor: string;
  price: number;
  originalPrice: number;
  thumbnail: string;
  category: string;
  language: string;
  level: string;
  duration: string;
  videos: Video[];
  isPublished: boolean;
  enrollmentCount?: number;
  rating?: number;
  createdAt?: string;
}

export interface Video {
  id: string;
  title: string;
  youtubeUrl: string;
  duration: string;
  isFree: boolean;
  order: number;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'student' | 'admin';
  enrolledCourses: EnrolledCourse[];
  referralCode: string;
  referredBy?: string;
  createdAt: string;
}

export interface EnrolledCourse {
  courseId: string;
  enrolledAt: string;
  isUnlocked: boolean;
  progress: number;
  completedVideos: string[];
  paymentStatus: 'pending' | 'verified' | 'rejected';
  transactionId?: string;
}

export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  questions: Question[];
  passingScore: number;
  timeLimit: number;
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface Certificate {
  id: string;
  courseId: string;
  userId: string;
  issuedAt: string;
  score: number;
}

export interface LiveClass {
  id: string;
  title: string;
  courseId: string;
  scheduledAt: string;
  meetLink: string;
  meetingLink?: string;
  description: string;
  duration?: number;
  platform?: string;
}

export interface Discussion {
  id: string;
  courseId: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
  replies: Reply[];
}

export interface Reply {
  id: string;
  userId: string;
  userName: string;
  message: string;
  createdAt: string;
}

export interface PaymentRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  courseIds: string[];
  totalAmount: number;
  discountApplied: number;
  transactionId: string;
  status: 'pending' | 'verified' | 'rejected';
  createdAt: string;
}

export interface BundleDiscount {
  courseCount: number;
  discountPercent: number;
}

export interface SiteSettings {
  bundleDiscounts: BundleDiscount[];
  festivalDiscount: {
    enabled: boolean;
    name: string;
    percent: number;
    endDate?: string;
  };
  qrCodeImage: string;
  qrCodeUrl?: string;
  upiId: string;
  phoneNumber: string;
  freeVideosCount?: number;
}

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { coursesAPI, settingsAPI, liveClassesAPI } from '../services/api';

interface Course {
  _id: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  price: number;
  thumbnail: string;
  videos: {
    _id: string;
    title: string;
    youtubeUrl: string;
    duration: string;
    isFree: boolean;
  }[];
  isActive: boolean;
  createdAt: string;
}

interface Settings {
  upiId: string;
  qrCodeUrl: string;
  phoneNumber: string;
  bundleDiscounts: { courses: number; discount: number }[];
  festivalDiscount: { enabled: boolean; percentage: number; name: string };
  freeVideosCount: number;
}

interface LiveClass {
  _id: string;
  title: string;
  description: string;
  courseId: string;
  scheduledAt: string;
  duration: number;
  meetingLink: string;
  platform: string;
  status: string;
}

interface DataContextType {
  courses: Course[];
  settings: Settings | null;
  liveClasses: LiveClass[];
  loading: boolean;
  error: string | null;
  refreshCourses: () => Promise<void>;
  refreshSettings: () => Promise<void>;
  refreshLiveClasses: () => Promise<void>;
  refreshAll: () => Promise<void>;
  isBackendConnected: boolean;
}

const DataContext = createContext<DataContextType | null>(null);

// Default settings when backend is not connected
const defaultSettings: Settings = {
  upiId: 'hansrajeducations@paytm',
  qrCodeUrl: '',
  phoneNumber: '+91 79034 21482',
  bundleDiscounts: [
    { courses: 1, discount: 10 },
    { courses: 2, discount: 20 },
    { courses: 3, discount: 30 },
    { courses: 4, discount: 40 },
    { courses: 5, discount: 50 },
    { courses: 6, discount: 60 },
  ],
  festivalDiscount: { enabled: false, percentage: 0, name: '' },
  freeVideosCount: 2,
};

// Default courses when backend is not connected
const defaultCourses: Course[] = [
  {
    _id: '1',
    id: '1',
    title: 'Excel Basics & Advanced',
    description: 'Learn Excel from scratch to advanced level. Master formulas, pivot tables, charts, and data analysis.',
    category: 'MS Office',
    price: 499,
    thumbnail: 'https://images.unsplash.com/photo-1537432376149-e84978a77d2b?w=400',
    videos: [
      { _id: 'v1', title: 'Introduction to Excel', youtubeUrl: 'https://youtube.com/watch?v=demo1', duration: '15:30', isFree: true },
      { _id: 'v2', title: 'Basic Formulas', youtubeUrl: 'https://youtube.com/watch?v=demo2', duration: '20:45', isFree: true },
      { _id: 'v3', title: 'Advanced Formulas', youtubeUrl: 'https://youtube.com/watch?v=demo3', duration: '25:00', isFree: false },
      { _id: 'v4', title: 'Pivot Tables', youtubeUrl: 'https://youtube.com/watch?v=demo4', duration: '30:00', isFree: false },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '2',
    id: '2',
    title: 'MS Word Complete Course',
    description: 'Master Microsoft Word - Document formatting, tables, mail merge, and professional document creation.',
    category: 'MS Office',
    price: 399,
    thumbnail: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=400',
    videos: [
      { _id: 'v5', title: 'Getting Started with Word', youtubeUrl: 'https://youtube.com/watch?v=demo5', duration: '12:00', isFree: true },
      { _id: 'v6', title: 'Text Formatting', youtubeUrl: 'https://youtube.com/watch?v=demo6', duration: '18:30', isFree: true },
      { _id: 'v7', title: 'Tables and Graphics', youtubeUrl: 'https://youtube.com/watch?v=demo7', duration: '22:00', isFree: false },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '3',
    id: '3',
    title: 'PowerPoint Mastery',
    description: 'Create stunning presentations with animations, transitions, and professional design techniques.',
    category: 'MS Office',
    price: 349,
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400',
    videos: [
      { _id: 'v8', title: 'PowerPoint Basics', youtubeUrl: 'https://youtube.com/watch?v=demo8', duration: '14:00', isFree: true },
      { _id: 'v9', title: 'Slide Design', youtubeUrl: 'https://youtube.com/watch?v=demo9', duration: '20:00', isFree: true },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '4',
    id: '4',
    title: 'Adobe Photoshop',
    description: 'Learn photo editing, graphic design, and digital art creation with Photoshop.',
    category: 'Design',
    price: 699,
    thumbnail: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400',
    videos: [
      { _id: 'v10', title: 'Photoshop Interface', youtubeUrl: 'https://youtube.com/watch?v=demo10', duration: '16:00', isFree: true },
      { _id: 'v11', title: 'Basic Tools', youtubeUrl: 'https://youtube.com/watch?v=demo11', duration: '25:00', isFree: true },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '5',
    id: '5',
    title: 'Python Programming',
    description: 'Complete Python course from basics to advanced. Learn programming, automation, and data analysis.',
    category: 'Programming',
    price: 799,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400',
    videos: [
      { _id: 'v12', title: 'Introduction to Python', youtubeUrl: 'https://youtube.com/watch?v=demo12', duration: '20:00', isFree: true },
      { _id: 'v13', title: 'Variables and Data Types', youtubeUrl: 'https://youtube.com/watch?v=demo13', duration: '28:00', isFree: true },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '6',
    id: '6',
    title: 'HTML Mastery',
    description: 'Learn HTML5 from scratch. Build the foundation for web development.',
    category: 'Web Development',
    price: 299,
    thumbnail: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400',
    videos: [
      { _id: 'v14', title: 'What is HTML?', youtubeUrl: 'https://youtube.com/watch?v=demo14', duration: '10:00', isFree: true },
      { _id: 'v15', title: 'HTML Tags', youtubeUrl: 'https://youtube.com/watch?v=demo15', duration: '22:00', isFree: true },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '7',
    id: '7',
    title: 'CSS Mastery',
    description: 'Master CSS3 styling, flexbox, grid, animations, and responsive design.',
    category: 'Web Development',
    price: 349,
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400',
    videos: [
      { _id: 'v16', title: 'CSS Basics', youtubeUrl: 'https://youtube.com/watch?v=demo16', duration: '15:00', isFree: true },
      { _id: 'v17', title: 'Selectors and Properties', youtubeUrl: 'https://youtube.com/watch?v=demo17', duration: '20:00', isFree: true },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
  {
    _id: '8',
    id: '8',
    title: 'Computer Hardware',
    description: 'Learn computer hardware, assembly, troubleshooting, and maintenance.',
    category: 'Hardware',
    price: 599,
    thumbnail: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=400',
    videos: [
      { _id: 'v18', title: 'Computer Components', youtubeUrl: 'https://youtube.com/watch?v=demo18', duration: '18:00', isFree: true },
      { _id: 'v19', title: 'CPU and RAM', youtubeUrl: 'https://youtube.com/watch?v=demo19', duration: '24:00', isFree: true },
    ],
    isActive: true,
    createdAt: new Date().toISOString(),
  },
];

export const DataProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [courses, setCourses] = useState<Course[]>(defaultCourses);
  const [settings, setSettings] = useState<Settings | null>(defaultSettings);
  const [liveClasses, setLiveClasses] = useState<LiveClass[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  const refreshCourses = useCallback(async () => {
    try {
      const data = await coursesAPI.getAll();
      if (data && Array.isArray(data)) {
        setCourses(data.map((c: Course) => ({ ...c, id: c._id })));
        setIsBackendConnected(true);
      }
    } catch (err) {
      console.log('Backend not connected, using local data');
      setIsBackendConnected(false);
      // Keep using default courses
    }
  }, []);

  const refreshSettings = useCallback(async () => {
    try {
      const data = await settingsAPI.get();
      if (data) {
        setSettings(data);
        setIsBackendConnected(true);
      }
    } catch (err) {
      console.log('Backend not connected, using default settings');
      setIsBackendConnected(false);
      // Keep using default settings
    }
  }, []);

  const refreshLiveClasses = useCallback(async () => {
    try {
      const data = await liveClassesAPI.getAll();
      if (data && Array.isArray(data)) {
        setLiveClasses(data);
        setIsBackendConnected(true);
      }
    } catch (err) {
      console.log('Backend not connected');
      setIsBackendConnected(false);
    }
  }, []);

  const refreshAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      await Promise.all([
        refreshCourses(),
        refreshSettings(),
        refreshLiveClasses(),
      ]);
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  }, [refreshCourses, refreshSettings, refreshLiveClasses]);

  // Initial load
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  // Refresh data periodically (every 30 seconds) for real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      refreshAll();
    }, 30000);

    return () => clearInterval(interval);
  }, [refreshAll]);

  return (
    <DataContext.Provider
      value={{
        courses,
        settings,
        liveClasses,
        loading,
        error,
        refreshCourses,
        refreshSettings,
        refreshLiveClasses,
        refreshAll,
        isBackendConnected,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

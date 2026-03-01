import { Course } from '../types';

export const fallbackCourses: Course[] = [
  {
    id: 'course-excel-001',
    title: 'Microsoft Excel Mastery',
    description: 'Complete Excel course from basics to advanced. Learn formulas, pivot tables, charts, VLOOKUP, macros and more.',
    instructor: 'Amit Sir',
    price: 999,
    originalPrice: 1999,
    thumbnail: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop',
    category: 'MS Office',
    language: 'Hindi',
    level: 'Beginner to Advanced',
    duration: '15+ Hours',
    enrollmentCount: 1250,
    rating: 4.8,
    isPublished: true,
    videos: [
      { id: 'v1', title: 'Introduction to Excel', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '15:30', isFree: true, order: 1 },
      { id: 'v2', title: 'Basic Formulas', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '22:45', isFree: true, order: 2 },
      { id: 'v3', title: 'Advanced Formulas', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '28:00', isFree: false, order: 3 },
      { id: 'v4', title: 'Pivot Tables', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '35:00', isFree: false, order: 4 },
      { id: 'v5', title: 'Charts and Graphs', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '25:00', isFree: false, order: 5 }
    ]
  },
  {
    id: 'course-word-002',
    title: 'Microsoft Word Complete',
    description: 'Master MS Word from scratch. Learn document formatting, mail merge, templates, and professional document creation.',
    instructor: 'Amit Sir',
    price: 799,
    originalPrice: 1499,
    thumbnail: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=400&h=250&fit=crop',
    category: 'MS Office',
    language: 'Hindi',
    level: 'Beginner to Advanced',
    duration: '12+ Hours',
    enrollmentCount: 980,
    rating: 4.7,
    isPublished: true,
    videos: [
      { id: 'v1', title: 'Getting Started with Word', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '12:00', isFree: true, order: 1 },
      { id: 'v2', title: 'Text Formatting', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '18:30', isFree: true, order: 2 },
      { id: 'v3', title: 'Page Layout', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '20:00', isFree: false, order: 3 }
    ]
  },
  {
    id: 'course-ppt-003',
    title: 'PowerPoint Professional',
    description: 'Create stunning presentations with PowerPoint. Learn animations, transitions, master slides, and presentation design.',
    instructor: 'Amit Sir',
    price: 699,
    originalPrice: 1299,
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop',
    category: 'MS Office',
    language: 'Hindi',
    level: 'Beginner to Advanced',
    duration: '10+ Hours',
    enrollmentCount: 750,
    rating: 4.6,
    isPublished: true,
    videos: [
      { id: 'v1', title: 'PowerPoint Basics', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '14:00', isFree: true, order: 1 },
      { id: 'v2', title: 'Creating Slides', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '20:00', isFree: true, order: 2 },
      { id: 'v3', title: 'Animations', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '25:00', isFree: false, order: 3 }
    ]
  },
  {
    id: 'course-photoshop-004',
    title: 'Adobe Photoshop Complete',
    description: 'Learn photo editing, graphic design, and digital art with Adobe Photoshop. From basics to professional techniques.',
    instructor: 'Amit Sir',
    price: 1499,
    originalPrice: 2999,
    thumbnail: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=250&fit=crop',
    category: 'Graphics',
    language: 'Hindi',
    level: 'Beginner to Advanced',
    duration: '20+ Hours',
    enrollmentCount: 650,
    rating: 4.9,
    isPublished: true,
    videos: [
      { id: 'v1', title: 'Photoshop Interface', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '18:00', isFree: true, order: 1 },
      { id: 'v2', title: 'Layers Explained', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '25:00', isFree: true, order: 2 },
      { id: 'v3', title: 'Selection Tools', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '30:00', isFree: false, order: 3 }
    ]
  },
  {
    id: 'course-python-005',
    title: 'Python Programming',
    description: 'Complete Python course for beginners. Learn programming fundamentals, data structures, and build real projects.',
    instructor: 'Amit Sir',
    price: 1299,
    originalPrice: 2499,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop',
    category: 'Programming',
    language: 'Hindi',
    level: 'Beginner to Advanced',
    duration: '25+ Hours',
    enrollmentCount: 890,
    rating: 4.8,
    isPublished: true,
    videos: [
      { id: 'v1', title: 'Introduction to Python', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '20:00', isFree: true, order: 1 },
      { id: 'v2', title: 'Variables and Data Types', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '25:00', isFree: true, order: 2 },
      { id: 'v3', title: 'Control Flow', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '30:00', isFree: false, order: 3 }
    ]
  },
  {
    id: 'course-htmlcss-006',
    title: 'HTML & CSS Web Development',
    description: 'Learn to build beautiful websites from scratch. Master HTML5 and CSS3 with practical projects.',
    instructor: 'Amit Sir',
    price: 899,
    originalPrice: 1799,
    thumbnail: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=250&fit=crop',
    category: 'Web Development',
    language: 'Hindi',
    level: 'Beginner',
    duration: '18+ Hours',
    enrollmentCount: 1100,
    rating: 4.7,
    isPublished: true,
    videos: [
      { id: 'v1', title: 'HTML Basics', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '22:00', isFree: true, order: 1 },
      { id: 'v2', title: 'HTML Elements', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '28:00', isFree: true, order: 2 },
      { id: 'v3', title: 'CSS Styling', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '32:00', isFree: false, order: 3 }
    ]
  },
  {
    id: 'course-hardware-007',
    title: 'Computer Hardware Fundamentals',
    description: 'Understand computer hardware components, assembly, troubleshooting, and maintenance.',
    instructor: 'Amit Sir',
    price: 599,
    originalPrice: 1199,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop',
    category: 'Hardware',
    language: 'Hindi',
    level: 'Beginner',
    duration: '10+ Hours',
    enrollmentCount: 450,
    rating: 4.5,
    isPublished: true,
    videos: [
      { id: 'v1', title: 'Computer Components', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '20:00', isFree: true, order: 1 },
      { id: 'v2', title: 'CPU and RAM', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '25:00', isFree: true, order: 2 },
      { id: 'v3', title: 'Storage Devices', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '22:00', isFree: false, order: 3 }
    ]
  },
  {
    id: 'course-msoffice-008',
    title: 'Complete MS Office Bundle',
    description: 'Master all MS Office applications - Word, Excel, PowerPoint, and more in this comprehensive bundle.',
    instructor: 'Amit Sir',
    price: 1999,
    originalPrice: 3999,
    thumbnail: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=400&h=250&fit=crop',
    category: 'MS Office',
    language: 'Hindi',
    level: 'Beginner to Advanced',
    duration: '40+ Hours',
    enrollmentCount: 2100,
    rating: 4.9,
    isPublished: true,
    videos: [
      { id: 'v1', title: 'MS Office Overview', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '15:00', isFree: true, order: 1 },
      { id: 'v2', title: 'Word Essentials', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '30:00', isFree: true, order: 2 },
      { id: 'v3', title: 'Excel Essentials', youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', duration: '35:00', isFree: false, order: 3 }
    ]
  }
];

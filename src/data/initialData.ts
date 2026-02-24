import { Course, Quiz, SiteSettings } from '../types';

export const initialCourses: Course[] = [
  {
    id: 'course-1',
    title: 'Excel Basics & Advanced',
    description: 'Complete MS Excel course from Basic to Advanced. Learn data entry, formulas, pivot tables, charts, macros and more. Perfect skill for any job!',
    instructor: 'Amit Sir',
    price: 499,
    originalPrice: 999,
    thumbnail: 'https://images.unsplash.com/photo-1632239776255-0a7f24814df2?w=400&h=250&fit=crop',
    category: 'MS Office',
    language: 'Hindi',
    level: 'Beginner to Advanced',
    duration: '15+ Hours',
    isPublished: true,
    createdAt: new Date().toISOString(),
    videos: [
      { id: 'v1-1', title: 'Excel Introduction - Getting Started', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15:30', isFree: true, order: 1 },
      { id: 'v1-2', title: 'Understanding Excel Interface', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20:15', isFree: true, order: 2 },
      { id: 'v1-3', title: 'Basic Formulas - SUM, AVERAGE', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', isFree: true, order: 3 },
      { id: 'v1-4', title: 'VLOOKUP & HLOOKUP Mastery', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30:00', isFree: false, order: 4 },
      { id: 'v1-5', title: 'Pivot Tables Complete Guide', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '35:00', isFree: false, order: 5 },
      { id: 'v1-6', title: 'Creating Charts & Graphs', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', isFree: false, order: 6 },
    ]
  },
  {
    id: 'course-2',
    title: 'MS Word Complete Course',
    description: 'Learn to create professional documents. Resume, Letters, Reports, Mail Merge - everything included! Essential skill for office work.',
    instructor: 'Amit Sir',
    price: 399,
    originalPrice: 799,
    thumbnail: 'https://images.unsplash.com/photo-1542435503-956c469947f6?w=400&h=250&fit=crop',
    category: 'MS Office',
    language: 'Hindi',
    level: 'Beginner to Advanced',
    duration: '10+ Hours',
    isPublished: true,
    createdAt: new Date().toISOString(),
    videos: [
      { id: 'v2-1', title: 'MS Word Introduction', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '12:00', isFree: true, order: 1 },
      { id: 'v2-2', title: 'Document Formatting', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '18:00', isFree: true, order: 2 },
      { id: 'v2-3', title: 'Tables & Lists', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20:00', isFree: false, order: 3 },
      { id: 'v2-4', title: 'Mail Merge Tutorial', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', isFree: false, order: 4 },
    ]
  },
  {
    id: 'course-3',
    title: 'MS PowerPoint Mastery',
    description: 'Learn to create professional presentations. Animations, transitions, templates - everything included! Impress your audience every time.',
    instructor: 'Amit Sir',
    price: 399,
    originalPrice: 799,
    thumbnail: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=250&fit=crop',
    category: 'MS Office',
    language: 'Hindi',
    level: 'Beginner to Advanced',
    duration: '8+ Hours',
    isPublished: true,
    createdAt: new Date().toISOString(),
    videos: [
      { id: 'v3-1', title: 'PowerPoint Basics', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15:00', isFree: true, order: 1 },
      { id: 'v3-2', title: 'Slide Design Tips', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20:00', isFree: true, order: 2 },
      { id: 'v3-3', title: 'Animations & Transitions', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '22:00', isFree: false, order: 3 },
    ]
  },
  {
    id: 'course-4',
    title: 'Adobe Photoshop Complete',
    description: 'Become a master of photo editing. From basic editing to advanced manipulation. Essential for graphics design!',
    instructor: 'Amit Sir',
    price: 799,
    originalPrice: 1499,
    thumbnail: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=400&h=250&fit=crop',
    category: 'Graphics',
    language: 'Hindi',
    level: 'Beginner to Advanced',
    duration: '20+ Hours',
    isPublished: true,
    createdAt: new Date().toISOString(),
    videos: [
      { id: 'v4-1', title: 'Photoshop Interface', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '18:00', isFree: true, order: 1 },
      { id: 'v4-2', title: 'Basic Tools Overview', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', isFree: true, order: 2 },
      { id: 'v4-3', title: 'Layers & Masks', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30:00', isFree: false, order: 3 },
      { id: 'v4-4', title: 'Photo Retouching', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '35:00', isFree: false, order: 4 },
    ]
  },
  {
    id: 'course-5',
    title: 'Python Programming',
    description: 'Step into the world of coding! Learn Python and become a programmer. Most demanding skill for jobs!',
    instructor: 'Amit Sir',
    price: 999,
    originalPrice: 1999,
    thumbnail: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?w=400&h=250&fit=crop',
    category: 'Programming',
    language: 'Hindi',
    level: 'Beginner',
    duration: '25+ Hours',
    isPublished: true,
    createdAt: new Date().toISOString(),
    videos: [
      { id: 'v5-1', title: 'What is Python?', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15:00', isFree: true, order: 1 },
      { id: 'v5-2', title: 'Python Installation', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '12:00', isFree: true, order: 2 },
      { id: 'v5-3', title: 'Variables & Data Types', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '28:00', isFree: false, order: 3 },
      { id: 'v5-4', title: 'Loops & Conditions', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '35:00', isFree: false, order: 4 },
    ]
  },
  {
    id: 'course-6',
    title: 'HTML Mastery',
    description: 'Start your web development journey! Learn to build websites with HTML. First step to becoming a frontend developer.',
    instructor: 'Amit Sir',
    price: 299,
    originalPrice: 599,
    thumbnail: 'https://images.unsplash.com/photo-1621839673705-6617adf9e890?w=400&h=250&fit=crop',
    category: 'Web Development',
    language: 'Hindi',
    level: 'Beginner',
    duration: '8+ Hours',
    isPublished: true,
    createdAt: new Date().toISOString(),
    videos: [
      { id: 'v6-1', title: 'HTML Introduction', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '15:00', isFree: true, order: 1 },
      { id: 'v6-2', title: 'HTML Tags & Elements', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '22:00', isFree: true, order: 2 },
      { id: 'v6-3', title: 'Forms & Inputs', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', isFree: false, order: 3 },
    ]
  },
  {
    id: 'course-7',
    title: 'CSS Mastery',
    description: 'Learn to make websites beautiful! With CSS styling your websites will look professional and modern.',
    instructor: 'Amit Sir',
    price: 399,
    originalPrice: 799,
    thumbnail: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?w=400&h=250&fit=crop',
    category: 'Web Development',
    language: 'Hindi',
    level: 'Beginner to Intermediate',
    duration: '12+ Hours',
    isPublished: true,
    createdAt: new Date().toISOString(),
    videos: [
      { id: 'v7-1', title: 'CSS Basics', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '18:00', isFree: true, order: 1 },
      { id: 'v7-2', title: 'Selectors & Properties', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', isFree: true, order: 2 },
      { id: 'v7-3', title: 'Flexbox Complete', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '30:00', isFree: false, order: 3 },
      { id: 'v7-4', title: 'CSS Grid Layout', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '28:00', isFree: false, order: 4 },
    ]
  },
  {
    id: 'course-8',
    title: 'Computer Hardware Basics',
    description: 'Understand computer hardware and learn repair techniques. Become a technician or fix your own computer!',
    instructor: 'Amit Sir',
    price: 599,
    originalPrice: 1199,
    thumbnail: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=400&h=250&fit=crop',
    category: 'Hardware',
    language: 'Hindi',
    level: 'Beginner',
    duration: '15+ Hours',
    isPublished: true,
    createdAt: new Date().toISOString(),
    videos: [
      { id: 'v8-1', title: 'Computer Parts Introduction', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '20:00', isFree: true, order: 1 },
      { id: 'v8-2', title: 'Motherboard Explained', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '25:00', isFree: true, order: 2 },
      { id: 'v8-3', title: 'RAM & Storage', youtubeUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ', duration: '22:00', isFree: false, order: 3 },
    ]
  }
];

export const initialQuizzes: Quiz[] = [
  {
    id: 'quiz-1',
    courseId: 'course-1',
    title: 'Excel Certification Test',
    passingScore: 70,
    timeLimit: 30,
    questions: [
      {
        id: 'q1',
        question: 'What is the purpose of SUM function in Excel?',
        options: ['Add numbers', 'Subtract numbers', 'Multiply numbers', 'Divide numbers'],
        correctAnswer: 0
      },
      {
        id: 'q2',
        question: 'What is the full form of VLOOKUP?',
        options: ['Vertical Lookup', 'Value Lookup', 'Variable Lookup', 'Vector Lookup'],
        correctAnswer: 0
      },
      {
        id: 'q3',
        question: 'What is Pivot Table used for?',
        options: ['Data Analysis', 'Photo Editing', 'Video Making', 'Gaming'],
        correctAnswer: 0
      },
      {
        id: 'q4',
        question: 'What is the file extension for Excel files?',
        options: ['.xlsx', '.docx', '.pptx', '.pdf'],
        correctAnswer: 0
      },
      {
        id: 'q5',
        question: 'In a cell address, where is the row number located?',
        options: ['After the letter', 'Before the letter', 'Both places', 'Nowhere'],
        correctAnswer: 0
      }
    ]
  }
];

export const initialSettings: SiteSettings = {
  bundleDiscounts: [
    { courseCount: 1, discountPercent: 10 },
    { courseCount: 2, discountPercent: 20 },
    { courseCount: 3, discountPercent: 30 },
    { courseCount: 4, discountPercent: 40 },
    { courseCount: 5, discountPercent: 50 },
    { courseCount: 6, discountPercent: 60 }
  ],
  festivalDiscount: {
    enabled: false,
    name: 'New Year Sale',
    percent: 25,
    endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  qrCodeImage: 'https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=upi://pay?pa=hansrajeducations@upi',
  upiId: 'hansrajeducations@upi',
  phoneNumber: '+91 79034 21482'
};

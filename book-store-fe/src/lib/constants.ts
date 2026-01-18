export const CATEGORIES = ['Technology', 'Science', 'History', 'Fantasy', 'Biography'] as const;

export const ITEMS_PER_PAGE = 12;

export const PRICE_RANGES = [
  { label: 'All Prices', min: undefined, max: undefined },
  { label: 'Under $10', min: 0, max: 10 },
  { label: '$10 - $20', min: 10, max: 20 },
  { label: '$20 - $50', min: 20, max: 50 },
  { label: 'Over $50', min: 50, max: undefined },
] as const;

export const AUTH_COOKIE_NAME = 'auth-token';
export const USER_COOKIE_NAME = 'user-data';

export const STATIC_USER = {
  id: '1',
  email: 'admin@books.com',
  password: 'admin123',
  name: 'Admin User',
} as const;

export const STATIC_CATEGORIES = [
  { id: 1, name: 'Technology' },
  { id: 2, name: 'Science' },
  { id: 3, name: 'History' },
  { id: 4, name: 'Fantasy' },
  { id: 5, name: 'Biography' },
] as const;

export const STATIC_BOOKS = [
  {
    id: '1',
    title: 'The Pragmatic Programmer',
    description: 'Your Journey to Mastery in Software Development',
    authorId: '1',
    categoryId: 1,
    price: 49.99,
    thumbnail: 'https://images.unsplash.com/photo-1621944190310-e3cca1564bd7?w=400&h=600&fit=crop',
    createdAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    title: 'Clean Code',
    description: 'A Handbook of Agile Software Craftsmanship',
    authorId: '2',
    categoryId: 1,
    price: 44.99,
    thumbnail: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=600&fit=crop',
    createdAt: new Date('2024-01-02'),
  },
  {
    id: '3',
    title: 'The Selfish Gene',
    description: 'A Look at Evolutionary Biology',
    authorId: '3',
    categoryId: 2,
    price: 19.99,
    thumbnail: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    createdAt: new Date('2024-01-03'),
  },
  {
    id: '4',
    title: 'A Brief History of Time',
    description: 'From the Big Bang to Black Holes',
    authorId: '4',
    categoryId: 2,
    price: 24.99,
    thumbnail: 'https://images.unsplash.com/photo-1589998059171-988d887df646?w=400&h=600&fit=crop',
    createdAt: new Date('2024-01-04'),
  },
  {
    id: '5',
    title: '1984',
    description: 'A Dystopian Novel',
    authorId: '5',
    categoryId: 4,
    price: 16.99,
    thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    createdAt: new Date('2024-01-05'),
  },
  {
    id: '6',
    title: 'The Great Gatsby',
    description: 'A Classic American Novel',
    authorId: '6',
    categoryId: 4,
    price: 14.99,
    thumbnail: 'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=600&fit=crop',
    createdAt: new Date('2024-01-06'),
  },
  {
    id: '7',
    title: 'Steve Jobs',
    description: 'The Exclusive Biography',
    authorId: '7',
    categoryId: 5,
    price: 35.99,
    thumbnail: 'https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=400&h=600&fit=crop',
    createdAt: new Date('2024-01-07'),
  },
  {
    id: '8',
    title: 'The Story of Philosophy',
    description: 'The Lives and Opinions of Greater Philosophers',
    authorId: '8',
    categoryId: 3,
    price: 28.99,
    thumbnail: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=400&h=600&fit=crop',
    createdAt: new Date('2024-01-08'),
  },
] as const;

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  BOOKS: '/books',
  MY_BOOKS: '/my-books',
  BOOK_DETAILS: '/books/[id]',
  NEW_BOOK: '/books/new',
  EDIT_BOOK: '/books/[id]/edit',
  PROFILE: '/profile',
  EDIT_PROFILE: '/profile/edit',
} as const;
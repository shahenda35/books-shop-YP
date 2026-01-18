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
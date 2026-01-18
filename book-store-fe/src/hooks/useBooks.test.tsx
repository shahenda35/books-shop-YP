import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useBook, useBooks, useMyBooks } from './useBooks';
import apiClient from '@/lib/apiClient';
import { Book } from '@/types';

vi.mock('@/lib/apiClient', () => {
  return {
    default: {
      get: vi.fn(),
      delete: vi.fn(),
    },
  };
});

const mockedApi = apiClient as unknown as {
  get: ReturnType<typeof vi.fn>;
  delete: ReturnType<typeof vi.fn>;
};

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

afterEach(() => {
  vi.clearAllMocks();
});

describe('useBooks hooks', () => {
  const book: Book = {
    id: 1,
    title: 'React Patterns',
    description: 'A guide',
    price: 20,
    thumbnail: null,
    author: 'Adam',
    category: 'Tech',
  };

  it('fetches books with query params applied', async () => {
    const paginated = {
      success: true,
      data: [book],
      pagination: { page: 2, limit: 5, total: 1, pages: 1 },
    };

    mockedApi.get.mockResolvedValueOnce({ data: { success: true, data: paginated } });

    const wrapper = createWrapper();
    const { result } = renderHook(
      () =>
        useBooks({
          page: 2,
          limit: 5,
          search: 'react',
          categoryId: 3,
          priceRange: '10-20',
          sortOrder: 'asc',
        }),
      { wrapper },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApi.get).toHaveBeenCalledWith(
      '/api/books?page=2&limit=5&search=react&categoryId=3&minPrice=10&maxPrice=20&sort=asc',
    );
    expect(result.current.data).toEqual(paginated);
  });

  it('fetches a single book by id', async () => {
    mockedApi.get.mockResolvedValueOnce({ data: { success: true, data: book } });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useBook('123'), { wrapper });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApi.get).toHaveBeenCalledWith('/api/books/123');
    expect(result.current.data).toEqual(book);
  });

  it('fetches my books list', async () => {
    const paginated = {
      success: true,
      data: [book],
      pagination: { page: 1, limit: 12, total: 1, pages: 1 },
    };

    mockedApi.get.mockResolvedValueOnce({ data: { success: true, data: paginated } });

    const wrapper = createWrapper();
    const { result } = renderHook(() => useMyBooks({ search: 'react', sortOrder: 'desc' }), {
      wrapper,
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(mockedApi.get).toHaveBeenCalledWith('/api/my-books?search=react&sort=desc');
    expect(result.current.data).toEqual(paginated);
  });
});

import { FilterValues } from '@/components/BookFilters';
import { Book, PaginatedResponse } from '@/types';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '@/lib/apiClient';

interface UseBooksParams extends Partial<FilterValues> {
  page?: number;
  limit?: number;
}

export function useBooks(params: UseBooksParams = {}) {
  return useQuery({
    queryKey: ['books', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.categoryId && params.categoryId !== 'all') 
        searchParams.append('categoryId', String(params.categoryId));
      if (params.priceRange && params.priceRange !== 'all') {
        const [min, max] = params.priceRange.split('-');
        if (min) searchParams.append('minPrice', min);
        if (max) searchParams.append('maxPrice', max);
      }
      if (params.sortOrder) searchParams.append('sort', params.sortOrder);

     const response = await apiClient.get<{ success: boolean; data: PaginatedResponse<Book> }>(
        `/api/books?${searchParams}`,
      );
      return response.data.data;
    
    },
  });
}

export function useBook(id: string) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: async () => {
      const response = await apiClient.get<{ success: boolean; data: Book }>(`/api/books/${id}`);
      return response.data.data;
    },
    enabled: !!id,
  });
}

export function useMyBooks(params: UseBooksParams = {}) {
  return useQuery({
    queryKey: ['my-books', params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();

      if (params.page) searchParams.append('page', params.page.toString());
      if (params.limit) searchParams.append('limit', params.limit.toString());
      if (params.search) searchParams.append('search', params.search);
      if (params.categoryId && params.categoryId !== 'all') 
        searchParams.append('categoryId', String(params.categoryId));
      if (params.priceRange && params.priceRange !== 'all') {
        const [min, max] = params.priceRange.split('-');
        if (min) searchParams.append('minPrice', min);
        if (max) searchParams.append('maxPrice', max);
      }
      if (params.sortOrder) searchParams.append('sort', params.sortOrder);

       const response = await apiClient.get<{ success: boolean; data: PaginatedResponse<Book> }>(
        `/api/my-books?${searchParams}`,
      );
      return response.data.data;
  
    },
  });
}

export function useDeleteBook() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      await apiClient.delete(`/api/books/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['my-books'] });
    },
  });
}

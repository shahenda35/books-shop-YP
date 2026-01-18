'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookCard } from '@/components/BookCard';
import { FilterValues, BookFilters } from '@/components/BookFilters';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useBooks } from '@/hooks/useBooks';
import { Book } from '@/types';

export default function BooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    categoryId: 'all',
    priceRange: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const handleFiltersChange = (newFilters: FilterValues) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };

  const { data, isLoading, error } = useBooks({
    page: currentPage,
    limit: 12,
    ...filters,
  });

  if (isLoading)
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loading size="lg" />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <p className="text-red-600 dark:text-red-400">Failed to load books. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );

  const books = data?.data || [];
  const totalPages = data?.pagination.pages || 1;

  return (
    <>
    <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
           <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Books Shop</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Browse and discover your next favorite book • {data?.pagination.total || 0} books
              available
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild>
              <Link href="/books/new">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Add New Book
              </Link>
            </Button>
          </div>
        </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Filters</h2>
        <BookFilters filters={filters} onFilterChange={handleFiltersChange} />
      </div>

      {books.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 px-4">
          <svg
            className="h-24 w-24 text-gray-300 dark:text-gray-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">No books found</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
            Try adjusting your filters or check back later
          </p>
        </div>
      ) : (
        <>
          <div>
            <div className="mb-6">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Showing <span className="font-semibold">{(currentPage - 1) * 12 + 1}</span> to{' '}
                <span className="font-semibold">
                  {Math.min(currentPage * 12, data?.pagination.total || 0)}
                </span>{' '}
                of <span className="font-semibold">{data?.pagination.total || 0}</span> books
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map((book: Book) => (
                <BookCard key={book.id} book={book} />
              ))}
            </div>
          </div>

          {totalPages > 1 && (
            <div className="mt-12 flex justify-center">
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700 w-full max-w-2xl">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={setCurrentPage}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
    </>  
      );}
      

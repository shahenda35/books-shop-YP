'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookCard } from '@/components/BookCard';
import { FilterValues, BookFilters } from '@/components/BookFilters';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useMyBooks, useDeleteBook } from '@/hooks/useBooks';
import { Book } from '@/types';

export default function MyBooksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    categoryId: 'all',
    priceRange: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data, isLoading, error } = useMyBooks({
    page: currentPage,
    limit: 8,
    ...filters,
  });
  const handleFiltersChange = (newFilters: FilterValues) => {
    setCurrentPage(1);
    setFilters(newFilters);
  };


  const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook();
  const { showToast } = useToast();

  const handleDelete = () => {
    if (!deleteId) return;

    deleteBook(deleteId, {
      onSuccess: () => {
        showToast('Book deleted successfully', 'success');
        setDeleteId(null);
      },
      onError: () => {
        showToast('Failed to delete book', 'error');
      },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loading size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-100 gap-4">
        <p className="text-red-600 dark:text-red-400">
          Failed to load your books. Please try again.
        </p>
        <Button onClick={() => window.location.reload()}>Retry</Button>
      </div>
    );
  }

  const books = data?.data || [];
  const totalPages = data?.pagination.pages || 1;

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">My Books</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage your personal book collection
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

        <BookFilters filters={filters} onFilterChange={handleFiltersChange} />

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-100 gap-4">
            <svg
              className="h-24 w-24 text-gray-400"
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
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              You haven&apos;t added any books yet
            </p>
            <Button asChild>
              <Link href="/books/new">Add Your First Book</Link>
            </Button>
          </div>
        ) : (
          <>
            <div>
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showing <span className="font-semibold">{(currentPage - 1) * 8 + 1}</span> to{' '}
                  <span className="font-semibold">
                    {Math.min(currentPage * 8, data?.pagination.total || 0)}
                  </span>{' '}
                  of <span className="font-semibold">{data?.pagination.total || 0}</span> books
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book: Book) => (
                  <BookCard key={book.id} book={book} showActions onDelete={setDeleteId} />
                ))}
              </div>
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <div className="bg-white dark:bg-gray-800 rounded-lg p-6 ">
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

      {/* Delete Confirmation Modal */}
      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Book">
        <div className="space-y-4">
          <p className="text-gray-600 dark:text-gray-400">
            Are you sure you want to delete this book? This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={isDeleting}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDelete} isLoading={isDeleting}>
              Delete
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}

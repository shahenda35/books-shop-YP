'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { BookCard } from '@/components/BookCard';
import { FilterValues, BookFilters } from '@/components/BookFilters';
import { Pagination } from '@/components/Pagination';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useBooks } from '@/hooks/useBooks';
import { Book } from '@/types';
import { logout } from '@/app/actions/auth';
import { useToast } from '@/components/ui/Toast';

export default function BooksPage() {
    const router = useRouter();
    const { showToast } = useToast();
    const [currentPage, setCurrentPage] = useState(1);
    const [filters, setFilters] = useState<FilterValues>({
        search: '',
        category: 'all',
        priceRange: 'all',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const { data, isLoading, error } = useBooks({
        page: currentPage,
        limit: 12,
        ...filters,
    });

    const handleLogout = async () => {
        try {
            const result = await logout();
            if (result.success) {
                router.push('/login');
            }
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

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
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Books Shop</h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Browse and discover your next favorite book
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button asChild variant="outline">
                        <Link href="/my-books">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                            </svg>
                            My Books
                        </Link>
                    </Button>
                    <Button variant="outline" onClick={handleLogout}>
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Logout
                    </Button>
                    <Button asChild>
                        <Link href="/books/new">
                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                            Add New Book
                        </Link>
                    </Button>
                </div>
            </div>

            <BookFilters onFilterChange={setFilters} />

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
                    <p className="text-gray-600 dark:text-gray-400 text-lg">No books found</p>
                    <p className="text-gray-500 dark:text-gray-500 text-sm">Try adjusting your filters</p>
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {books.map((book: Book) => (
                            <BookCard key={book.id} book={book} />
                        ))}
                    </div>                    {totalPages > 1 && (
                        <div className="mt-8">
                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={setCurrentPage}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
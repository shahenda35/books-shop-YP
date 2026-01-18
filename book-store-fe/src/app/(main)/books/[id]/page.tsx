'use client';

import { use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { Loading } from '@/components/ui/Loading';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useBook, useDeleteBook } from '@/hooks/useBooks';
import { formatPrice, formatDate } from '@/lib/utils';

export default function BookDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const router = useRouter();
    const { data: book, isLoading, error } = useBook(resolvedParams.id);
    const { mutate: deleteBook, isPending: isDeleting } = useDeleteBook();
    const { showToast } = useToast();
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const handleDelete = () => {
        deleteBook(resolvedParams.id, {
            onSuccess: () => {
                showToast('Book deleted successfully', 'success');
                router.push('/my-books');
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

    if (error || !book) {
        return (
            <div className="flex flex-col items-center justify-center min-h-100 gap-4">
                <p className="text-red-600 dark:text-red-400">Book not found</p>
                <Button asChild>
                    <Link href="/books">Back to Books</Link>
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="max-w-6xl mx-auto">
                <Button asChild variant="ghost" className="mb-6">
                    <Link href="/books">
                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                        </svg>
                        Back to Books
                    </Link>
                </Button>

                <Card>
                    <CardContent className="p-8">
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Book Cover */}
                            <div className="relative aspect-3/4 bg-gray-100 dark:bg-gray-700 rounded-lg overflow-hidden">
                                {book.thumbnail ? (
                                    <Image
                                        src={book.thumbnail}
                                        alt={book.title}
                                        fill
                                        className="object-cover"
                                        sizes="(max-width: 768px) 100vw, 50vw"
                                    />
                                ) : (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <svg className="h-32 w-32 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={1}
                                                d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                                            />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Book Details */}
                            <div className="flex flex-col gap-6">
                                <div>
                                    <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                                        {book.title}
                                    </h1>
                                    {book.author && (
                                        <p className="text-xl text-gray-600 dark:text-gray-400">by {book.author}</p>
                                    )}
                                </div>

                                <div className="flex items-center gap-4">
                                    <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                                        {formatPrice(book.price)}
                                    </span>
                                    {book.category && (
                                        <span className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                            {book.category}
                                        </span>
                                    )}
                                </div>

                                {book.description && (
                                    <div>
                                        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                                            Description
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                            {book.description}
                                        </p>
                                    </div>
                                )}

                                <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                    <p>
                                        <span className="font-medium">ID:</span> {book.id}
                                    </p>
                                    {book.createdAt && (
                                        <p>
                                            <span className="font-medium">Added:</span> {formatDate(book.createdAt)}
                                        </p>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                <div className="flex gap-3 mt-auto">
                                    <Button asChild className="flex-1">
                                        <Link href={`/books/${book.id}/edit`}>
                                            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                                />
                                            </svg>
                                            Edit Book
                                        </Link>
                                    </Button>
                                    <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
                                        <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                            />
                                        </svg>
                                        Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Delete Modal */}
            <Modal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                title="Delete Book"
            >
                <div className="space-y-4">
                    <p className="text-gray-600 dark:text-gray-400">
                        Are you sure you want to delete `{book.title}`? This action cannot be undone.
                    </p>
                    <div className="flex gap-3 justify-end">
                        <Button variant="outline" onClick={() => setShowDeleteModal(false)} disabled={isDeleting}>
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
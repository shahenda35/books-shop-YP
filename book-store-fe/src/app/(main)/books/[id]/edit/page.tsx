'use client';

import { BookForm } from '@/components/BookForm';
import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { useBook } from '@/hooks/useBooks';
import Link from 'next/link';
import { use } from 'react';

export default function EditBookPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: book, isLoading, error } = useBook(resolvedParams.id);

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
          <Link href="/my-books">Back to My Books</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <BookForm book={book} mode="edit" />
    </div>
  );
}

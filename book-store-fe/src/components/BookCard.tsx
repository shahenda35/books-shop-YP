'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { Book } from '@/types';
import { Card, CardContent, CardFooter } from './ui/Card';
import { Button } from './ui/Button';

interface BookCardProps {
  book: Book;
  onDelete?: (id: string) => void;
  showActions?: boolean;
}

export function BookCard({ book, onDelete, showActions = false }: BookCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <Link href={`/books/${book.id}`}>
        <div className="relative aspect-3/4 bg-gray-100 dark:bg-gray-700">
          {book.thumbnail ? (
            <Image
              src={book.thumbnail}
              alt={book.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="h-16 w-16 text-gray-400"
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
            </div>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/books/${book.id}`}>
          <h3 className="font-semibold text-lg text-gray-900 dark:text-gray-100 line-clamp-1 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
            {book.title}
          </h3>
        </Link>
        {book.author && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{book.author}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-blue-600 dark:text-blue-400">
            {formatPrice(book.price)}
          </span>
          {book.category && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
              {book.category}
            </span>
          )}
        </div>

        {book.description && (
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">
            {book.description}
          </p>
        )}
      </CardContent>{' '}
      {showActions && (
        <CardFooter className="flex gap-2 p-4 pt-0">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <Link href={`/books/${book.id}/edit`}>Edit</Link>
          </Button>
          <Button
            variant="danger"
            size="sm"
            className="flex-1"
            onClick={() => onDelete?.(String(book.id))}
          >
            Delete
          </Button>
        </CardFooter>
      )}
    </Card>
  );
}

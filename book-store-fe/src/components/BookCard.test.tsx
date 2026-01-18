import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookCard } from './BookCard';
import { Book } from '@/types';

const baseBook: Book = {
  id: 1,
  title: 'The Pragmatic Programmer',
  description: 'Classic software engineering book',
  price: 42,
  thumbnail: null,
  author: 'Andy Hunt',
  category: 'Technology',
};

describe('BookCard', () => {
  it('renders book info and formatted price', () => {
    render(<BookCard book={baseBook} />);

    expect(screen.getByText('The Pragmatic Programmer')).toBeInTheDocument();
    expect(screen.getByText('Andy Hunt')).toBeInTheDocument();
    expect(screen.getByText(/\$42\.00/)).toBeInTheDocument();
    expect(screen.getByText('Technology')).toBeInTheDocument();
  });

  it('shows actions and triggers delete when enabled', () => {
    const onDelete = vi.fn();

    render(<BookCard book={baseBook} showActions onDelete={onDelete} />);

    const deleteButton = screen.getByText('Delete');
    fireEvent.click(deleteButton);

    expect(onDelete).toHaveBeenCalledWith('1');
    expect(screen.getByText('Edit')).toBeInTheDocument();
  });
});

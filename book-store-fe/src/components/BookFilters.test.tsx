import React from 'react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, cleanup } from '@testing-library/react';
import { BookFilters } from './BookFilters';
import apiClient from '@/lib/apiClient';

vi.mock('@/lib/apiClient', () => {
  return {
    default: {
      get: vi.fn(),
    },
  };
});

const mockedApi = apiClient as unknown as { get: ReturnType<typeof vi.fn> };

afterEach(() => {
  cleanup();
  vi.clearAllMocks();
});

describe('BookFilters', () => {
  it('loads categories and renders options', async () => {
    mockedApi.get.mockResolvedValueOnce({
      data: { success: true, data: [{ id: 1, name: 'Fiction' }] },
    });

    const onFilterChange = vi.fn();
    render(<BookFilters onFilterChange={onFilterChange} />);

    fireEvent.click(screen.getByText('Filters'));

    await waitFor(() => expect(mockedApi.get).toHaveBeenCalledWith('/api/categories'));
    await waitFor(() => expect(screen.getByRole('option', { name: 'Fiction' })).toBeInTheDocument());
  });

  it('debounces search updates before notifying parent', async () => {
    mockedApi.get.mockResolvedValue({ data: { success: true, data: [] } });
    const onFilterChange = vi.fn();

    render(<BookFilters onFilterChange={onFilterChange} />);

    const [searchInput] = screen.getAllByPlaceholderText(/Search books/i);
    vi.useFakeTimers();
    fireEvent.change(searchInput, { target: { value: 'react' } });

    expect(onFilterChange).not.toHaveBeenCalled();

    vi.advanceTimersByTime(600);
    vi.runAllTimers();

    expect(onFilterChange).toHaveBeenCalledWith(
      expect.objectContaining({ search: 'react' }),
    );

    vi.useRealTimers();
  });

  it('resets filters when Reset Filters is clicked', async () => {
    mockedApi.get.mockResolvedValue({ data: { success: true, data: [] } });
    const onFilterChange = vi.fn();

    render(<BookFilters onFilterChange={onFilterChange} />);

    const [filtersToggle] = screen.getAllByText('Filters');
    fireEvent.click(filtersToggle);
    fireEvent.click(screen.getByText('Reset Filters'));

    expect(onFilterChange).toHaveBeenCalledWith({
      search: '',
      categoryId: 'all',
      priceRange: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
  });
});

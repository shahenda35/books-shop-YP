'use client';

import { useState } from 'react';
import { CATEGORIES, PRICE_RANGES } from '@/lib/constants';
import { BookCategory } from '@/types';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';

export interface FilterValues {
  search: string;
  category: BookCategory | 'all';
  priceRange: string;
  sortBy: 'title' | 'price' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

interface BookFiltersProps {
  onFilterChange: (filters: FilterValues) => void;
}

export function BookFilters({ onFilterChange }: BookFiltersProps) {
  const [filters, setFilters] = useState<FilterValues>({
    search: '',
    category: 'all',
    priceRange: 'all',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [showFilters, setShowFilters] = useState(false);

  const handleChange = (key: keyof FilterValues, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    const defaultFilters: FilterValues = {
      search: '',
      category: 'all',
      priceRange: 'all',
      sortBy: 'createdAt',
      sortOrder: 'desc',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...CATEGORIES.map((cat) => ({ value: cat, label: cat })),
  ];

  const priceOptions = [
    { value: 'all', label: 'All Prices' },
    ...PRICE_RANGES.map((range) => ({
      value: `${range.min || 0}-${range.max || 999}`,
      label: range.label,
    })),
  ];
  const sortOptions = [
    { value: 'title', label: 'Title' },
    { value: 'price', label: 'Price' },
    { value: 'createdAt', label: 'Date Added' },
  ];

  const orderOptions = [
    { value: 'asc', label: 'Ascending' },
    { value: 'desc', label: 'Descending' },
  ];

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search books by title or author..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={() => setShowFilters(!showFilters)}>
          <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          Filters
        </Button>
      </div>

      {/* Advanced Filters */}
      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Select
            label="Category"
            options={categoryOptions}
            value={filters.category}
            onChange={(e) => handleChange('category', e.target.value)}
          />

          <Select
            label="Price Range"
            options={priceOptions}
            value={filters.priceRange}
            onChange={(e) => handleChange('priceRange', e.target.value)}
          />

          <Select
            label="Sort By"
            options={sortOptions}
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
          />

          <Select
            label="Order"
            options={orderOptions}
            value={filters.sortOrder}
            onChange={(e) => handleChange('sortOrder', e.target.value)}
          />

          <div className="md:col-span-2 lg:col-span-4 flex justify-end">
            <Button variant="outline" size="sm" onClick={handleReset}>
              Reset Filters
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

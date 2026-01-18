'use client';

import { useEffect, useMemo, useState } from 'react';
import { PRICE_RANGES } from '@/lib/constants';
import { Button } from './ui/Button';
import { Input } from './ui/Input';
import { Select } from './ui/Select';
import apiClient from '@/lib/apiClient';

export interface FilterValues {
  search: string;
  categoryId: number | 'all';
  priceRange: string; // format: "min-max" or "all"
  sortBy: 'title' | 'price' | 'createdAt';
  sortOrder: 'asc' | 'desc';
}

interface BookFiltersProps {
  filters?: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
}

const defaultFilters: FilterValues = {
  search: '',
  categoryId: 'all',
  priceRange: 'all',
  sortBy: 'createdAt',
  sortOrder: 'desc',
};

export function BookFilters({ filters, onFilterChange }: BookFiltersProps) {
  const appliedFilters = useMemo(() => filters ?? defaultFilters, [filters]);

  const [showFilters, setShowFilters] = useState(false);
  const [categories, setCategories] = useState<Array<{ id: number; name: string }>>([]);
  const [searchText, setSearchText] = useState(appliedFilters.search);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await apiClient.get<{
          success: boolean;
          data: Array<{ id: number; name: string }>;
        }>('/api/categories');
        if (res.data?.success) {
          setCategories(res.data.data);
        }
      } catch {
        // ignore errors; keep defaults
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    setSearchText(appliedFilters.search);
  }, [appliedFilters.search]);

  useEffect(() => {
    const id = setTimeout(() => {
      if (searchText !== appliedFilters.search) {
        onFilterChange({ ...appliedFilters, search: searchText });
      }
    }, 600);
    return () => clearTimeout(id);
  }, [searchText, appliedFilters, onFilterChange]);

  const handleChange = (key: keyof FilterValues, value: string) => {
    const parsedValue =
      key === 'categoryId' ? (value === 'all' ? 'all' : Number(value)) : value;
    const newFilters = { ...appliedFilters, [key]: parsedValue as never };
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    onFilterChange(defaultFilters);
  };

  const categoryOptions = [
    { value: 'all', label: 'All Categories' },
    ...categories.map((cat) => ({ value: String(cat.id), label: cat.name })),
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
      <div className="flex gap-2">
        <div className="flex-1">
          <Input
            type="search"
            placeholder="Search books by title or author..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
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

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Select
            label="Category"
            options={categoryOptions}
            value={appliedFilters.categoryId === 'all' ? 'all' : String(appliedFilters.categoryId)}
            onChange={(e) => handleChange('categoryId', e.target.value)}
          />

          <Select
            label="Price Range"
            options={priceOptions}
            value={appliedFilters.priceRange}
            onChange={(e) => handleChange('priceRange', e.target.value)}
          />

          <Select
            label="Sort By"
            options={sortOptions}
            value={appliedFilters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
          />

          <Select
            label="Order"
            options={orderOptions}
            value={appliedFilters.sortOrder}
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

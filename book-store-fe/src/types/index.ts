export interface User {
    id: string;
    name: string;
    email: string;
}

export interface Author {
    id: number;
    name: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Tag {
    id: number | null;
    name: string | null;
}

export interface Book {
    id: number;
    title: string;
    description: string | null;
    price: number;
    thumbnail: string | null;
    author?: string;
    authorId?: number;
    category?: string;
    categoryId?: number;
    tags?: Tag[];
    userId?: number;
    createdAt?: string;
    updatedAt?: string;
}

export interface PaginatedResponse<T> {
    success: boolean;
    data: T[];
    pagination: {
        page: number;
        limit: number;
        total: number;
        pages: number;
    };
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

export interface ApiError {
    success: false;
    message: string;
    errors?: Array<{
        field: string;
        message: string;
    }>;
}

export type BookCategory = 'Technology' | 'Science' | 'History' | 'Fantasy' | 'Biography';

export interface BookFormData {
    title: string;
    description?: string;
    price: number;
    thumbnail?: string;
    authorId: number;
    categoryId: number;
    tagIds?: number[];
}

export interface ProfileFormData {
    name: string;
    email: string;
}

export interface LoginFormData {
    identifier: string;
    password: string;
}
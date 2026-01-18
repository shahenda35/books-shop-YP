import React from 'react';
import { vi } from 'vitest';
import '@testing-library/jest-dom/vitest';

// Simple mocks for Next.js components in a JSDOM environment
vi.mock('next/image', () => ({
	default: (props: React.ImgHTMLAttributes<HTMLImageElement>) => {
		const { src, alt, ...rest } = props;
		return React.createElement('img', {
			src: typeof src === 'string' ? src : '',
			alt: alt ?? '',
			...rest,
		});
	},
}));

vi.mock('next/link', () => {
	return {
		default: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) =>
			React.createElement('a', { href, ...rest }, children),
	};
});

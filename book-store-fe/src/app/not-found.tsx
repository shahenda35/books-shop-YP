import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="animate-fade-in max-w-md space-y-6 text-center">
        <div className="relative">
          <h1 className="text-9xl font-bold text-slate-200">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <svg className="h-20 w-20 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
        </div>
        
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-slate-900">Page not found</h2>
          <p className="text-sm text-slate-600">
            The book you're looking for seems to have been checked out. Let's get you back to the library.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href="/books" className="btn btn-primary">
            Browse Books
          </Link>
          <Link href="/my-books" className="btn btn-secondary">
            My Collection
          </Link>
        </div>
      </div>
    </div>
  );
}

import { ROUTES } from '@/lib/constants';
import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect(ROUTES.BOOKS);
  return (
    <div>
      <a
        className="flex h-12 w-full items-center justify-center rounded-full border border-solid border-black/8 px-5 transition-colors hover:border-transparent hover:bg-black/4 dark:border-white/[.145] dark:hover:bg-[#1a1a1a] md:w-39.5"
        href="https://nextjs.org/docs?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
        target="_blank"
        rel="noopener noreferrer"
      >
        Documentation
      </a>
    </div>
  );
}
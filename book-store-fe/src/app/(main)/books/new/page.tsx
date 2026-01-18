import { BookForm } from '@/components/BookForm';

export default function NewBookPage() {
  return (
    <div className="max-w-4xl mx-auto">
      <BookForm mode="create" />
    </div>
  );
}

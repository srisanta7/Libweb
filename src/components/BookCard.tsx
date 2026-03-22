import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Edit, Trash2, BookUp } from 'lucide-react';

interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  availableCopies: number;
}

interface BookCardProps {
  book: any;
  onEdit?: (book: any) => void | Promise<void>;
  onDelete?: (id: string) => void | Promise<void>;
  onBorrow?: (id: string) => void | Promise<void>;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onEdit, onDelete, onBorrow }) => {
  const { isAdmin } = useAuth();

  return (
    <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-100 hover:shadow-md transition-shadow">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 truncate" title={book.title}>
          {book.title}
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500">
          <p>Author: {book.author}</p>
          <p>Category: {book.category}</p>
          <p className={`mt-2 font-semibold ${book.availableCopies > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {book.availableCopies > 0 ? `${book.availableCopies} copies available` : 'Out of stock'}
          </p>
        </div>
        <div className="mt-5 flex items-center space-x-3">
          {isAdmin ? (
            <>
              <button
                onClick={() => onEdit?.(book)}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
              >
                <Edit className="w-3.5 h-3.5 mr-1.5" />
                Edit
              </button>
              <button
                onClick={() => onDelete?.(book.id)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white bg-red-600 hover:bg-red-700 focus:outline-none"
              >
                <Trash2 className="w-3.5 h-3.5 mr-1.5" />
                Delete
              </button>
            </>
          ) : (
            <button
              onClick={() => onBorrow?.(book.id)}
              disabled={book.availableCopies === 0}
              className={`inline-flex items-center px-3 py-1.5 border border-transparent shadow-sm text-xs font-medium rounded text-white focus:outline-none ${
                book.availableCopies > 0
                  ? 'bg-indigo-600 hover:bg-indigo-700'
                  : 'bg-gray-400 cursor-not-allowed'
              }`}
            >
              <BookUp className="w-3.5 h-3.5 mr-1.5" />
              Borrow
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

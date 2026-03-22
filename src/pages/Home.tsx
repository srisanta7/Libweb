import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as bookService from '../services/bookService';
import { BookCard } from '../components/BookCard';

export const Home = () => {
  const { isAdmin } = useAuth();
  const [popularBooks, setPopularBooks] = useState<any[]>([]);
  const [allBooks, setAllBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      // Try to fetch popular books if the endpoint exists, otherwise just get all books
      try {
        const popular = await bookService.getPopularSearches();
        setPopularBooks(popular.slice(0, 4)); // Show top 4
      } catch (e) {
        // Fallback if popular endpoint doesn't exist or fails
        const data = await bookService.getBooks(0, 4);
        setPopularBooks(data.content || data || []);
      }

      const data = await bookService.getBooks(0, 12);
      setAllBooks(data.content || data || []);
    } catch (err) {
      console.error('Failed to fetch books', err);
      setError('Failed to load books. The backend server might be unreachable.');
      // Mock data for demonstration
      const mockBooks = [
        { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Classic', availableCopies: 3 },
        { id: '2', title: '1984', author: 'George Orwell', category: 'Dystopian', availableCopies: 0 },
        { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', availableCopies: 5 },
        { id: '4', title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', availableCopies: 2 },
      ];
      setPopularBooks(mockBooks);
      setAllBooks(mockBooks);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBorrow = async (id: string) => {
    try {
      await bookService.borrowBook(id);
      alert('Book borrowed successfully!');
      fetchBooks();
    } catch (err) {
      alert('Failed to borrow book');
    }
  };

  const handleReturn = async (id: string) => {
    try {
      await bookService.returnBook(id);
      alert('Book returned successfully!');
      fetchBooks();
    } catch (err) {
      alert('Failed to return book');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Welcome to LibSys</h1>
        <p className="mt-2 text-gray-600">Discover and borrow your favorite books.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-4">🔥 Popular Books</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-white shadow rounded-lg p-6 animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
                  <div className="h-8 bg-gray-200 rounded w-full mt-6"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-12">
          {popularBooks.length > 0 && (
            <section>
              <h2 className="text-2xl font-semibold mb-6 flex items-center">
                <span className="mr-2">🔥</span> Popular Books
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {popularBooks.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onBorrow={!isAdmin ? handleBorrow : undefined}
                    onReturn={!isAdmin ? handleReturn : undefined}
                  />
                ))}
              </div>
            </section>
          )}

          <section>
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <span className="mr-2">📚</span> All Books
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {allBooks.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onBorrow={!isAdmin ? handleBorrow : undefined}
                  onReturn={!isAdmin ? handleReturn : undefined}
                />
              ))}
            </div>
          </section>
        </div>
      )}
    </div>
  );
};

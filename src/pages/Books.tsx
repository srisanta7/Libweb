import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as bookService from '../services/bookService';
import { BookCard } from '../components/BookCard';
import { SearchBar } from '../components/SearchBar';
import { Plus, X } from 'lucide-react';

export const Books = () => {
  const { isAdmin } = useAuth();
  const [books, setBooks] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<any>(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    category: '',
    availableCopies: 1,
  });

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      const data = await bookService.getBooks(page, 10);
      setBooks(data.content || data || []); // Handle different pagination responses
    } catch (err) {
      console.error('Failed to fetch books', err);
      setError('Failed to load books. The backend server might be unreachable.');
      // Mock data for demonstration
      setBooks([
        { id: '1', title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', category: 'Classic', availableCopies: 3 },
        { id: '2', title: '1984', author: 'George Orwell', category: 'Dystopian', availableCopies: 0 },
        { id: '3', title: 'To Kill a Mockingbird', author: 'Harper Lee', category: 'Fiction', availableCopies: 5 },
        { id: '4', title: 'The Hobbit', author: 'J.R.R. Tolkien', category: 'Fantasy', availableCopies: 2 },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [page]);

  const handleSearchSelect = (book: any) => {
    setBooks([book]); // Show only the selected book
  };

  const handleClearSearch = () => {
    fetchBooks();
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this book?')) {
      try {
        await bookService.deleteBook(id);
        fetchBooks();
      } catch (err) {
        alert('Failed to delete book');
      }
    }
  };

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

  const openModal = (book?: any) => {
    if (book) {
      setEditingBook(book);
      setFormData({
        title: book.title,
        author: book.author,
        category: book.category,
        availableCopies: book.availableCopies,
      });
    } else {
      setEditingBook(null);
      setFormData({ title: '', author: '', category: '', availableCopies: 1 });
    }
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBook) {
        await bookService.updateBook(editingBook.id, formData);
      } else {
        await bookService.addBook(formData);
      }
      setIsModalOpen(false);
      fetchBooks();
    } catch (err) {
      alert('Failed to save book');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8 space-y-4 md:space-y-0">
        <div>
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Library Catalog
          </h2>
        </div>
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 w-full md:w-auto">
          <SearchBar onSelect={handleSearchSelect} />
          <button 
            onClick={handleClearSearch}
            className="text-sm text-indigo-600 hover:text-indigo-800 whitespace-nowrap"
          >
            Clear Search
          </button>
          {isAdmin && (
            <button
              onClick={() => openModal()}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Book
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white shadow rounded-lg p-6 animate-pulse">
              <div className="h-5 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-full mt-6"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {books.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
              <p className="text-gray-500">No books found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {books.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={isAdmin ? openModal : undefined}
                  onDelete={isAdmin ? handleDelete : undefined}
                  onBorrow={!isAdmin ? handleBorrow : undefined}
                  onReturn={!isAdmin ? handleReturn : undefined}
                />
              ))}
            </div>
          )}
          
          {/* Simple Pagination */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="px-4 py-2 text-sm text-gray-700">Page {page + 1}</span>
            <button
              onClick={() => setPage(p => p + 1)}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed z-50 inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={() => setIsModalOpen(false)}></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                    {editingBook ? 'Edit Book' : 'Add New Book'}
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-500">
                    <X className="h-6 w-6" />
                  </button>
                </div>
                <form onSubmit={handleFormSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Author</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.author}
                      onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Category</label>
                    <input
                      type="text"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Available Copies</label>
                    <input
                      type="number"
                      min="0"
                      required
                      className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                      value={formData.availableCopies}
                      onChange={(e) => setFormData({ ...formData, availableCopies: parseInt(e.target.value) })}
                    />
                  </div>
                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none sm:col-start-2 sm:text-sm"
                    >
                      Save
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

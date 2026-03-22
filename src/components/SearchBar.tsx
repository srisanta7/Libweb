import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import * as bookService from '../services/bookService';

interface SearchBarProps {
  onSelect: (book: any) => void;
}

export const SearchBar = ({ onSelect }: SearchBarProps) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [popularSearches, setPopularSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const data = await bookService.getPopularSearches();
        setPopularSearches(data || []);
      } catch (error) {
        console.error('Failed to fetch popular searches', error);
      }
    };
    fetchPopular();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim()) {
        setIsLoading(true);
        try {
          const results = await bookService.searchBooks(query);
          setSuggestions(results || []);
          setIsOpen(true);
        } catch (error) {
          console.error('Search failed', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div ref={wrapperRef} className="relative w-full max-w-xl">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="Search books by title, author, or category..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
        />
      </div>

      {isOpen && (query || popularSearches.length > 0) && (
        <div className="absolute z-10 mt-1 w-full bg-white shadow-lg max-h-60 rounded-md py-1 text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {isLoading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Loading...</div>
          ) : query ? (
            suggestions.length > 0 ? (
              suggestions.map((book) => (
                <div
                  key={book.id}
                  className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-indigo-50"
                  onClick={() => {
                    onSelect(book);
                    setIsOpen(false);
                    setQuery('');
                  }}
                >
                  <div className="flex justify-between">
                    <span className="font-medium block truncate">{book.title}</span>
                    <span className="text-gray-500 text-xs">{book.category}</span>
                  </div>
                  <span className="text-gray-500 text-xs block truncate">by {book.author}</span>
                </div>
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-gray-500">No books found matching "{query}"</div>
            )
          ) : (
            popularSearches.length > 0 && (
              <>
                <div className="px-3 py-1 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                  Popular Searches
                </div>
                {popularSearches.map((term, idx) => (
                  <div
                    key={idx}
                    className="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-50 text-gray-700"
                    onClick={() => setQuery(term)}
                  >
                    <Search className="inline-block w-3 h-3 mr-2 text-gray-400" />
                    {term}
                  </div>
                ))}
              </>
            )
          )}
        </div>
      )}
    </div>
  );
};

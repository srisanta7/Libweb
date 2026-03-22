import api from './api';

export const getBooks = async (page = 0, size = 10) => {
  const response = await api.get(`/api/books?page=${page}&size=${size}`);
  return response.data;
};

export const getBook = async (id: string) => {
  const response = await api.get(`/api/books/${id}`);
  return response.data;
};

export const addBook = async (bookData: any) => {
  const response = await api.post('/api/books', bookData);
  return response.data;
};

export const updateBook = async (id: string, bookData: any) => {
  const response = await api.put(`/api/books/${id}`, bookData);
  return response.data;
};

export const deleteBook = async (id: string) => {
  const response = await api.delete(`/api/books/${id}`);
  return response.data;
};

export const borrowBook = async (bookId: string) => {
  const response = await api.post(`/api/borrow/${bookId}`);
  return response.data;
};

export const returnBook = async (recordId: string) => {
  const response = await api.post(`/api/borrow/return/${recordId}`);
  return response.data;
};

export const searchBooks = async (keyword: string) => {
  const response = await api.get(`/api/search?q=${keyword}`);
  return response.data;
};

export const getPopularSearches = async () => {
  const response = await api.get('/api/search/popular');
  return response.data;
};

export const getDashboardStats = async () => {
  const response = await api.get('/api/dashboard');
  return response.data;
};

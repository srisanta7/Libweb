import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import * as bookService from '../services/bookService';
import { Book, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

export const Dashboard = () => {
  const { role } = useAuth();
  const [stats, setStats] = useState({
    totalBooks: 0,
    availableBooks: 0,
    borrowedBooks: 0,
    overdueBooks: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await bookService.getDashboardStats();
        // Fallback for mock data if backend isn't ready
        setStats(data || {
          totalBooks: 1245,
          availableBooks: 980,
          borrowedBooks: 265,
          overdueBooks: 12,
        });
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
        setError('Failed to load dashboard statistics.');
        // Mock data for display purposes
        setStats({
          totalBooks: 1245,
          availableBooks: 980,
          borrowedBooks: 265,
          overdueBooks: 12,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statCards = [
    { name: 'Total Books', stat: stats.totalBooks, icon: Book, color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'Available Books', stat: stats.availableBooks, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Borrowed Books', stat: stats.borrowedBooks, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-100' },
    { name: 'Overdue Books', stat: stats.overdueBooks, icon: AlertTriangle, color: 'text-red-600', bg: 'bg-red-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="md:flex md:items-center md:justify-between mb-8">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
            Dashboard
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Welcome back! You are logged in as {role === 'ROLE_ADMIN' ? 'Administrator' : 'User'}.
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-yellow-50 border-l-4 border-yellow-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertTriangle className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">
                {error} Showing mock data instead.
              </p>
            </div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white overflow-hidden shadow rounded-lg animate-pulse">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0 w-12 h-12 bg-gray-200 rounded-md"></div>
                  <div className="ml-5 w-0 flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((item) => (
            <div key={item.name} className="bg-white overflow-hidden shadow rounded-lg border border-gray-100">
              <div className="p-5">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <div className={`p-3 rounded-md ${item.bg}`}>
                      <item.icon className={`h-6 w-6 ${item.color}`} aria-hidden="true" />
                    </div>
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{item.name}</dt>
                      <dd>
                        <div className="text-2xl font-semibold text-gray-900">{item.stat}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

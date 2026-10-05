import React from 'react';

export default function LoadingSkeleton({ type = 'cards' }) {
  if (type === 'cards') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-32 glass-card rounded-2xl p-5 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
            </div>
            <div className="w-16 h-8 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (type === 'table') {
    return (
      <div className="glass-card rounded-2xl p-6 space-y-4 animate-pulse">
        <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded-md mb-6"></div>
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center justify-between py-3 border-b border-gray-100 dark:border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
              <div className="space-y-1">
                <div className="w-32 h-4 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                <div className="w-20 h-3 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
              </div>
            </div>
            <div className="w-24 h-6 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full h-64 glass-card rounded-2xl p-6 animate-pulse flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-eco-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

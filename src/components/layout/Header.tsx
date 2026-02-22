// src/components/layout/Header.tsx
import React from 'react';
import { Search, Bell } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 sticky top-0 z-10">
      <div className="flex-1 flex items-center">
        <div className="relative w-96">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg leading-5 bg-gray-50 placeholder-gray-500 focus:outline-none focus:bg-white focus:ring-1 focus:ring-brand-500 focus:border-brand-500 sm:text-sm transition-colors"
            placeholder="Search platform..."
          />
        </div>
      </div>
      <div className="ml-4 flex items-center space-x-4">
        <div className="flex items-center text-sm text-green-600 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
          <div className="h-2 w-2 bg-green-500 rounded-full mr-2"></div>
          All systems operational
        </div>
        <button className="p-2 text-gray-400 hover:text-gray-500 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
}
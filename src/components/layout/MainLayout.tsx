// src/components/layout/MainLayout.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';

export default function MainLayout() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />
      
      {/* Main Content Area (offset by the 64-width sidebar) */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <Header />
        
        {/* The Outlet is where the actual page components (Dashboard, Forms, etc.) will render */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
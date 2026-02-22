// src/components/layout/Sidebar.tsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, CheckSquare, Folder, 
  Users, Building, GitMerge, ScrollText, LogOut, ShieldCheck
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';

export default function Sidebar() {
  const { user, logout } = useAuthStore();

  // Define the standard user links
  const userLinks = [
    { name: 'Dashboard', to: '/', icon: LayoutDashboard },
    { name: 'My Requests', to: '/my-requests', icon: FileText },
    { name: 'My Approvals', to: '/approvals', icon: CheckSquare },
    { name: 'Documents', to: '/documents', icon: Folder },
  ];

  // Define the admin links
  const adminLinks = [
    { name: 'Admin Dashboard', to: '/admin', icon: LayoutDashboard },
    { name: 'Users', to: '/admin/users', icon: Users },
    { name: 'Departments & Positions', to: '/admin/organization', icon: Building },
    { name: 'Templates & Workflows', to: '/admin/workflows', icon: GitMerge },
    { name: 'Audit Logs', to: '/admin/audit', icon: ScrollText },
  ];

  const links = user?.is_admin ? adminLinks : userLinks;

  return (
    <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-screen fixed left-0 top-0">
      {/* Logo Area */}
      <div className="flex items-center justify-center h-16 border-b border-gray-200 px-4">
        <ShieldCheck className="h-6 w-6 text-brand-500 mr-2" />
        <span className="text-lg font-bold text-gray-900 tracking-tight">
          ApproveFlow <span className="text-brand-500 text-xs align-top">ENTERPRISE</span>
        </span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.name}
            to={link.to}
            end={link.to === '/' || link.to === '/admin'}
            className={({ isActive }) =>
              `flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-colors ${
                isActive
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`
            }
          >
            <link.icon className="mr-3 flex-shrink-0 h-5 w-5" />
            {link.name}
          </NavLink>
        ))}
      </div>

      {/* User Profile & Logout Bottom Section */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-center mb-4">
          <div className="h-9 w-9 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold text-sm">
            {user?.full_name.charAt(0)}
          </div>
          <div className="ml-3 overflow-hidden">
            <p className="text-sm font-medium text-gray-900 truncate">{user?.full_name}</p>
            <p className="text-xs text-gray-500 truncate">
              {user?.is_admin ? 'Super Admin' : user?.positions[0]?.title || 'Employee'}
            </p>
          </div>
        </div>
        <button
          onClick={logout}
          className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-lg hover:bg-red-50 transition-colors"
        >
          <LogOut className="mr-3 flex-shrink-0 h-5 w-5" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
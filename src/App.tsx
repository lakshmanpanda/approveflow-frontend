// src/App.tsx
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/auth/Login';
import ProtectedRoute from './components/layout/ProtectedRoute';
import MainLayout from './components/layout/MainLayout';

import Dashboard from './pages/user/Dashboard';
import MyRequests from './pages/user/MyRequests';
import NewRequest from './pages/user/NewRequest';

import MyApprovals from './pages/manager/MyApprovals';
import Documents from './pages/user/Documents';

import AdminDashboard from './pages/admin/AdminDashboard';
import Organization from './pages/admin/Organization';
import Users from './pages/admin/Users';

import Workflows from './pages/admin/Workflows';
import AuditLogs from './pages/admin/AuditLogs';


export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Protected Routes wrapped in the MainLayout */}
        <Route element={<ProtectedRoute />}>
          <Route element={<MainLayout />}>
            
            {/* User Routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/my-requests" element={<MyRequests />} />
            <Route path="/new-request" element={<NewRequest />} />
            <Route path="/approvals" element={<MyApprovals />} />
            <Route path="/documents" element={<Documents />} />

            {/* Admin Routes */}
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<Users />} />
            <Route path="/admin/organization" element={<Organization />} />
            <Route path="/admin/workflows" element={<Workflows />} />
            <Route path="/admin/audit" element={<AuditLogs />} />
            
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
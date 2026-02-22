// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, AlertTriangle, Activity } from 'lucide-react';
import { api } from '../../lib/api';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState({
    total_users: 0,
    open_requests: 0,
    overdue_approvals: 0,
    completion_rate: '0%'
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/admin/stats');
        setStatsData(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStats();
  }, []);

  const stats = [
    { label: 'Total Active Users', value: isLoading ? '...' : statsData.total_users, trend: 'Current registered users', icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Open Requests', value: isLoading ? '...' : statsData.open_requests, trend: 'Currently in-progress', icon: FileText, color: 'text-brand-600', bg: 'bg-brand-100' },
    { label: 'Overdue Approvals', value: isLoading ? '...' : statsData.overdue_approvals, trend: 'Older than 5 days', icon: AlertTriangle, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Completion Rate', value: isLoading ? '...' : statsData.completion_rate, trend: 'All-time success rate', icon: Activity, color: 'text-green-600', bg: 'bg-green-100' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Platform-wide overview and operational health metrics.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
            <h3 className="text-gray-500 text-sm font-medium">{stat.label}</h3>
            <p className="text-3xl font-bold text-gray-900 my-1">{stat.value}</p>
            <p className="text-xs text-gray-500">{stat.trend}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4 mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => navigate('/admin/users')}
              className="p-4 border border-gray-200 rounded-lg hover:border-brand-500 hover:shadow-sm text-left group transition-all"
            >
              <Users className="h-6 w-6 text-brand-500 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-gray-900">User Directory</h4>
              <p className="text-xs text-gray-500 mt-1">Manage permissions</p>
            </button>
            <button 
              onClick={() => navigate('/admin/workflows')}
              className="p-4 border border-gray-200 rounded-lg hover:border-brand-500 hover:shadow-sm text-left group transition-all"
            >
              <FileText className="h-6 w-6 text-brand-500 mb-2 group-hover:scale-110 transition-transform" />
              <h4 className="font-semibold text-gray-900">Form Builder</h4>
              <p className="text-xs text-gray-500 mt-1">Configure templates</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
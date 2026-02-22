// src/pages/user/Dashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, FileText, CheckCircle, AlertCircle, Plus } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { api } from '../../lib/api';
import type { FormSubmission, PendingApproval } from '../../types';
import { format } from 'date-fns';

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [myRequests, setMyRequests] = useState<FormSubmission[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<PendingApproval[]>([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [requestsRes, approvalsRes] = await Promise.all([
          api.get('/submissions/my-requests'),
          api.get('/submissions/pending-approvals')
        ]);
        setMyRequests(requestsRes.data.slice(0, 5)); // Just the 5 most recent
        setPendingApprovals(approvalsRes.data.slice(0, 5));
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl p-8 border border-gray-200 shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.full_name}</h1>
          <p className="text-gray-500 mt-1">
            You have <span className="font-semibold text-brand-600">{pendingApprovals.length} pending approvals</span> that require your attention today.
          </p>
        </div>
        <button 
          onClick={() => navigate('/new-request')}
          className="flex items-center px-4 py-2 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium transition-colors shadow-sm"
        >
          <Plus className="h-5 w-5 mr-2" />
          New Request
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Pending Approvals', value: pendingApprovals.length.toString().padStart(2, '0'), icon: Clock, color: 'text-orange-500', bg: 'bg-orange-50' },
          { label: 'Active Requests', value: myRequests.filter(r => r.status === 'PENDING').length.toString().padStart(2, '0'), icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50' },
          { label: 'Completed Today', value: '00', icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50' },
          { label: 'System Alerts', value: '00', icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`h-6 w-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Requests Snippet */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">My Requests</h2>
            <button onClick={() => navigate('/my-requests')} className="text-sm text-brand-600 font-medium hover:text-brand-700">View All &gt;</button>
          </div>
          <div className="divide-y divide-gray-200">
            {myRequests.length === 0 ? (
              <p className="p-6 text-center text-gray-500">No recent requests.</p>
            ) : (
              myRequests.map((req) => (
                <div key={req.id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Submission</p>
                    <p className="text-xs text-gray-500">{format(new Date(req.created_at), 'MMM dd, yyyy')}</p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                    req.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  }`}>
                    {req.status}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* My Approvals Snippet */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-bold text-gray-900">My Approvals</h2>
            <button onClick={() => navigate('/approvals')} className="text-sm text-brand-600 font-medium hover:text-brand-700">Open All &gt;</button>
          </div>
          <div className="divide-y divide-gray-200">
            {pendingApprovals.length === 0 ? (
              <p className="p-6 text-center text-gray-500">No pending approvals.</p>
            ) : (
              pendingApprovals.map((appr) => (
                <div key={appr.approval_request_id} className="p-4 hover:bg-gray-50 flex justify-between items-center">
                  <div>
                    <p className="text-sm font-medium text-gray-900">{appr.submitter}</p>
                    <p className="text-xs text-gray-500">Requires your review</p>
                  </div>
                  <button onClick={() => navigate('/approvals')} className="text-sm font-medium text-brand-600 border border-brand-200 px-3 py-1 rounded hover:bg-brand-50">
                    Review
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
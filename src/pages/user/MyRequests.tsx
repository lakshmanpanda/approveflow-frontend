// src/pages/user/MyRequests.tsx
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { FileText, Search, Filter } from 'lucide-react';
import { api } from '../../lib/api';
import type { FormSubmission } from '../../types';

export default function MyRequests() {
  const [requests, setRequests] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await api.get('/submissions/my-requests');
        setRequests(response.data);
      } catch (error) {
        console.error('Failed to fetch requests', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchRequests();
  }, []);

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900">My Requests</h1>
        <p className="text-sm text-gray-500 mt-1">Manage and track your submitted workflow requests.</p>
      </div>
      
      {/* Table Area */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Request ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {isLoading ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">Loading...</td></tr>
            ) : requests.length === 0 ? (
              <tr><td colSpan={4} className="px-6 py-4 text-center text-sm text-gray-500">No requests found.</td></tr>
            ) : (
              requests.map((req) => (
                <tr key={req.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    <div className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-400 mr-2" />
                      {req.id.substring(0, 8).toUpperCase()}...
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {format(new Date(req.created_at), 'MMM dd, yyyy')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      req.status === 'COMPLETED' ? 'bg-green-100 text-green-800' : 
                      req.status === 'REJECTED' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {req.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button className="text-brand-600 hover:text-brand-900">View &gt;</button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
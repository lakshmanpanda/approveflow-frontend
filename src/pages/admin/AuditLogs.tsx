// src/pages/admin/AuditLogs.tsx
import React, { useEffect, useState } from 'react';
import { ScrollText, Search, Download, Filter, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

export default function AuditLogs() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const response = await api.get('/admin/audit-logs');
        setLogs(response.data);
      } catch (error) {
        console.error('Failed to fetch audit logs', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLogs();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <ScrollText className="h-6 w-6 text-brand-500 mr-3" />
            Platform Audit Logs
          </h1>
          <p className="text-sm text-gray-500 mt-1">Immutable record of system events, configurations, and approval actions.</p>
        </div>
        <button className="flex items-center px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 text-sm font-medium">
          <Download className="h-4 w-4 mr-2" /> Export History
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {/* Filters Bar */}
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex space-x-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input type="text" placeholder="Search IDs, actions, or descriptions..." className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-brand-500 focus:border-brand-500" />
          </div>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 text-gray-700">
            <Filter className="h-4 w-4 mr-2" /> All Actors
          </button>
        </div>

        {/* Log Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Timestamp</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actor</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Action</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity Type</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Entity ID</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                    <Loader2 className="h-6 w-6 animate-spin mx-auto mb-2 text-brand-500" />
                    Loading secure audit logs...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-500">No audit logs found in the system yet.</td>
                </tr>
              ) : (
                logs.map((log, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{log.timestamp}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{log.actor}</div>
                      <div className="text-xs text-gray-500">{log.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2.5 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        log.action.includes('APPROVE') ? 'bg-green-100 text-green-800' :
                        log.action.includes('REJECT') ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {log.action}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{log.type}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{log.entity_id}</td>
                    <td className="px-6 py-4 text-sm text-gray-500 truncate max-w-xs" title={log.desc}>{log.desc}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
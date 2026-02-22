// src/pages/manager/MyApprovals.tsx
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { CheckCircle, XCircle, Clock, ChevronDown, ChevronUp } from 'lucide-react';
import { api } from '../../lib/api';
import type { PendingApproval } from '../../types';

export default function MyApprovals() {
  const [approvals, setApprovals] = useState<PendingApproval[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [comment, setComment] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const fetchApprovals = async () => {
    try {
      const response = await api.get('/submissions/pending-approvals');
      setApprovals(response.data);
    } catch (error) {
      console.error('Failed to fetch approvals', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleAction = async (approvalId: string, action: 'APPROVE' | 'REJECT') => {
    setIsProcessing(true);
    try {
      await api.post(`/submissions/approvals/${approvalId}/action`, {
        action,
        comments: comment || (action === 'APPROVE' ? 'Approved' : 'Rejected')
      });
      
      // Remove the processed item from the list and reset state
      setApprovals(prev => prev.filter(a => a.approval_request_id !== approvalId));
      setExpandedId(null);
      setComment('');
    } catch (error) {
      console.error(`Failed to ${action}`, error);
      alert(`Error processing ${action.toLowerCase()}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 border-l-4 border-l-brand-500">
        <h1 className="text-2xl font-bold text-gray-900">My Approvals Inbox</h1>
        <p className="text-sm text-gray-500 mt-1">Review and process requests awaiting your authorization.</p>
      </div>

      {isLoading ? (
        <p className="text-center text-gray-500 mt-10">Loading your inbox...</p>
      ) : approvals.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center shadow-sm">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900">You're all caught up!</h3>
          <p className="text-gray-500 mt-1">There are no pending approvals requiring your attention.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {approvals.map((appr) => (
            <div key={appr.approval_request_id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all">
              
              {/* Header Row */}
              <div 
                className="px-6 py-4 flex items-center justify-between cursor-pointer hover:bg-gray-50"
                onClick={() => setExpandedId(expandedId === appr.approval_request_id ? null : appr.approval_request_id)}
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-gray-900">{appr.submitter}</h3>
                    <p className="text-xs text-gray-500">
                      Assigned: {appr.assigned_at ? format(new Date(appr.assigned_at), 'MMM dd, h:mm a') : 'Just now'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-sm font-medium text-brand-600">Review Request</span>
                  {expandedId === appr.approval_request_id ? <ChevronUp className="h-5 w-5 text-gray-400" /> : <ChevronDown className="h-5 w-5 text-gray-400" />}
                </div>
              </div>

              {/* Expandable Content Area */}
              {expandedId === appr.approval_request_id && (
                <div className="px-6 pb-6 pt-2 border-t border-gray-100 bg-gray-50">
                  <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">Submitted Data</h4>
                  <div className="bg-white rounded border border-gray-200 p-4 mb-6 grid grid-cols-2 gap-4">
                    {Object.entries(appr.form_data).map(([key, value]) => (
                      <div key={key}>
                        <span className="block text-xs text-gray-500 capitalize">{key.replace('_', ' ')}</span>
                        <span className="block text-sm font-medium text-gray-900">{String(value)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">Approval Comments (Optional)</label>
                    <textarea 
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 p-3 border"
                      rows={2}
                      placeholder="Add a note to the audit log..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    
                    <div className="flex justify-end space-x-3 pt-2">
                      <button 
                        onClick={() => handleAction(appr.approval_request_id, 'REJECT')}
                        disabled={isProcessing}
                        className="flex items-center px-4 py-2 bg-white border border-red-200 text-red-600 rounded-lg hover:bg-red-50 font-medium transition-colors"
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </button>
                      <button 
                        onClick={() => handleAction(appr.approval_request_id, 'APPROVE')}
                        disabled={isProcessing}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition-colors"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
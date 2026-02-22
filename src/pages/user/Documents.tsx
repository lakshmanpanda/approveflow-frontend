// src/pages/user/Documents.tsx
import React, { useEffect, useState } from 'react';
import { format } from 'date-fns';
import { Folder, Download, ShieldCheck } from 'lucide-react';
import { api } from '../../lib/api';
import type { FormSubmission } from '../../types';

export default function Documents() {
  const [completedDocs, setCompletedDocs] = useState<FormSubmission[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDocs = async () => {
      try {
        // Fetch all my requests, and filter for completed ones locally
        const response = await api.get('/submissions/my-requests');
        const completed = response.data.filter((req: FormSubmission) => req.status === 'COMPLETED');
        setCompletedDocs(completed);
      } catch (error) {
        console.error('Failed to fetch documents', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDocs();
  }, []);

  const handleDownload = async (submissionId: string) => {
    try {
      const response = await api.get(`/submissions/${submissionId}/download`);
      const { download_url } = response.data;
      
      // Open the secure MinIO pre-signed URL in a new tab to trigger download
      window.open(download_url, '_blank');
    } catch (error) {
      console.error('Download failed', error);
      alert('Document generation may still be processing. Please try again in a few seconds.');
    }
  };

  return (
    <div className="max-w-6xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Document Vault</h1>
          <p className="text-sm text-gray-500 mt-1">Access mathematically verified, tamper-proof PDFs of completed requests.</p>
        </div>
        <ShieldCheck className="h-10 w-10 text-brand-500 opacity-20" />
      </div>
      
      <div className="p-6">
        {isLoading ? (
          <p className="text-center text-gray-500">Loading secure documents...</p>
        ) : completedDocs.length === 0 ? (
          <div className="text-center py-12">
            <Folder className="mx-auto h-12 w-12 text-gray-300 mb-4" />
            <p className="text-gray-500">No completed documents available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedDocs.map((doc) => (
              <div key={doc.id} className="border border-gray-200 rounded-xl p-5 hover:border-brand-300 hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-4">
                    <div className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                      Certified PDF
                    </div>
                    <span className="text-xs text-gray-400">{format(new Date(doc.created_at), 'MMM dd, yyyy')}</span>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Request {doc.id.substring(0, 6).toUpperCase()}</h3>
                  <p className="text-sm text-gray-500 mb-4 truncate">
                    {/* Preview the first data entry if available */}
                    {Object.values(doc.form_data)[0] || 'Standard workflow document'}
                  </p>
                </div>
                <button 
                  onClick={() => handleDownload(doc.id)}
                  className="w-full flex justify-center items-center px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg hover:bg-brand-50 hover:text-brand-600 hover:border-brand-200 transition-colors text-sm font-medium"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
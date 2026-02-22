// src/pages/user/NewRequest.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Send } from 'lucide-react';
import { api } from '../../lib/api';
import type { FormTemplate } from '../../types';

export default function NewRequest() {
  const navigate = useNavigate();
  const [templates, setTemplates] = useState<FormTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<FormTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchTemplates = async () => {
      const res = await api.get('/submissions/forms/active');
      setTemplates(res.data);
    };
    fetchTemplates();
  }, []);

  const handleInputChange = (key: string, value: string | number) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTemplate) return;
    
    setIsSubmitting(true);
    try {
      await api.post('/submissions/', {
        form_template_id: selectedTemplate.id,
        form_data: formData,
        is_draft: false
      });
      navigate('/my-requests'); // Send them back to the table on success!
    } catch (error) {
      console.error('Submission failed', error);
      alert('Failed to submit request.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white rounded-xl border border-gray-200 shadow-sm">
      <div className="px-8 py-6 border-b border-gray-200 bg-gray-50 rounded-t-xl">
        <h1 className="text-2xl font-bold text-gray-900">Create New Request</h1>
        <p className="text-sm text-gray-500 mt-1">Fill out the form below to submit a new workflow request for approval.</p>
      </div>

      <form onSubmit={handleSubmit} className="p-8 space-y-8">
        {/* Step 1: Select Template */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">What type of request are you submitting?</label>
          <select 
            className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2.5 border"
            onChange={(e) => {
              const tmpl = templates.find(t => t.id === e.target.value);
              setSelectedTemplate(tmpl || null);
              setFormData({}); // Reset form when changing templates
            }}
            defaultValue=""
          >
            <option value="" disabled>Select a form template...</option>
            {templates.map(t => (
              <option key={t.id} value={t.id}>{t.name} - {t.description}</option>
            ))}
          </select>
        </div>

        {/* Step 2: Dynamic Form Render */}
        {selectedTemplate && (
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 space-y-6">
            <h3 className="text-lg font-medium text-gray-900 flex items-center border-b border-gray-200 pb-3">
              <FileText className="h-5 w-5 mr-2 text-brand-500" />
              {selectedTemplate.name} Details
            </h3>
            
            <div className="grid grid-cols-1 gap-6">
              {Object.entries(selectedTemplate.form_schema.properties).map(([key, config]: [string, any]) => (
                <div key={key}>
                  <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                    {key.replace('_', ' ')}
                  </label>
                  {config.type === 'number' ? (
                    <input
                      type="number"
                      required={config.required}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2.5 border"
                      onChange={(e) => handleInputChange(key, Number(e.target.value))}
                    />
                  ) : (
                    <textarea
                      required={config.required}
                      rows={3}
                      className="w-full border-gray-300 rounded-lg shadow-sm focus:border-brand-500 focus:ring-brand-500 p-2.5 border"
                      onChange={(e) => handleInputChange(key, e.target.value)}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={!selectedTemplate || isSubmitting}
            className="flex items-center px-6 py-2.5 bg-brand-500 text-white rounded-lg hover:bg-brand-600 font-medium transition-colors disabled:opacity-50"
          >
            <Send className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Submitting...' : 'Submit for Approval'}
          </button>
        </div>
      </form>
    </div>
  );
}
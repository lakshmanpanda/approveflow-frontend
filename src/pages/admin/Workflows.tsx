// src/pages/admin/Workflows.tsx
import React, { useState, useEffect } from 'react';
import { GitMerge, Plus, FileCode, CheckCircle, AlertCircle, List } from 'lucide-react';
import { api } from '../../lib/api';

export default function Workflows() {
  // Form Template State
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formSchemaStr, setFormSchemaStr] = useState('{\n  "type": "object",\n  "properties": {\n    "leave_days": {"type": "number", "required": true},\n    "reason": {"type": "string", "required": true}\n  }\n}');
  const [formMessage, setFormMessage] = useState('');

  // Workflow State
  const [wfName, setWfName] = useState('');
  const [wfFormId, setWfFormId] = useState('');
  const [wfStagesStr, setWfStagesStr] = useState('[\n  {\n    "stage_order": 1,\n    "required_role": "MANAGER",\n    "conditions": null\n  },\n  {\n    "stage_order": 2,\n    "required_role": "HOD",\n    "conditions": { "leave_days": { ">": 3 } }\n  }\n]');
  const [wfMessage, setWfMessage] = useState('');

  // Data State
  const [forms, setForms] = useState<any[]>([]);
  const [workflows, setWorkflows] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchWorkflowData = async () => {
    try {
      const [formsRes, wfRes] = await Promise.all([
        api.get('/admin/forms'),
        api.get('/admin/workflows')
      ]);
      setForms(formsRes.data);
      setWorkflows(wfRes.data);
    } catch (err) {
      console.error("Failed to fetch workflow data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkflowData();
  }, []);

  const handleCreateForm = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedSchema = JSON.parse(formSchemaStr);
      const res = await api.post('/admin/forms', {
        name: formName, description: formDesc, form_schema: parsedSchema
      });
      setFormMessage(`Success! Form ID: ${res.data.id}`);
      setFormName(''); setFormDesc('');
      fetchWorkflowData();
    } catch (err) {
      alert('Failed to create form. Please ensure your JSON is perfectly valid.');
    }
  };

  const handleCreateWorkflow = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const parsedStages = JSON.parse(wfStagesStr);
      const res = await api.post('/admin/workflows', {
        name: wfName, form_template_id: wfFormId, stages: parsedStages
      });
      setWfMessage(`Success! Workflow Engine running for ID: ${res.data.id}`);
      setWfName(''); setWfFormId('');
      fetchWorkflowData();
    } catch (err) {
      alert('Failed to attach workflow. Please check your JSON arrays and UUID.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-bold text-gray-900 flex items-center">
          <GitMerge className="h-6 w-6 text-brand-500 mr-3" />
          Form Templates & Workflows
        </h1>
        <p className="text-sm text-gray-500 mt-1">Configure approval sequences, conditions, and dynamic form metadata.</p>
      </div>

      {/* CREATION FORMS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Module 1: Form Blueprint Creator */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center">
            <FileCode className="h-5 w-5 text-gray-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-900">1. Define Form Schema</h2>
          </div>
          
          <form onSubmit={handleCreateForm} className="p-6 space-y-5 flex-1">
            {formMessage && (
              <div className="bg-green-50 text-green-700 p-3 rounded text-sm font-mono break-all flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" /> {formMessage}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-gray-700">Form Name</label>
              <input type="text" required value={formName} onChange={e => setFormName(e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg p-2.5 border focus:ring-brand-500 focus:border-brand-500" placeholder="e.g., Leave Request" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <input type="text" required value={formDesc} onChange={e => setFormDesc(e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg p-2.5 border focus:ring-brand-500 focus:border-brand-500" placeholder="e.g., Standard time off" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1 flex justify-between">
                <span>JSON Schema blueprint</span>
                <span className="text-xs text-brand-600">Strict JSON Required</span>
              </label>
              <textarea required value={formSchemaStr} onChange={e => setFormSchemaStr(e.target.value)} rows={7} className="w-full border-gray-300 rounded-lg p-3 border focus:ring-brand-500 font-mono text-sm bg-gray-50" />
            </div>
            <button type="submit" className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gray-900 hover:bg-black">
              <Plus className="h-4 w-4 mr-2" /> Create Form Template
            </button>
          </form>
        </div>

        {/* Module 2: Workflow Logic Engine */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center">
              <GitMerge className="h-5 w-5 text-gray-500 mr-2" />
              <h2 className="text-lg font-bold text-gray-900">2. Attach Workflow Logic</h2>
            </div>
          </div>

          <form onSubmit={handleCreateWorkflow} className="p-6 space-y-5 flex-1">
            {wfMessage && (
              <div className="bg-green-50 text-green-700 p-3 rounded text-sm font-mono break-all flex items-start">
                <CheckCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" /> {wfMessage}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Workflow Rule Name</label>
                <input type="text" required value={wfName} onChange={e => setWfName(e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg p-2.5 border focus:ring-brand-500" placeholder="e.g., Standard Flow" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target Form ID</label>
                <input type="text" required value={wfFormId} onChange={e => setWfFormId(e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg p-2.5 border focus:ring-brand-500" placeholder="Paste Form UUID" />
              </div>
            </div>
            
            <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start">
              <AlertCircle className="h-5 w-5 text-blue-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-blue-800 leading-relaxed">
                Define the routing stages below. Use <code className="bg-white px-1 py-0.5 rounded font-bold">conditions: null</code> for mandatory stages, or map conditions to your schema properties.
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stages Array (JSON)</label>
              <textarea required value={wfStagesStr} onChange={e => setWfStagesStr(e.target.value)} rows={9} className="w-full border-gray-300 rounded-lg p-3 border focus:ring-brand-500 font-mono text-sm bg-gray-50" />
            </div>
            <button type="submit" className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700">
              <Plus className="h-4 w-4 mr-2" /> Deploy Engine Rules
            </button>
          </form>
        </div>
      </div>

      {/* LIVE DATA TABLES */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mt-8">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex items-center justify-between">
           <h2 className="text-lg font-bold text-gray-900 flex items-center">
             <List className="h-5 w-5 mr-2 text-gray-500"/> Active Form Templates
           </h2>
           <span className="text-sm text-gray-500">{forms.length} available templates</span>
        </div>
        <div className="overflow-x-auto max-h-96 overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white sticky top-0">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Form Template</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Assigned Workflows</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Form ID (UUID)</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={3} className="px-6 py-4 text-center text-gray-500">Loading templates...</td></tr>
              ) : forms.map((f) => {
                const attachedWfs = workflows.filter(w => w.form_template_id === f.id);
                return (
                  <tr key={f.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{f.name}</div>
                      <div className="text-xs text-gray-500">{f.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {attachedWfs.length > 0 ? (
                         <div className="space-y-1">
                           {attachedWfs.map(w => (
                             <span key={w.id} className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded border border-blue-100">{w.name}</span>
                           ))}
                         </div>
                      ) : (
                         <span className="text-xs text-red-500 italic">No workflow attached</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-500 font-mono select-all">
                      {f.id}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
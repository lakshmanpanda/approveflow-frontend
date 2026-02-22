// src/pages/admin/Organization.tsx
import React, { useState, useEffect } from 'react';
import { Building, Plus, Network, List } from 'lucide-react';
import { api } from '../../lib/api';

export default function Organization() {
  // Form State
  const [deptName, setDeptName] = useState('');
  const [deptRegion, setDeptRegion] = useState('');
  const [posTitle, setPosTitle] = useState('');
  const [posRole, setPosRole] = useState('USER');
  const [posDeptId, setPosDeptId] = useState('');
  const [posParentId, setPosParentId] = useState('');
  const [message, setMessage] = useState('');

  // Data State
  const [departments, setDepartments] = useState<any[]>([]);
  const [positions, setPositions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrgData = async () => {
    try {
      const [deptRes, posRes] = await Promise.all([
        api.get('/admin/departments'),
        api.get('/admin/positions')
      ]);
      setDepartments(deptRes.data);
      setPositions(posRes.data);
    } catch (err) {
      console.error("Failed to fetch organization data", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrgData();
  }, []);

  const handleCreateDept = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/departments', { name: deptName, region: deptRegion });
      setMessage(`Department created! ID: ${res.data.id}`);
      setDeptName(''); setDeptRegion('');
      fetchOrgData(); // Refresh tables
    } catch (err) {
      alert('Failed to create department');
    }
  };

  const handleCreatePos = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post('/admin/positions', {
        title: posTitle,
        role_type: posRole,
        department_id: posDeptId,
        parent_position_id: posParentId || null
      });
      setMessage(`Position created! ID: ${res.data.id}`);
      setPosTitle(''); setPosDeptId(''); setPosParentId('');
      fetchOrgData(); // Refresh tables
    } catch (err) {
      alert('Failed to create position. Check if Department/Parent IDs are correct.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Departments & Positions</h1>
        <p className="text-sm text-gray-500 mt-1">Manage organizational hierarchy and functional units.</p>
      </div>

      {message && (
        <div className="bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 font-mono text-sm break-all">
          {message}
        </div>
      )}

      {/* CREATION FORMS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Department Creator */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center mb-6">
            <Building className="h-6 w-6 text-brand-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-900">Create Department</h2>
          </div>
          <form onSubmit={handleCreateDept} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Department Name</label>
              <input type="text" required value={deptName} onChange={e => setDeptName(e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg p-2 border focus:ring-brand-500 focus:border-brand-500" placeholder="e.g., Finance" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Region</label>
              <input type="text" required value={deptRegion} onChange={e => setDeptRegion(e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg p-2 border focus:ring-brand-500 focus:border-brand-500" placeholder="e.g., Global" />
            </div>
            <button type="submit" className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700">
              <Plus className="h-4 w-4 mr-2" /> Add Department
            </button>
          </form>
        </div>

        {/* Position Creator */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center mb-6">
            <Network className="h-6 w-6 text-brand-500 mr-2" />
            <h2 className="text-lg font-bold text-gray-900">Create Position</h2>
          </div>
          <form onSubmit={handleCreatePos} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Position Title</label>
              <input type="text" required value={posTitle} onChange={e => setPosTitle(e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg p-2 border focus:ring-brand-500 focus:border-brand-500" placeholder="e.g., Engineering Manager" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Role Type</label>
                <select value={posRole} onChange={e => setPosRole(e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg p-2 border focus:ring-brand-500">
                  <option value="USER">Standard User</option>
                  <option value="MANAGER">Manager</option>
                  <option value="HOD">Head of Dept</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department ID</label>
                <input type="text" required value={posDeptId} onChange={e => setPosDeptId(e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg p-2 border focus:ring-brand-500" placeholder="UUID" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Parent Position ID (Reports To)</label>
              <input type="text" value={posParentId} onChange={e => setPosParentId(e.target.value)} className="mt-1 w-full border-gray-300 rounded-lg p-2 border focus:ring-brand-500" placeholder="UUID (Leave blank if root)" />
            </div>
            <button type="submit" className="w-full flex justify-center items-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700">
              <Plus className="h-4 w-4 mr-2" /> Add Position
            </button>
          </form>
        </div>
      </div>

      {/* LIVE DATA TABLES */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Departments Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
             <h2 className="text-lg font-bold text-gray-900 flex items-center">
               <List className="h-5 w-5 mr-2 text-gray-500"/> Current Departments
             </h2>
             <span className="text-sm text-gray-500">{departments.length} units</span>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name & Region</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department ID (UUID)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr><td colSpan={2} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
                ) : departments.map((d) => (
                  <tr key={d.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{d.name}</div>
                      <div className="text-xs text-gray-500">{d.region}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-500 font-mono select-all">
                      {d.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Positions Table */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
             <h2 className="text-lg font-bold text-gray-900 flex items-center">
               <List className="h-5 w-5 mr-2 text-gray-500"/> Current Positions
             </h2>
             <span className="text-sm text-gray-500">{positions.length} roles</span>
          </div>
          <div className="overflow-x-auto max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-white sticky top-0">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title & Role</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Position ID (UUID)</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {isLoading ? (
                  <tr><td colSpan={2} className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
                ) : positions.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{p.title}</div>
                      <div className="text-xs font-medium text-brand-600">{p.role_type}</div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-xs text-gray-500 font-mono select-all">
                      {p.id}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
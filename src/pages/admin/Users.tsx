// src/pages/admin/Users.tsx
import React, { useState, useEffect } from 'react';
import { Users as UsersIcon, UserPlus, Mail, Lock, Briefcase, CheckCircle, XCircle } from 'lucide-react';
import { api } from '../../lib/api';

export default function Users() {
  // Form State
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [positionId, setPositionId] = useState('');
  const [message, setMessage] = useState('');

  // Table State
  const [usersList, setUsersList] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      setUsersList(res.data);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post(`/admin/users?position_id=${positionId}`, {
        email, full_name: fullName, password, is_active: true, is_admin: false
      });
      setMessage(`Successfully created account for ${fullName}!`);
      setEmail(''); setFullName(''); setPassword(''); setPositionId('');
      
      // Refresh the table instantly!
      fetchUsers();
    } catch (err) {
      alert('Failed to create user. Ensure the Position ID is correct.');
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Directory</h1>
          <p className="text-sm text-gray-500 mt-1">Manage organization members, assign roles, and control account accessibility.</p>
        </div>
      </div>

      {/* CREATE USER FORM */}
      <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
        <div className="flex items-center mb-6 pb-4 border-b border-gray-100">
          <UserPlus className="h-6 w-6 text-brand-500 mr-2" />
          <h2 className="text-lg font-bold text-gray-900">Onboard New Employee</h2>
        </div>

        {message && (
          <div className="mb-6 bg-green-50 text-green-700 p-4 rounded-lg border border-green-200 font-medium text-sm flex items-center">
             <CheckCircle className="h-5 w-5 mr-2" /> {message}
          </div>
        )}

        <form onSubmit={handleCreateUser} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UsersIcon className="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" required value={fullName} onChange={e => setFullName(e.target.value)} className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm" placeholder="Alice Smith" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Work Email</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-4 w-4 text-gray-400" />
                </div>
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm" placeholder="alice@company.com" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Temporary Password</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-4 w-4 text-gray-400" />
                </div>
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm" placeholder="••••••••" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Assign Position (ID)</label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Briefcase className="h-4 w-4 text-gray-400" />
                </div>
                <input type="text" required value={positionId} onChange={e => setPositionId(e.target.value)} className="block w-full pl-10 px-3 py-2 border border-gray-300 rounded-lg focus:ring-brand-500 focus:border-brand-500 sm:text-sm" placeholder="Paste Position UUID here" />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button type="submit" className="flex justify-center items-center py-2.5 px-6 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-600 hover:bg-brand-700">
              <UserPlus className="h-4 w-4 mr-2" />
              Create Employee Account
            </button>
          </div>
        </form>
      </div>

      {/* LIVE USERS DIRECTORY TABLE */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
           <h2 className="text-lg font-bold text-gray-900 flex items-center">
             <UsersIcon className="h-5 w-5 mr-2 text-gray-500"/> Current Employees
           </h2>
           <span className="text-sm font-medium text-gray-500">{usersList.length} total users</span>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-white">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Name & Email</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">System Role</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">User ID</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr><td colSpan={4} className="px-6 py-6 text-center text-gray-500">Loading user directory...</td></tr>
              ) : (
                usersList.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-bold text-gray-900">{u.full_name}</div>
                      <div className="text-sm text-gray-500">{u.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.is_admin ? (
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">Super Admin</span>
                      ) : (
                         <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">Standard User</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {u.is_active ? (
                        <div className="flex items-center text-sm text-green-600"><CheckCircle className="h-4 w-4 mr-1"/> Active</div>
                      ) : (
                        <div className="flex items-center text-sm text-red-600"><XCircle className="h-4 w-4 mr-1"/> Inactive</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">
                      {u.id.substring(0, 8)}...
                    </td>
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
import { useState, useEffect } from 'react';
import { Search, Loader2, Users, Shield, Mail, Calendar } from 'lucide-react';
import api from '../../services/api';
import toast from 'react-hot-toast';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/users');
      setUsers(response.data.data.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
      toast.error('Failed to load users');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleRole = async (user) => {
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    if (!confirm(`Change ${user.name}'s role to ${newRole}?`)) return;
    
    try {
      await api.put(`/users/${user._id}/role`, { role: newRole });
      toast.success(`Role updated to ${newRole}`);
      loadUsers();
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const filteredUsers = users.filter(user =>
    user.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>Users</h1>
          <p style={{ color: 'var(--color-text-secondary)' }}>Manage user accounts</p>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--color-text-muted)' }} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:border-[var(--color-primary)]"
            style={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', color: 'var(--color-text)' }}
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(0,227,165,0.1)' }}>
              <Users className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{users.length}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Total Users</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(244,114,182,0.1)' }}>
              <Shield className="w-5 h-5" style={{ color: '#F472B6' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{users.filter(u => u.role === 'admin').length}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Admins</p>
            </div>
          </div>
        </div>
        <div className="card">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg" style={{ backgroundColor: 'rgba(79,195,247,0.1)' }}>
              <Users className="w-5 h-5" style={{ color: 'var(--color-secondary)' }} />
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--color-text)' }}>{users.filter(u => u.role === 'user').length}</p>
              <p className="text-sm" style={{ color: 'var(--color-text-secondary)' }}>Regular Users</p>
            </div>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin" style={{ color: 'var(--color-primary)' }} />
          </div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p style={{ color: 'var(--color-text-secondary)' }}>No users found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-border)' }}>
                  <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>User</th>
                  <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Email</th>
                  <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Role</th>
                  <th className="text-left p-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Joined</th>
                  <th className="text-right p-4 text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user._id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-bg)' }}>
                          {user.name?.charAt(0).toUpperCase()}
                        </div>
                        <span className="font-medium" style={{ color: 'var(--color-text)' }}>{user.name}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-text-secondary)' }}>
                        <Mail className="w-4 h-4" />
                        {user.email}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs px-2 py-1 rounded-full capitalize" style={{ backgroundColor: user.role === 'admin' ? 'rgba(244,114,182,0.1)' : 'rgba(0,227,165,0.1)', color: user.role === 'admin' ? '#F472B6' : 'var(--color-primary)' }}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2" style={{ color: 'var(--color-text-muted)' }}>
                        <Calendar className="w-4 h-4" />
                        {formatDate(user.createdAt)}
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => toggleRole(user)}
                        className="text-xs px-3 py-1.5 rounded-lg border transition-colors hover:bg-[var(--color-bg)]"
                        style={{ borderColor: 'var(--color-border)', color: 'var(--color-text-secondary)' }}
                      >
                        {user.role === 'admin' ? 'Make User' : 'Make Admin'}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

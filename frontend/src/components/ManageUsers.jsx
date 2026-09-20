import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

const AVATAR_COLORS = ['#FF3F6C', '#14958F', '#8E24AA', '#1E88E5', '#B8860B', '#2E7D32'];

function avatarColor(name) {
  const code = name.charCodeAt(0) || 0;
  return AVATAR_COLORS[code % AVATAR_COLORS.length];
}

function formatDate(value) {
  if (!value) return '—';
  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function StatCard({ label, value, tint }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5">
      <p className="text-xs text-gray-500">{label}</p>
      <p className={`font-display text-2xl mt-1 ${tint || 'text-[#282C3F]'}`}>{value}</p>
    </div>
  );
}

function ManageUsers() {
  const { token, username: myUsername } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [busyId, setBusyId] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = (searchTerm = '') => {
    setLoading(true);
    const params = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
    fetch(`${import.meta.env.VITE_API_URL}/manage-users/${params}`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(Array.isArray(data) ? data : []);
        setError('');
      })
      .catch(() => setError('Users load nahi ho paye. Dobara try karo.'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timeout = setTimeout(() => fetchUsers(search), 350);
    return () => clearTimeout(timeout);
  }, [search]);

  const stats = useMemo(() => {
    const totalUsers = users.length;
    const staffCount = users.filter((u) => u.is_staff).length;
    const blockedCount = users.filter((u) => !u.is_active).length;
    const totalRevenue = users.reduce((sum, u) => sum + Number(u.total_spent || 0), 0);
    return { totalUsers, staffCount, blockedCount, totalRevenue };
  }, [users]);

  const filteredUsers = useMemo(() => {
    if (filter === 'staff') return users.filter((u) => u.is_staff);
    if (filter === 'blocked') return users.filter((u) => !u.is_active);
    if (filter === 'customers') return users.filter((u) => !u.is_staff);
    return users;
  }, [users, filter]);

  const handleToggleActive = (user) => {
    const action = user.is_active ? 'block' : 'unblock';
    if (!window.confirm(`${user.username} ko ${action === 'block' ? 'block' : 'unblock'} karna hai?`)) return;

    setBusyId(user.id);
    fetch(`${import.meta.env.VITE_API_URL}/users/${user.id}/toggle-active/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, is_active: data.is_active } : u))
        );
      })
      .finally(() => setBusyId(null));
  };

  const handleToggleStaff = (user) => {
    const action = user.is_staff ? 'remove admin access from' : 'make an admin';
    if (!window.confirm(`Are you sure you want to ${action} ${user.username}?`)) return;

    setBusyId(user.id);
    fetch(`${import.meta.env.VITE_API_URL}/manage-users/${user.id}/toggle-staff/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          setError(data.error);
          return;
        }
        setUsers((prev) =>
          prev.map((u) => (u.id === user.id ? { ...u, is_staff: data.is_staff } : u))
        );
      })
      .finally(() => setBusyId(null));
  };

  const filterTabs = [
    { id: 'all', label: 'All' },
    { id: 'customers', label: 'Customers' },
    { id: 'staff', label: 'Admins' },
    { id: 'blocked', label: 'Blocked' },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F6]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <h2 className="font-display text-2xl sm:text-3xl text-[#282C3F]">Manage Users</h2>
        <p className="text-sm text-gray-500 mt-1 mb-6">
          All users and status bar
        </p>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <StatCard label="Total users" value={stats.totalUsers} />
          <StatCard label="Admins" value={stats.staffCount} tint="text-[#14958F]" />
          <StatCard label="Blocked" value={stats.blockedCount} tint="text-red-600" />
          <StatCard
            label="Revenue (all orders)"
            value={`₹${stats.totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`}
            tint="text-[#FF3F6C]"
          />
        </div>

        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <div className="p-4 sm:p-5 border-b border-gray-100 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex gap-1.5 overflow-x-auto">
              {filterTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`shrink-0 text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors ${
                    filter === tab.id
                      ? 'bg-[#FF3F6C] text-white'
                      : 'bg-[#F5F5F6] text-[#282C3F] hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <div className="relative sm:w-64">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full border border-gray-200 rounded-full pl-9 pr-3 py-2 text-sm focus:outline-none focus:border-[#FF3F6C] focus:ring-1 focus:ring-[#FF3F6C] transition-colors"
              />
            </div>
          </div>

          {error && (
            <p className="text-[#FF3F6C] text-sm font-medium bg-[#FFF1F4] px-5 py-3">{error}</p>
          )}

          {loading ? (
            <div className="p-10 text-center text-sm text-gray-500">Loading users…</div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-10 text-center">
              <p className="text-sm text-gray-500">Empty users</p>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[11px] text-gray-500 uppercase tracking-wide border-b border-gray-100">
                      <th className="px-5 py-3 font-semibold">User</th>
                      <th className="px-5 py-3 font-semibold">Joined</th>
                      <th className="px-5 py-3 font-semibold">Orders</th>
                      <th className="px-5 py-3 font-semibold">Spent</th>
                      <th className="px-5 py-3 font-semibold">Status</th>
                      <th className="px-5 py-3 font-semibold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-[#F5F5F6]/60 transition-colors">
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                              style={{ backgroundColor: avatarColor(user.username) }}
                            >
                              {user.username.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="font-semibold text-[#282C3F] truncate">
                                {user.username}
                                {user.username === myUsername && (
                                  <span className="ml-1.5 text-[10px] text-gray-400 font-normal">(you)</span>
                                )}
                              </p>
                              <p className="text-xs text-gray-500 truncate">{user.email || 'No email'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-gray-600 whitespace-nowrap">
                          {formatDate(user.date_joined)}
                        </td>
                        <td className="px-5 py-3 text-gray-600">{user.order_count}</td>
                        <td className="px-5 py-3 font-semibold text-[#282C3F] whitespace-nowrap">
                          ₹{Number(user.total_spent || 0).toLocaleString('en-IN')}
                        </td>
                        <td className="px-5 py-3">
                          <div className="flex flex-wrap gap-1.5">
                            {user.is_superuser && (
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-700">
                                Super
                              </span>
                            )}
                            {user.is_staff && (
                              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#E6F7F6] text-[#14958F]">
                                Admin
                              </span>
                            )}
                            <span
                              className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                                user.is_active
                                  ? 'bg-green-50 text-green-700'
                                  : 'bg-red-50 text-red-600'
                              }`}
                            >
                              {user.is_active ? 'Active' : 'Blocked'}
                            </span>
                          </div>
                        </td>
                        <td className="px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleStaff(user)}
                              disabled={busyId === user.id || user.username === myUsername}
                              className="text-xs font-semibold text-[#14958F] hover:underline disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {user.is_staff ? 'Remove admin' : 'Make admin'}
                            </button>
                            <button
                              onClick={() => handleToggleActive(user)}
                              disabled={busyId === user.id || user.username === myUsername}
                              className="text-xs font-semibold text-[#FF3F6C] hover:underline disabled:opacity-40 disabled:cursor-not-allowed whitespace-nowrap"
                            >
                              {user.is_active ? 'Block' : 'Unblock'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="md:hidden divide-y divide-gray-100">
                {filteredUsers.map((user) => (
                  <div key={user.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
                        style={{ backgroundColor: avatarColor(user.username) }}
                      >
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-[#282C3F] truncate">{user.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user.email || 'No email'}</p>
                        <div className="flex flex-wrap gap-1.5 mt-1.5">
                          {user.is_staff && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-[#E6F7F6] text-[#14958F]">
                              Admin
                            </span>
                          )}
                          <span
                            className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                              user.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                            }`}
                          >
                            {user.is_active ? 'Active' : 'Blocked'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
                      <span>Joined {formatDate(user.date_joined)}</span>
                      <span>
                        {user.order_count} orders · ₹{Number(user.total_spent || 0).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 mt-3">
                      <button
                        onClick={() => handleToggleStaff(user)}
                        disabled={busyId === user.id || user.username === myUsername}
                        className="text-xs font-semibold text-[#14958F] disabled:opacity-40"
                      >
                        {user.is_staff ? 'Remove admin' : 'Make admin'}
                      </button>
                      <button
                        onClick={() => handleToggleActive(user)}
                        disabled={busyId === user.id || user.username === myUsername}
                        className="text-xs font-semibold text-[#FF3F6C] disabled:opacity-40"
                      >
                        {user.is_active ? 'Block' : 'Unblock'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;

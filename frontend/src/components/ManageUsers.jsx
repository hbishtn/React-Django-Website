import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';

function ManageUsers() {
  const { token, username: currentUsername } = useAuth();
  const [stats, setStats] = useState({ total_users: 0, admin_count: 0, new_this_week: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/manage-users/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setStats({
          total_users: data.total_users || 0,
          admin_count: data.admin_count || 0,
          new_this_week: data.new_this_week || 0,
        });
        setUsers(data.users || []);
      })
      .finally(() => setLoading(false));
  }, [token]);

  const handleToggleStaff = (userId) => {
    setUpdatingId(userId);
    fetch(`${import.meta.env.VITE_API_URL}/manage-users/${userId}/toggle-staff/`, {
      method: 'POST',
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.id) {
          setUsers((prev) =>
            prev.map((u) => (u.id === userId ? { ...u, is_staff: data.is_staff } : u))
          );
          setStats((prev) => ({
            ...prev,
            admin_count: prev.admin_count + (data.is_staff ? 1 : -1),
          }));
        }
      })
      .finally(() => setUpdatingId(null));
  };

  const visibleUsers = useMemo(() => {
    let list = users;

    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) => u.username.toLowerCase().includes(q) || (u.email || '').toLowerCase().includes(q)
      );
    }

    const sorted = [...list];
    if (sortBy === 'newest') {
      sorted.sort((a, b) => new Date(b.date_joined) - new Date(a.date_joined));
    } else if (sortBy === 'oldest') {
      sorted.sort((a, b) => new Date(a.date_joined) - new Date(b.date_joined));
    } else if (sortBy === 'az') {
      sorted.sort((a, b) => a.username.localeCompare(b.username));
    }
    return sorted;
  }, [users, search, sortBy]);

  if (loading) {
    return <p className="text-center mt-10 text-[#7E818C]">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-[#F0F1F3] p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Serious admin header */}
        <div className="bg-[#1B2030] rounded-xl px-5 py-5 mb-5">
          <h2 className="text-lg font-bold text-white">User Management</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Registered accounts, roles and access control
          </p>

          <div className="grid grid-cols-3 gap-3 mt-4">
            <div className="bg-white/5 rounded-lg px-3 py-2.5">
              <p className="text-[11px] text-gray-400">Total Users</p>
              <p className="text-xl font-bold text-white mt-0.5">{stats.total_users}</p>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2.5">
              <p className="text-[11px] text-gray-400">Admins</p>
              <p className="text-xl font-bold text-white mt-0.5">{stats.admin_count}</p>
            </div>
            <div className="bg-white/5 rounded-lg px-3 py-2.5">
              <p className="text-[11px] text-gray-400">New This Week</p>
              <p className="text-xl font-bold text-white mt-0.5">{stats.new_this_week}</p>
            </div>
          </div>
        </div>

        {/* Search + sort controls */}
        <div className="flex flex-col sm:flex-row gap-2 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by username or email..."
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-[#282C3F]"
          />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="az">Name (A–Z)</option>
          </select>
        </div>

        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
          {visibleUsers.length === 0 ? (
            <p className="text-center text-sm text-[#7E818C] py-10">
              {search ? 'No users match your search.' : 'No users found.'}
            </p>
          ) : (
            <div className="divide-y divide-gray-100">
              {visibleUsers.map((user) => {
                const initial = user.username.charAt(0).toUpperCase();
                const isSelf = user.username === currentUsername;

                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors"
                  >
                    <div className="w-9 h-9 rounded-full bg-[#282C3F] text-white flex items-center justify-center text-sm font-bold shrink-0">
                      {initial}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#282C3F] truncate flex items-center gap-2">
                        {user.username}
                        {user.is_staff && (
                          <span className="text-[10px] bg-[#282C3F] text-white px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">
                            Admin
                          </span>
                        )}
                        {isSelf && (
                          <span className="text-[10px] text-gray-400 font-medium">(you)</span>
                        )}
                      </p>
                      <p className="text-xs text-[#7E818C] truncate">{user.email || 'No email'}</p>
                    </div>

                    <p className="text-[11px] text-gray-400 shrink-0 hidden sm:block">
                      Joined {new Date(user.date_joined).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </p>

                    <button
                      onClick={() => handleToggleStaff(user.id)}
                      disabled={isSelf || updatingId === user.id}
                      className={`shrink-0 text-xs font-semibold px-3 py-1.5 rounded-full border transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                        user.is_staff
                          ? 'border-red-200 text-red-600 hover:bg-red-50'
                          : 'border-[#282C3F] text-[#282C3F] hover:bg-[#282C3F] hover:text-white'
                      }`}
                    >
                      {updatingId === user.id
                        ? '...'
                        : user.is_staff
                        ? 'Remove Admin'
                        : 'Make Admin'}
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;
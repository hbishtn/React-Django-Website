import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

function ManageUsers() {
  const { token } = useAuth();
  const [totalUsers, setTotalUsers] = useState(0);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/manage-users/`, {
      headers: { Authorization: `Token ${token}` },
    })
      .then((response) => response.json())
      .then((data) => {
        setTotalUsers(data.total_users || 0);
        setUsers(data.users || []);
      })
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) {
    return <p className="text-center mt-10 text-[#7E818C]">Loading...</p>;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F6] p-6">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-xl font-bold text-[#282C3F] mb-1">Manage Users</h2>
        <p className="text-sm text-[#7E818C] mb-4">
          Total Users: <span className="font-bold text-[#FF3F6C]">{totalUsers}</span>
        </p>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          {users.length === 0 ? (
            <p className="text-center text-sm text-[#7E818C] py-8">Koi user nahi mila.</p>
          ) : (
            <div className="divide-y divide-gray-100">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between px-4 py-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#282C3F] truncate">
                      {user.username}
                      {user.is_staff && (
                        <span className="ml-2 text-[10px] bg-[#FF3F6C] text-white px-1.5 py-0.5 rounded font-bold uppercase">
                          Admin
                        </span>
                      )}
                    </p>
                    <p className="text-xs text-[#7E818C] truncate">{user.email || 'No email'}</p>
                  </div>
                  <p className="text-[11px] text-gray-400 shrink-0 ml-3">
                    {new Date(user.date_joined).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ManageUsers;

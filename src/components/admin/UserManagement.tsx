'use client';

import { useState, useEffect } from 'react';
import { Shield, ShieldOff } from 'lucide-react';

interface User {
  id: number;
  email: string;
  roles: string[];
}

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('brilliant_token');
      if (!token) {
        setError('Please log in to view users');
        setLoading(false);
        return;
      }

      const response = await fetch('http://localhost:9090/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 403) {
        setError('You do not have permission to view users');
        setUsers([]);
      } else if (!response.ok) {
        throw new Error('Failed to fetch users');
      } else {
        const data = await response.json();
        setUsers(data);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Unable to load users. Please try again later.');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleAdmin = async (userId: number, isAdmin: boolean) => {
    try {
      const token = localStorage.getItem('brilliant_token');
      if (!token) {
        setError('Please log in to manage users');
        return;
      }

      const endpoint = isAdmin 
        ? `http://localhost:9090/api/admin/users/${userId}/remove-admin`
        : `http://localhost:9090/api/admin/users/${userId}/make-admin`;

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.status === 403) {
        setError('You do not have permission to manage users');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to update user role');
      }

      // Update local state
      setUsers(users.map(user => {
        if (user.id === userId) {
          const newRoles = isAdmin
            ? user.roles.filter(role => role !== 'ROLE_ADMIN')
            : [...user.roles, 'ROLE_ADMIN'];
          return { ...user, roles: newRoles };
        }
        return user;
      }));
      setError(null);
    } catch (error) {
      console.error('Error updating user role:', error);
      setError('Unable to update user role. Please try again later.');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">User Management</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {!error && users.length > 0 && (
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {users.map((user) => {
              const isAdmin = user.roles.includes('ROLE_ADMIN');
              return (
                <li key={user.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.email}</p>
                      <p className="text-sm text-gray-500">
                        Roles: {user.roles.join(', ')}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleAdmin(user.id, isAdmin)}
                      className={`inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white ${
                        isAdmin
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {isAdmin ? (
                        <>
                          <ShieldOff className="h-4 w-4 mr-2" />
                          Remove Admin
                        </>
                      ) : (
                        <>
                          <Shield className="h-4 w-4 mr-2" />
                          Make Admin
                        </>
                      )}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {!error && users.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          No users found
        </div>
      )}
    </div>
  );
} 
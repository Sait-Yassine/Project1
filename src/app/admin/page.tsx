'use client';

import AdminLayout from '@/components/admin/AdminLayout';
import { DatabaseManager } from '@/components/admin/DatabaseManager';
import UserManagement from '@/components/admin/UserManagement';

export default function AdminPage() {
  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Database Management</h2>
          <DatabaseManager />
        </div>
        <div>
          <UserManagement />
        </div>
      </div>
    </AdminLayout>
  );
} 
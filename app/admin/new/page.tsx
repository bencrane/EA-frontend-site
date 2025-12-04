import { AdminLayout, SystemForm } from '@/components/admin';

export default function NewSystemPage() {
  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Create New System</h1>
        <p className="text-gray-600 mt-1">
          Add a new automation system to the catalog
        </p>
      </div>
      <SystemForm mode="create" />
    </AdminLayout>
  );
}

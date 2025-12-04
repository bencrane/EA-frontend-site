import { notFound } from 'next/navigation';
import { AdminLayout, SystemForm } from '@/components/admin';
import { getSystemById } from '@/lib/systems';

interface PageProps {
  params: Promise<{ id: string }>;
}

export const dynamic = 'force-dynamic';

export default async function EditSystemPage({ params }: PageProps) {
  const { id } = await params;
  const system = await getSystemById(id);

  if (!system) {
    notFound();
  }

  return (
    <AdminLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Edit System</h1>
        <p className="text-gray-600 mt-1">
          Update &quot;{system.title}&quot;
        </p>
      </div>
      <SystemForm system={system} mode="edit" />
    </AdminLayout>
  );
}

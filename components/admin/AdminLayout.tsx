'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/admin/login');
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-8">
              <Link
                href="/admin"
                className="text-xl font-semibold text-gray-900"
              >
                EA Admin
              </Link>
              <nav className="hidden md:flex items-center space-x-6">
                <Link
                  href="/admin"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  Systems
                </Link>
                <Link
                  href="/"
                  target="_blank"
                  className="text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                >
                  View Site
                </Link>
              </nav>
            </div>
            <Button variant="ghost" size="sm" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}

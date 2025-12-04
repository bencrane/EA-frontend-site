import Layout from '@/components/Layout';
import SystemGrid from '@/components/SystemGrid';
import { getLiveSystems } from '@/lib/systems';

export const revalidate = 60;

export default async function HomePage() {
  const systems = await getLiveSystems();

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Automation Systems Catalog
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our collection of intelligent automation systems designed to
            streamline your business processes and boost productivity.
          </p>
        </div>
        <SystemGrid systems={systems} />
      </div>
    </Layout>
  );
}

import SystemCard from './SystemCard';
import { EASystem } from '@/types/database';

interface SystemGridProps {
  systems: EASystem[];
}

export default function SystemGrid({ systems }: SystemGridProps) {
  if (systems.length === 0) {
    return (
      <div className="text-center py-16">
        <svg
          className="mx-auto h-16 w-16 text-gray-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
          />
        </svg>
        <h3 className="mt-4 text-lg font-medium text-gray-900">
          No systems available
        </h3>
        <p className="mt-2 text-gray-500">
          Check back soon for new automation systems.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {systems.map((system) => (
        <SystemCard key={system.id} system={system} />
      ))}
    </div>
  );
}

import Link from 'next/link';
import Image from 'next/image';
import { Card, Badge } from '@/components/ui';
import { EASystem } from '@/types/database';

interface SystemCardProps {
  system: EASystem;
}

export default function SystemCard({ system }: SystemCardProps) {
  return (
    <Link href={`/systems/${system.slug}`}>
      <Card hover className="overflow-hidden h-full flex flex-col">
        {system.hero_image_url ? (
          <div className="relative h-48 bg-gray-100">
            <Image
              src={system.hero_image_url}
              alt={system.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          </div>
        ) : (
          <div className="h-48 bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center">
            <svg
              className="w-16 h-16 text-blue-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          </div>
        )}
        <div className="p-6 flex-1 flex flex-col">
          <div className="mb-2">
            <Badge variant="primary" size="sm">
              {system.category}
            </Badge>
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {system.title}
          </h3>
          <p className="text-gray-600 text-sm flex-1">
            {system.short_description}
          </p>
          <div className="mt-4 text-blue-600 text-sm font-medium">
            Learn more &rarr;
          </div>
        </div>
      </Card>
    </Link>
  );
}

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import Layout from '@/components/Layout';
import SystemDetailSections from '@/components/SystemDetailSections';
import { Badge, Button } from '@/components/ui';
import { getSystemBySlug, getLiveSystems } from '@/lib/systems';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const systems = await getLiveSystems();
  return systems.map((system) => ({
    slug: system.slug,
  }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const system = await getSystemBySlug(slug);

  if (!system) {
    return { title: 'System Not Found' };
  }

  return {
    title: `${system.title} | Everything Automation`,
    description: system.short_description || system.long_description,
  };
}

export default async function SystemDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const system = await getSystemBySlug(slug);

  if (!system) {
    notFound();
  }

  return (
    <Layout>
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900 transition-colors"
          >
            <svg
              className="w-4 h-4 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back to Catalog
          </Link>
        </div>

        <header className="mb-8">
          <Badge variant="primary" className="mb-4">
            {system.category}
          </Badge>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            {system.title}
          </h1>
          {system.short_description && (
            <p className="text-xl text-gray-600">{system.short_description}</p>
          )}
        </header>

        {system.hero_image_url && (
          <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 bg-gray-100">
            <Image
              src={system.hero_image_url}
              alt={system.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {system.long_description && (
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">
              {system.long_description}
            </p>
          </div>
        )}

        <SystemDetailSections attributes={system.attributes} />

        <div className="mt-12 pt-8 border-t border-gray-200">
          <Link href="/">
            <Button variant="outline">
              <svg
                className="w-4 h-4 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Back to Catalog
            </Button>
          </Link>
        </div>
      </article>
    </Layout>
  );
}

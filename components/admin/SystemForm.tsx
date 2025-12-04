'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Textarea, Select, Label } from '@/components/ui';
import ImageUploader from './ImageUploader';
import { EASystem, EASystemInsert, EASystemUpdate, SystemStatus } from '@/types/database';
import { generateSlug } from '@/lib/systems';

interface SystemFormProps {
  system?: EASystem | null;
  mode: 'create' | 'edit';
}

interface FormData {
  title: string;
  slug: string;
  short_description: string;
  long_description: string;
  category: string;
  status: SystemStatus;
  order_index: number;
  hero_image_url: string | null;
  attributes: {
    steps: string[];
    tools: string[];
    outputs: string[];
    benefits: string[];
  };
}

const defaultFormData: FormData = {
  title: '',
  slug: '',
  short_description: '',
  long_description: '',
  category: 'General',
  status: 'draft',
  order_index: 0,
  hero_image_url: null,
  attributes: {
    steps: [],
    tools: [],
    outputs: [],
    benefits: [],
  },
};

const categories = [
  'General',
  'Finance',
  'HR',
  'Operations',
  'Customer Service',
  'Analytics',
  'Sales',
  'Marketing',
  'IT',
];

export default function SystemForm({ system, mode }: SystemFormProps) {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(defaultFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [attributesText, setAttributesText] = useState({
    steps: '',
    tools: '',
    outputs: '',
    benefits: '',
  });

  useEffect(() => {
    if (system) {
      const attrs = system.attributes || {};
      setFormData({
        title: system.title,
        slug: system.slug,
        short_description: system.short_description || '',
        long_description: system.long_description || '',
        category: system.category,
        status: system.status,
        order_index: system.order_index,
        hero_image_url: system.hero_image_url,
        attributes: {
          steps: attrs.steps || [],
          tools: attrs.tools || [],
          outputs: attrs.outputs || [],
          benefits: attrs.benefits || [],
        },
      });
      setAttributesText({
        steps: (attrs.steps || []).join('\n'),
        tools: (attrs.tools || []).join('\n'),
        outputs: (attrs.outputs || []).join('\n'),
        benefits: (attrs.benefits || []).join('\n'),
      });
    }
  }, [system]);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setFormData((prev) => ({
      ...prev,
      title,
      slug: mode === 'create' ? generateSlug(title) : prev.slug,
    }));
  };

  const handleAttributeChange = (
    key: 'steps' | 'tools' | 'outputs' | 'benefits',
    value: string
  ) => {
    setAttributesText((prev) => ({ ...prev, [key]: value }));
    const items = value
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    setFormData((prev) => ({
      ...prev,
      attributes: { ...prev.attributes, [key]: items },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      // Validation
      if (!formData.title.trim()) {
        throw new Error('Title is required');
      }
      if (!formData.slug.trim()) {
        throw new Error('Slug is required');
      }

      const payload: EASystemInsert | EASystemUpdate = {
        title: formData.title.trim(),
        slug: formData.slug.trim(),
        short_description: formData.short_description.trim() || null,
        long_description: formData.long_description.trim() || null,
        category: formData.category,
        status: formData.status,
        order_index: formData.order_index,
        hero_image_url: formData.hero_image_url,
        attributes: formData.attributes,
      };

      const url = '/api/admin/save';
      const body =
        mode === 'edit'
          ? { id: system?.id, ...payload }
          : payload;

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save system');
      }

      router.push('/admin');
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Basic Information
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="title" required>
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={handleTitleChange}
              placeholder="Invoice Processing Automation"
            />
          </div>
          <div>
            <Label htmlFor="slug" required>
              Slug
            </Label>
            <Input
              id="slug"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, slug: e.target.value }))
              }
              placeholder="invoice-processing-automation"
            />
          </div>
          <div>
            <Label htmlFor="category">Category</Label>
            <Select
              id="category"
              value={formData.category}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, category: e.target.value }))
              }
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <Select
              id="status"
              value={formData.status}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  status: e.target.value as SystemStatus,
                }))
              }
            >
              <option value="draft">Draft</option>
              <option value="live">Live</option>
              <option value="hidden">Hidden</option>
            </Select>
          </div>
          <div>
            <Label htmlFor="order_index">Order Index</Label>
            <Input
              id="order_index"
              type="number"
              value={formData.order_index}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  order_index: parseInt(e.target.value) || 0,
                }))
              }
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">
          Descriptions
        </h2>
        <div className="space-y-6">
          <div>
            <Label htmlFor="short_description">Short Description</Label>
            <Textarea
              id="short_description"
              value={formData.short_description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  short_description: e.target.value,
                }))
              }
              placeholder="Brief description shown on cards..."
              className="min-h-[80px]"
            />
          </div>
          <div>
            <Label htmlFor="long_description">Long Description</Label>
            <Textarea
              id="long_description"
              value={formData.long_description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  long_description: e.target.value,
                }))
              }
              placeholder="Detailed description shown on the detail page..."
              className="min-h-[150px]"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Hero Image</h2>
        <ImageUploader
          currentImageUrl={formData.hero_image_url}
          onImageChange={(url) =>
            setFormData((prev) => ({ ...prev, hero_image_url: url }))
          }
        />
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-6">Attributes</h2>
        <p className="text-sm text-gray-500 mb-6">
          Enter one item per line for each attribute section.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="steps">Steps (How It Works)</Label>
            <Textarea
              id="steps"
              value={attributesText.steps}
              onChange={(e) => handleAttributeChange('steps', e.target.value)}
              placeholder="Step 1&#10;Step 2&#10;Step 3"
              className="min-h-[120px]"
            />
          </div>
          <div>
            <Label htmlFor="tools">Tools & Integrations</Label>
            <Textarea
              id="tools"
              value={attributesText.tools}
              onChange={(e) => handleAttributeChange('tools', e.target.value)}
              placeholder="Tool 1&#10;Tool 2&#10;Tool 3"
              className="min-h-[120px]"
            />
          </div>
          <div>
            <Label htmlFor="outputs">Outputs & Deliverables</Label>
            <Textarea
              id="outputs"
              value={attributesText.outputs}
              onChange={(e) => handleAttributeChange('outputs', e.target.value)}
              placeholder="Output 1&#10;Output 2&#10;Output 3"
              className="min-h-[120px]"
            />
          </div>
          <div>
            <Label htmlFor="benefits">Key Benefits</Label>
            <Textarea
              id="benefits"
              value={attributesText.benefits}
              onChange={(e) =>
                handleAttributeChange('benefits', e.target.value)
              }
              placeholder="Benefit 1&#10;Benefit 2&#10;Benefit 3"
              className="min-h-[120px]"
            />
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting
            ? 'Saving...'
            : mode === 'create'
            ? 'Create System'
            : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
}

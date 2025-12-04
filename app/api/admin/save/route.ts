import { NextRequest, NextResponse } from 'next/server';
import { createSystem, updateSystem, isSlugUnique } from '@/lib/systems';
import { EASystemInsert, EASystemUpdate } from '@/types/database';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...data } = body;

    // Validate required fields
    if (!data.title?.trim()) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    if (!data.slug?.trim()) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // Validate status
    const validStatuses = ['draft', 'live', 'hidden'];
    if (data.status && !validStatuses.includes(data.status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const slugUnique = await isSlugUnique(data.slug, id);
    if (!slugUnique) {
      return NextResponse.json(
        { error: 'Slug is already in use' },
        { status: 400 }
      );
    }

    let result;

    if (id) {
      // Update existing system
      const updates: EASystemUpdate = {
        title: data.title.trim(),
        slug: data.slug.trim(),
        short_description: data.short_description?.trim() || null,
        long_description: data.long_description?.trim() || null,
        category: data.category || 'General',
        status: data.status || 'draft',
        order_index: data.order_index ?? 0,
        hero_image_url: data.hero_image_url || null,
        attributes: data.attributes || {},
      };

      result = await updateSystem(id, updates);
    } else {
      // Create new system
      const newSystem: EASystemInsert = {
        title: data.title.trim(),
        slug: data.slug.trim(),
        short_description: data.short_description?.trim() || null,
        long_description: data.long_description?.trim() || null,
        category: data.category || 'General',
        status: data.status || 'draft',
        order_index: data.order_index ?? 0,
        hero_image_url: data.hero_image_url || null,
        attributes: data.attributes || {},
      };

      result = await createSystem(newSystem);
    }

    return NextResponse.json({ success: true, data: result });
  } catch (error) {
    console.error('Save error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to save system' },
      { status: 500 }
    );
  }
}

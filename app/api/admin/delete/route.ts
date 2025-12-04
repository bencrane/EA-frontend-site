import { NextRequest, NextResponse } from 'next/server';
import { deleteSystem } from '@/lib/systems';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'System ID is required' },
        { status: 400 }
      );
    }

    await deleteSystem(id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to delete system' },
      { status: 500 }
    );
  }
}

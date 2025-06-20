import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/spaces - Get all spaces or a single space by ID
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const spaceId = searchParams.get('id');

  try {
    
    if (spaceId) {
      const { data: space, error } = await supabase
        .from('spaces')
        .select('*')
        .eq('id', spaceId)
        .single();
      
      if (error) throw error;
      return NextResponse.json(space);
    }

    const { data: spaces, error } = await supabase
      .from('spaces')
      .select('*');
      
    if (error) throw error;
    return NextResponse.json(spaces);
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch spaces' },
      { status: 500 }
    );
  }
}

// POST /api/spaces - Create a new space
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createClientSupabase();

    const { data, error } = await supabase
      .from('spaces')
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: 'Space created successfully',
        data
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/spaces:', error);
    return NextResponse.json(
      { error: 'Failed to create space' },
      { status: 500 }
    );
  }
}

// PUT /api/spaces - Update an existing space
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const supabase = createClientSupabase();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Space ID is required for update' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('spaces')
      .update(body)
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Space updated successfully',
      data
    });
  } catch (error) {
    console.error('Error in PUT /api/spaces:', error);
    return NextResponse.json(
      { error: 'Failed to update space' },
      { status: 500 }
    );
  }
}

// DELETE /api/spaces - Delete a space
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const spaceId = searchParams.get('id');
    
    if (!spaceId) {
      return NextResponse.json(
        { error: 'Space ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClientSupabase();
    const { error } = await supabase
      .from('spaces')
      .update({ deleted: true })
      .eq('id', spaceId);
      
    if (error) throw error;
    
    return NextResponse.json(
      { message: 'Space deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/spaces:', error);
    return NextResponse.json(
      { error: 'Failed to delete space' },
      { status: 500 }
    );
  }
}

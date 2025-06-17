import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();

    const { data, error } = await supabase
      .from('users')
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: 'User created successfully',
        data
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/users:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}

// DELETE /api/users - Delete a user
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClientSupabase();
    const { error } = await supabase
      .from('users')
      .update({ deleted: true })
      .eq('id', userId);

    if (error) throw error;

    return NextResponse.json(
      { message: 'User deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/users:', error);
    return NextResponse.json(
      { error: 'Failed to delete user' },
      { status: 500 }
    );
  }
}

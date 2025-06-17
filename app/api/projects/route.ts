import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET /api/projects - Get all projects or a single project by ID
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const projectId = searchParams.get('id');

  try {
    
    if (projectId) {
      const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();
      
      if (error) throw error;
      return NextResponse.json(project);
    }

    const { data: projects, error } = await supabase.from('projects').select('*');
    if (error) throw error;
    
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Error in GET /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to fetch projects' },
      { status: 500 }
    );
  }
}

// POST /api/projects - Create a new project
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const supabase = createClientSupabase();

    const { data, error } = await supabase
      .from('projects')
      .insert(body)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        message: 'Project created successfully',
        data
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error in POST /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to create project' },
      { status: 500 }
    );
  }
}

// PUT /api/projects - Update an existing project
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const supabase = createClientSupabase();

    if (!body.id) {
      return NextResponse.json(
        { error: 'Project ID is required for update' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('projects')
      .update(body)
      .eq('id', body.id)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({
      message: 'Project updated successfully',
      data
    });
  } catch (error) {
    console.error('Error in PUT /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to update project' },
      { status: 500 }
    );
  }
}

// DELETE /api/projects - Delete a project
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get('id');
    
    if (!projectId) {
      return NextResponse.json(
        { error: 'Project ID is required' },
        { status: 400 }
      );
    }

    const supabase = createClientSupabase();
    const { error } = await supabase
      .from('projects')
      .update({ deleted: true })
      .eq('id', projectId);
      
    if (error) throw error;
    
    return NextResponse.json(
      { message: 'Project deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error in DELETE /api/projects:', error);
    return NextResponse.json(
      { error: 'Failed to delete project' },
      { status: 500 }
    );
  }
}

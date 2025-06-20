import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    const body = await request.json();

    const { data, error } = await supabase
        .storage
        .from('avatars')
        .createSignedUploadUrl(body.path);

    if (error) return NextResponse.json(
      { error: 'Failed to generate the upload url' },
      { status: 500 }
    );

    return NextResponse.json(
        {
        message: 'Upload url created successfully',
        data: data
        },
        { status: 201 }
    );
}
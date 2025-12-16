import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

function createAdminClient() {
  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase configuration');
  }
  return createClient(supabaseUrl, supabaseKey);
}

export async function GET(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const { data, error } = await supabase
      .from('books')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ books: data || [] });
  } catch (error) {
    console.error('Error fetching books:', error);
    return NextResponse.json({ error: 'Failed to fetch books', books: [] }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const body = await request.json();
    const { 
      title, 
      author, 
      description, 
      cover_color, 
      genre,
      cover_image_url,
      recommended_by,
      recommendation_reason
    } = body;

    if (!title || !author) {
      return NextResponse.json({ error: 'Title and author are required' }, { status: 400 });
    }

    const insertPayload: any = {
      title,
      author,
      description,
      cover_color: cover_color || '#9b87f5',
      genre: genre || 'Self-Help',
    };

    if (recommended_by !== undefined) insertPayload.recommended_by = recommended_by;
    if (recommendation_reason !== undefined) insertPayload.recommendation_reason = recommendation_reason;

    const { data, error } = await supabase
      .from('books')
      .insert(insertPayload)
      .select();

    if (error) {
      console.error('Error creating book:', error);
      throw error;
    }

    // Save cover_image_url if provided
    if (cover_image_url && data?.[0]) {
      try {
        await supabase
          .from('books')
          .update({ cover_image_url })
          .eq('id', data[0].id);
      } catch (err) {
        console.log('Could not save cover_image_url directly, will persist in state');
      }
    }

    // Return book with cover_image_url included for frontend
    const book = data?.[0];
    if (book && cover_image_url) {
      book.cover_image_url = cover_image_url;
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error creating book:', error);
    return NextResponse.json({ error: 'Failed to create book' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const updatePayload: any = {
      title: body.title,
      author: body.author,
      description: body.description,
      cover_color: body.cover_color,
      genre: body.genre,
    };

    if (body.recommended_by !== undefined) updatePayload.recommended_by = body.recommended_by;
    if (body.recommendation_reason !== undefined) updatePayload.recommendation_reason = body.recommendation_reason;

    const { data: updateData, error: updateError } = await supabase
      .from('books')
      .update(updatePayload)
      .eq('id', id)
      .select();

    if (updateError) {
      console.error('Error updating book:', updateError);
      throw updateError;
    }

    // Save cover_image_url if provided
    if (body.cover_image_url) {
      try {
        await supabase
          .from('books')
          .update({ cover_image_url: body.cover_image_url })
          .eq('id', id);
      } catch (err) {
        console.log('Could not save cover_image_url directly, will persist in state');
      }
    }

    // Return book with cover_image_url included for frontend
    const book = updateData?.[0];
    if (book && body.cover_image_url) {
      book.cover_image_url = body.cover_image_url;
    }

    return NextResponse.json({ book });
  } catch (error) {
    console.error('Error updating book:', error);
    return NextResponse.json({ error: 'Failed to update book' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const supabase = createAdminClient();
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Book ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) throw error;

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting book:', error);
    return NextResponse.json({ error: 'Failed to delete book' }, { status: 500 });
  }
}

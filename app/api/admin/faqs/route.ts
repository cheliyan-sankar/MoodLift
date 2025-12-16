import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key'
);

function checkCredentials() {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Missing Supabase credentials' },
      { status: 500 }
    );
  }
  return null;
}

// GET FAQs for a specific page
export async function GET(request: NextRequest) {
  const credError = checkCredentials();
  if (credError) return credError;
  
  try {
    const { searchParams } = new URL(request.url);
    const page = searchParams.get('page');

    if (!page) {
      return NextResponse.json({ error: 'Page parameter required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('faqs')
      .select('*')
      .eq('page', page)
      .eq('active', true)
      .order('sort_order', { ascending: true });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// CREATE new FAQ
export async function POST(request: NextRequest) {
  const credError = checkCredentials();
  if (credError) return credError;
  
  try {
    const body = await request.json();
    const { page, question, answer, sort_order } = body;

    if (!page || !question || !answer) {
      return NextResponse.json(
        { error: 'Page, question, and answer are required' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('faqs')
      .insert({
        page,
        question,
        answer,
        sort_order: sort_order || 0,
        active: true,
      })
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// UPDATE FAQ
export async function PUT(request: NextRequest) {
  const credError = checkCredentials();
  if (credError) return credError;
  
  try {
    const body = await request.json();
    const { id, page, question, answer, sort_order, active } = body;

    if (!id) {
      return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('faqs')
      .update({
        page,
        question,
        answer,
        sort_order,
        active,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

// DELETE FAQ
export async function DELETE(request: NextRequest) {
  const credError = checkCredentials();
  if (credError) return credError;
  
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'FAQ ID is required' }, { status: 400 });
    }

    const { error } = await supabase
      .from('faqs')
      .delete()
      .eq('id', id);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

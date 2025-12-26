import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseServiceKey || 'placeholder-key'
);

function mapSupabaseErrorMessage(message: string) {
  if (!message) return message;

  // Supabase/PostgREST returns this when the table doesn't exist in the connected project
  // (or its schema cache hasn't been refreshed).
  if (
    message.includes("Could not find the table") ||
    message.includes('schema cache')
  ) {
    return (
      message +
      ' — The `faqs` table is missing (or the schema cache is stale). ' +
      'Run the SQL migration at `supabase/migrations/20251127_create_faqs_table.sql` in your Supabase project, ' +
      "then refresh the API schema cache (e.g., run `NOTIFY pgrst, 'reload schema';`)."
    );
  }

  return message;
}

function checkCredentials() {
  if (!supabaseUrl || !supabaseServiceKey) {
    const missing: string[] = [];
    if (!supabaseUrl) missing.push('SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL)');
    if (!supabaseServiceKey) missing.push('SUPABASE_SERVICE_ROLE_KEY');
    return NextResponse.json(
      { error: `Missing Supabase credentials: ${missing.join(', ')}` },
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
      return NextResponse.json(
        { error: mapSupabaseErrorMessage(error.message) },
        { status: 500 }
      );
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
    const { items, page, question, answer, sort_order } = body;

    if (Array.isArray(items)) {
      const normalized = items
        .filter((it: any) => it && typeof it === 'object')
        .map((it: any) => ({
          page: it.page,
          question: it.question,
          answer: it.answer,
          sort_order: typeof it.sort_order === 'number' ? it.sort_order : 0,
          active: typeof it.active === 'boolean' ? it.active : true,
        }));

      if (normalized.length === 0) {
        return NextResponse.json({ error: 'Items array is empty' }, { status: 400 });
      }

      const invalid = normalized.find((it: any) => !it.page || !it.question || !it.answer);
      if (invalid) {
        return NextResponse.json(
          { error: 'Each item must include page, question, and answer' },
          { status: 400 }
        );
      }

      const { data, error } = await supabase
        .from('faqs')
        .insert(normalized)
        .select();

      if (error) {
        return NextResponse.json(
          { error: mapSupabaseErrorMessage(error.message) },
          { status: 500 }
        );
      }

      return NextResponse.json({ data }, { status: 201 });
    }

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
      return NextResponse.json(
        { error: mapSupabaseErrorMessage(error.message) },
        { status: 500 }
      );
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
      return NextResponse.json(
        { error: mapSupabaseErrorMessage(error.message) },
        { status: 500 }
      );
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
      return NextResponse.json(
        { error: mapSupabaseErrorMessage(error.message) },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'FAQ deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

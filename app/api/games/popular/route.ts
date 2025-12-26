import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

function getSupabaseServerClient() {
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) return null;
  return createClient(supabaseUrl, supabaseAnonKey);
}

export async function GET(request: Request) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    return NextResponse.json({ games: [] }, { status: 200 });
  }

  const { searchParams } = new URL(request.url);
  const limit = Math.max(1, Math.min(12, Number(searchParams.get('limit') ?? '3') || 3));

  // Prefer admin-pinned popular games, but gracefully handle older DBs
  // that may not have the `is_popular` column yet.
  try {
    const pinned = await supabase
      .from('games')
      .select('*')
      .eq('is_popular', true)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!pinned.error && pinned.data && pinned.data.length > 0) {
      return NextResponse.json({ games: pinned.data }, { status: 200 });
    }

    // If the column doesn't exist (or any other query error), fall back.
  } catch {
    // ignore
  }

  // Fallback: recent games
  try {
    const recent = await supabase
      .from('games')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (!recent.error && recent.data) {
      return NextResponse.json({ games: recent.data }, { status: 200 });
    }
  } catch {
    // ignore
  }

  return NextResponse.json({ games: [] }, { status: 200 });
}

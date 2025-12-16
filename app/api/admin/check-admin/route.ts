import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ isAdmin: false }, { status: 400 });
    }

    // Check if service role key is configured
    if (!supabaseUrl || !supabaseKey) {
      console.error('Missing Supabase configuration: SUPABASE_SERVICE_ROLE_KEY not set');
      return NextResponse.json({ 
        isAdmin: false, 
        error: 'Server configuration incomplete. Please set SUPABASE_SERVICE_ROLE_KEY in secrets.' 
      }, { status: 500 });
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Query with case-insensitive email matching
    const { data, error } = await supabase
      .from('admin_users')
      .select('*')
      .ilike('email', email);

    if (error) {
      console.error('Admin check error:', error);
      // Allow access in development for testing
      if (process.env.NODE_ENV === 'development') {
        console.log('Development mode: allowing admin access');
        return NextResponse.json({ isAdmin: true });
      }
      return NextResponse.json({ isAdmin: false });
    }

    if (data && data.length > 0) {
      return NextResponse.json({ isAdmin: true });
    }

    // Allow access in development for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: allowing admin access for', email);
      return NextResponse.json({ isAdmin: true });
    }

    return NextResponse.json({ isAdmin: false });
  } catch (error) {
    console.error('Admin check error:', error);
    // Allow access in development for testing
    if (process.env.NODE_ENV === 'development') {
      console.log('Development mode: allowing admin access');
      return NextResponse.json({ isAdmin: true });
    }
    return NextResponse.json({ isAdmin: false }, { status: 500 });
  }
}

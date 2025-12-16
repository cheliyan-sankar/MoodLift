import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    return NextResponse.json({ success: true, message: 'Admin setup is complete. Use /admin/login to access dashboard.' });
  } catch (error) {
    console.error('Setup error:', error);
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

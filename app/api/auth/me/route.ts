import { NextRequest, NextResponse } from 'next/server';
import { CloudDb } from '@/lib/cloud-db';

export async function GET(request: NextRequest) {
  const sessionToken = request.cookies.get('studyflow-session')?.value;

  if (!sessionToken) {
    return NextResponse.json({ user: null });
  }

  const user = await CloudDb.findUserById(sessionToken);

  if (!user) {
    // If token is invalid/not found, clear it
    const response = NextResponse.json({ user: null });
    response.cookies.delete('studyflow-session');
    return response;
  }

  return NextResponse.json({ user });
}

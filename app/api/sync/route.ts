import { NextRequest, NextResponse } from 'next/server';
import { CloudDb } from '@/lib/cloud-db';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('studyflow-session')?.value;
    const snapshot = await request.json();

    if (sessionToken) {
      const user = await CloudDb.findUserById(sessionToken);
      if (user) {
        await CloudDb.saveSnapshot(user.id, snapshot);
      }
    }

    return NextResponse.json({ syncedAt: new Date().toISOString() });
  } catch (err) {
    console.error('Sync POST error:', err);
    return NextResponse.json({ error: 'Failed to sync snapshot' }, { status: 500 });
  }
}
export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('studyflow-session')?.value;

    if (!sessionToken) {
      return NextResponse.json({ snapshot: null });
    }

    const user = await CloudDb.findUserById(sessionToken);
    if (!user) {
      return NextResponse.json({ snapshot: null });
    }

    const snapshot = await CloudDb.getSnapshot(user.id);
    return NextResponse.json({ snapshot });
  } catch (err) {
    console.error('Sync GET error:', err);
    return NextResponse.json({ error: 'Failed to retrieve snapshot' }, { status: 500 });
  }
}

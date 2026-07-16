import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const clientId = process.env.GOOGLE_CLIENT_ID;

  if (clientId) {
    const redirectUri = `${origin}/api/auth/callback`;
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
    });

    const url = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    return NextResponse.json({ url, isMock: false });
  } else {
    // Prevent fallback to mock auth in production
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        { error: 'Google OAuth is not configured on this server. Please set GOOGLE_CLIENT_ID.' },
        { status: 500 }
      );
    }
    // If GOOGLE_CLIENT_ID is not set in development, use the interactive mock sandbox page
    const url = `${origin}/api/auth/mock-login`;
    return NextResponse.json({ url, isMock: true });
  }
}

import { NextRequest, NextResponse } from 'next/server';
import { CloudDb } from '@/lib/cloud-db';

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin;
  const { searchParams } = request.nextUrl;
  const code = searchParams.get('code');

  if (!code) {
    return new Response('No authorization code provided.', { status: 400 });
  }

  let email = '';
  let name = '';

  try {
    if (code.startsWith('mock_code_')) {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('Mock authentication is disabled in production.');
      }
      // Decode mock credentials
      const base64Data = code.replace('mock_code_', '');
      const data = JSON.parse(atob(decodeURIComponent(base64Data)));
      email = data.email || 'guest@studyflow.local';
      name = data.name || 'Sandbox Guest';
    } else {
      // Real Google OAuth code exchange
      const clientId = process.env.GOOGLE_CLIENT_ID;
      const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
      if (!clientId || !clientSecret) {
        throw new Error('Google OAuth is not fully configured on server.');
      }

      const redirectUri = `${origin}/api/auth/callback`;
      
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: 'authorization_code',
        }),
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        throw new Error(`Failed to exchange authorization code: ${errorText}`);
      }

      const tokenData = await tokenResponse.json();
      const accessToken = tokenData.access_token;

      const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${accessToken}` },
      });

      if (!userInfoResponse.ok) {
        throw new Error('Failed to fetch user profile from Google.');
      }

      const userInfo = await userInfoResponse.json();
      email = userInfo.email;
      name = userInfo.name || userInfo.given_name || 'Google User';
    }

    if (!email) {
      throw new Error('No email returned from provider.');
    }

    // Upsert user in database
    const user = await CloudDb.createUser(email, name);

    // Prepare success response
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Authentication Success</title>
        </head>
        <body style="font-family: -apple-system, sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; background-color: #f5f5f0; color: #1a1a1a;">
          <div style="text-align: center; padding: 20px;">
            <h2 style="margin-bottom: 8px;">Connecting StudyFlow...</h2>
            <p style="color: #8a8a83; font-size: 14px;">This window should close automatically.</p>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'OAUTH_AUTH_SUCCESS' }, '*');
                window.close();
              } else {
                window.location.href = '/';
              }
            </script>
          </div>
        </body>
      </html>
    `;

    const response = new NextResponse(html, {
      headers: { 'content-type': 'text/html' },
    });

    // Set the session cookie with proper properties to support cross-origin iframe embedding
    response.cookies.set('studyflow-session', user.id, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      path: '/',
      maxAge: 60 * 60 * 24 * 30, // 30 days
    });

    return response;
  } catch (err) {
    console.error('Callback error:', err);
    return new Response(
      `Authentication failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      { status: 500 }
    );
  }
}

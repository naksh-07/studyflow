import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  if (process.env.NODE_ENV === 'production') {
    return new Response('Mock login is disabled in production.', { status: 403 });
  }

  const origin = request.nextUrl.origin;

  const html = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign in with Google - StudyFlow Sandbox</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap" rel="stylesheet">
        <style>
          body {
            font-family: 'Inter', sans-serif;
            background-color: #f5f5f0;
            color: #1a1a1a;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            margin: 0;
            padding: 20px;
            box-sizing: border-box;
          }
          .card {
            background: #ffffff;
            border: 1px solid #e5e5df;
            border-radius: 24px;
            padding: 40px;
            width: 100%;
            max-width: 400px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
            text-align: center;
          }
          .logo {
            font-size: 28px;
            font-weight: 600;
            margin-bottom: 8px;
            letter-spacing: -0.02em;
          }
          .subtitle {
            color: #8a8a83;
            font-size: 14px;
            margin-bottom: 32px;
          }
          .sandbox-badge {
            display: inline-block;
            background: #e5e5df;
            color: #5A5A40;
            font-size: 11px;
            font-weight: 600;
            padding: 4px 8px;
            border-radius: 999px;
            margin-bottom: 24px;
            letter-spacing: 0.05em;
            text-transform: uppercase;
          }
          .input-group {
            text-align: left;
            margin-bottom: 24px;
          }
          label {
            display: block;
            font-size: 12px;
            font-weight: 500;
            color: #5A5A40;
            margin-bottom: 8px;
          }
          input {
            width: 100%;
            padding: 12px 16px;
            border: 1px solid #e5e5df;
            border-radius: 12px;
            font-size: 15px;
            background-color: #f5f5f0;
            color: #1a1a1a;
            box-sizing: border-box;
            outline: none;
            transition: border-color 0.15s ease;
          }
          input:focus {
            border-color: #5A5A40;
          }
          .btn {
            background-color: #5A5A40;
            color: white;
            border: none;
            padding: 14px 24px;
            font-size: 15px;
            font-weight: 500;
            border-radius: 14px;
            width: 100%;
            cursor: pointer;
            transition: background-color 0.15s ease;
          }
          .btn:hover {
            background-color: #4a4a34;
          }
          .google-btn {
            background-color: #ffffff;
            color: #1a1a1a;
            border: 1px solid #e5e5df;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 12px;
            margin-top: 16px;
          }
          .google-btn:hover {
            background-color: #f5f5f0;
          }
          .footer-text {
            font-size: 11px;
            color: #8a8a83;
            margin-top: 32px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="sandbox-badge">OAuth Sandbox Preview</div>
          <div class="logo">StudyFlow</div>
          <div class="subtitle">Enter mock credentials to simulate Google Sign-In</div>
          
          <form id="login-form">
            <div class="input-group">
              <label for="email">Email Address</label>
              <input type="email" id="email" value="naveenamre@gmail.com" required>
            </div>
            <div class="input-group">
              <label for="name">Full Name (Optional)</label>
              <input type="text" id="name" value="Naveen Amre">
            </div>
            <button type="submit" class="btn">Continue</button>
          </form>

          <div class="footer-text">
            This is a mock authentication sandbox. In production, this will open the official Google OAuth consent screen.
          </div>
        </div>

        <script>
          document.getElementById('login-form').addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const name = document.getElementById('name').value;
            const code = 'mock_code_' + btoa(JSON.stringify({ email, name }));
            
            window.location.href = '${origin}/api/auth/callback?code=' + encodeURIComponent(code);
          });
        </script>
      </body>
    </html>
  `;

  return new Response(html, {
    headers: { 'content-type': 'text/html' },
  });
}

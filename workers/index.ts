import { D1StudyFlowRepository } from '../repositories/d1-studyflow.repository';
import { validateSnapshot } from '../api/validation';

interface Env {
  DB: D1Database;
}

const securityHeaders = {
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'camera=(), microphone=(), geolocation=()',
};

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,PATCH,OPTIONS',
  'access-control-allow-headers': 'content-type',
};

function json(body: unknown, init: ResponseInit = {}) {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...securityHeaders,
      ...corsHeaders,
      ...init.headers,
    },
  });
}

function noContent() {
  return new Response(null, {
    status: 204,
    headers: {
      ...securityHeaders,
      ...corsHeaders,
    },
  });
}

function error(message: string, status = 400) {
  return json({ error: message }, { status });
}

async function readJson(request: Request) {
  try {
    return await request.json();
  } catch {
    throw new Error('Request body must be valid JSON.');
  }
}

function apiPath(request: Request) {
  const url = new URL(request.url);
  return url.pathname.replace(/^\/api/, '') || '/';
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === 'OPTIONS') {
      return noContent();
    }

    const repository = new D1StudyFlowRepository(env);
    const path = apiPath(request);
    const url = new URL(request.url);
    const date = url.searchParams.get('date') ?? new Date().toISOString().slice(0, 10);

    try {
      if (request.method === 'GET' && path === '/settings') {
        return json(await repository.getSettings());
      }

      if (request.method === 'GET' && path === '/timetable') {
        return json(await repository.getTimetable());
      }

      if (request.method === 'GET' && path === '/today') {
        return json(await repository.getToday(date));
      }

      if ((request.method === 'POST' || request.method === 'PATCH') && path === '/settings') {
        const snapshot = validateSnapshot(await readJson(request));
        return json(await repository.saveSnapshot(snapshot));
      }

      if ((request.method === 'POST' || request.method === 'PATCH') && path === '/timetable') {
        const snapshot = validateSnapshot(await readJson(request));
        return json(await repository.saveSnapshot(snapshot));
      }

      if ((request.method === 'POST' || request.method === 'PATCH') && path === '/today') {
        const snapshot = validateSnapshot(await readJson(request));
        return json(await repository.saveSnapshot(snapshot));
      }

      if (request.method === 'POST' && path === '/sync') {
        const snapshot = validateSnapshot(await readJson(request));
        return json(await repository.saveSnapshot(snapshot));
      }

      return error('Endpoint not found.', 404);
    } catch (caughtError) {
      const message = caughtError instanceof Error ? caughtError.message : 'Unexpected server error.';
      return error(message, message.includes('invalid') || message.includes('JSON') ? 400 : 500);
    }
  },
};

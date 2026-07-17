import { StudyFlowSnapshot } from '@/storage/types';

const getApiBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_STUDYFLOW_API_URL;
  if (!url || url.includes('example.com')) {
    return '/api';
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

async function request(path: string, init: RequestInit = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'content-type': 'application/json',
      ...init.headers,
    },
  });

  if (!response.ok) {
    const message = await response.text();
    throw new ApiError(message || `Request failed with status ${response.status}.`, response.status);
  }

  if (response.status === 204) {
    return null;
  }

  const contentType = response.headers.get('content-type');
  if (!contentType || !contentType.includes('application/json')) {
    const text = await response.text();
    throw new ApiError(`Expected JSON response, but received content-type "${contentType || 'unknown'}" with body starting with: ${text.substring(0, 150)}`, response.status);
  }

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch (parseErr) {
    throw new ApiError(`Failed to parse JSON response. Error: ${parseErr instanceof Error ? parseErr.message : 'Unknown'}. Body was: ${text.substring(0, 150)}`, response.status);
  }
}

export async function syncSnapshot(snapshot: StudyFlowSnapshot): Promise<void> {
  await request('/sync', {
    method: 'POST',
    body: JSON.stringify(snapshot),
  });
}

export async function getAuthUrl(): Promise<{ url: string; isMock: boolean }> {
  return request('/auth/url');
}

export async function getCurrentUser(): Promise<{ user: { id: string; email: string; name?: string } | null }> {
  return request('/auth/me');
}

export async function logout(): Promise<{ success: boolean }> {
  return request('/auth/logout', { method: 'POST' });
}

export async function fetchCloudSnapshot(): Promise<{ snapshot: StudyFlowSnapshot | null }> {
  return request('/sync', { method: 'GET' });
}

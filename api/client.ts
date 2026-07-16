import { StudyFlowSnapshot } from '@/storage/types';

const getApiBaseUrl = (): string => {
  const url = process.env.NEXT_PUBLIC_STUDYFLOW_API_URL;
  if (!url || url.includes('example.com')) {
    return '/api';
  }
  return url;
};

const API_BASE_URL = getApiBaseUrl();

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
    throw new Error(message || `Request failed with status ${response.status}.`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
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


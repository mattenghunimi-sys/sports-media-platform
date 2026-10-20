import { cookies } from 'next/headers';

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'lff@2026';
const AUTH_COOKIE_NAME = 'lff_admin_session';

export function verifyAdminCredentials(username, password) {
  return username === ADMIN_USERNAME && password === ADMIN_PASSWORD;
}

export function setAdminSession() {
  const cookieStore = cookies();
  cookieStore.set(AUTH_COOKIE_NAME, 'authenticated_token_' + Date.now(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });
}

export function clearAdminSession() {
  const cookieStore = cookies();
  cookieStore.delete(AUTH_COOKIE_NAME);
}

export function isAdminAuthenticated() {
  const cookieStore = cookies();
  const session = cookieStore.get(AUTH_COOKIE_NAME);
  return Boolean(session && session.value);
}

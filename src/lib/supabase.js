import { createClient } from '@supabase/supabase-js';

// Robust URL normalization: handles missing https://, trailing slashes, and /rest/v1
function getValidSupabaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    let cleaned = envUrl.trim().replace(/^["']|["']$/g, '');
    cleaned = cleaned.replace(/\/rest\/v1\/?$/, '').replace(/\/+$/, '');
    if (cleaned.startsWith('http://') || cleaned.startsWith('https://')) {
      return cleaned;
    }
    if (cleaned.includes('supabase.co')) {
      return `https://${cleaned}`;
    }
  }
  return 'https://yibhikcjxhxtugiwfqks.supabase.co';
}

function getValidKey(envKey, fallback) {
  if (typeof envKey === 'string' && envKey.trim().length > 20) {
    return envKey.trim().replace(/^["']|["']$/g, '');
  }
  return fallback;
}

const DEFAULT_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYmhpa2NqeGh4dHVnaXdmcWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjUyMTI5OSwiZXhwIjoyMTA4MDk3Mjk5fQ.Fe3_E5531M77-FzFsWtl2tRqEl1zpmAwpp79DXR-mvI';

let _adminClient = null;

export function getAdminClient() {
  if (!_adminClient) {
    // Polyfill WebSocket in Node runtime so @supabase/supabase-js never throws
    if (typeof globalThis.WebSocket === 'undefined') {
      globalThis.WebSocket = class DummyWebSocket {};
    }

    const url = getValidSupabaseUrl();
    const serviceKey = getValidKey(process.env.SUPABASE_SERVICE_ROLE_KEY, DEFAULT_SERVICE_KEY);

    _adminClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _adminClient;
}

// Lazy Proxy: guarantees safe execution on both Vercel Serverless and build time
export const supabaseAdmin = new Proxy({}, {
  get(target, prop) {
    const client = getAdminClient();
    const val = client[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  },
});

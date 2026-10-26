import { createClient } from '@supabase/supabase-js';

const HARDCODED_URL = 'https://yibhikcjxhxtugiwfqks.supabase.co';

function getValidSupabaseUrl() {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (typeof envUrl === 'string' && envUrl.trim().length > 0) {
    try {
      const cleaned = envUrl.trim().replace(/["']/g, '');
      const withHttp = cleaned.startsWith('http') ? cleaned : `https://${cleaned}`;
      const parsed = new URL(withHttp);
      if (parsed.hostname && parsed.hostname.includes('supabase.co')) {
        return `https://${parsed.hostname}`;
      }
    } catch {
      // Fallback below
    }
  }
  return HARDCODED_URL;
}

function getValidKey(envKey, fallback) {
  if (typeof envKey === 'string') {
    const cleaned = envKey.trim().replace(/["']/g, '');
    if (cleaned.length > 20) {
      return cleaned;
    }
  }
  return fallback;
}

const DEFAULT_SERVICE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYmhpa2NqeGh4dHVnaXdmcWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjUyMTI5OSwiZXhwIjoyMTA4MDk3Mjk5fQ.Fe3_E5531M77-FzFsWtl2tRqEl1zpmAwpp79DXR-mvI';

let _adminClient = null;

class DummyWebSocket {}

export function getAdminClient() {
  if (!_adminClient) {
    if (typeof globalThis.WebSocket === 'undefined') {
      globalThis.WebSocket = DummyWebSocket;
    }

    const url = getValidSupabaseUrl();
    const serviceKey = getValidKey(process.env.SUPABASE_SERVICE_ROLE_KEY, DEFAULT_SERVICE_KEY);

    _adminClient = createClient(url, serviceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      realtime: {
        transport: DummyWebSocket,
        params: { eventsPerSecond: -1 },
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

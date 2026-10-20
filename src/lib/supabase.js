import { createClient } from '@supabase/supabase-js';

if (typeof globalThis.WebSocket === 'undefined') {
  globalThis.WebSocket = class {};
}

function sanitize(val, fallback) {
  if (!val || typeof val !== 'string') return fallback;
  const cleaned = val.trim().replace(/^["']|["']$/g, '');
  if (!cleaned || cleaned === 'undefined' || cleaned === 'null') return fallback;
  return cleaned;
}

const supabaseUrl = sanitize(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  'https://yibhikcjxhxtugiwfqks.supabase.co'
);

const supabaseServiceKey = sanitize(
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYmhpa2NqeGh4dHVnaXdmcWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjUyMTI5OSwiZXhwIjoyMTA4MDk3Mjk5fQ.Fe3_E5531M77-FzFsWtl2tRqEl1zpmAwpp79DXR-mvI'
);

let _adminClient = null;
function getAdminClient() {
  if (!_adminClient) {
    _adminClient = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    });
  }
  return _adminClient;
}

// Lazy Proxy: guarantees createClient is NEVER called during Next.js build time
export const supabaseAdmin = new Proxy({}, {
  get(target, prop) {
    const client = getAdminClient();
    const val = client[prop];
    return typeof val === 'function' ? val.bind(client) : val;
  },
});

import { createClient } from '@supabase/supabase-js';
import WebSocket from 'ws';

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

const supabaseAnonKey = sanitize(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYmhpa2NqeGh4dHVnaXdmcWtzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI1MjEyOTksImV4cCI6MjEwODA5NzI5OX0.NgN21bouAfxQ6cOSCrtTcAK0E8203puejmbKzppgr60'
);

// Server-side client with full admin access (bypasses RLS)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: WebSocket,
  },
});

// Client-side / public client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
  realtime: {
    transport: WebSocket,
  },
});

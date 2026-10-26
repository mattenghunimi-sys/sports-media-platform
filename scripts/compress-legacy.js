const { createClient } = require('@supabase/supabase-js');
const sharp = require('sharp');

const url = 'https://yibhikcjxhxtugiwfqks.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlpYmhpa2NqeGh4dHVnaXdmcWtzIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc5MjUyMTI5OSwiZXhwIjoyMTA4MDk3Mjk5fQ.Fe3_E5531M77-FzFsWtl2tRqEl1zpmAwpp79DXR-mvI';

class DummyWS {}
const supabase = createClient(url, key, {
  auth: { persistSession: false },
  realtime: { transport: DummyWS }
});

async function compressBase64(base64Str, maxWidth, quality) {
  if (!base64Str || typeof base64Str !== 'string') return base64Str;
  if (!base64Str.startsWith('data:image/')) return base64Str; // Skip PDFs or URLs

  try {
    const parts = base64Str.split(',');
    if (parts.length < 2) return base64Str;
    const buffer = Buffer.from(parts[1], 'base64');
    
    // Only compress if buffer is larger than 150KB
    if (buffer.length < 150 * 1024) return base64Str;

    const compressedBuffer = await sharp(buffer)
      .resize(maxWidth, maxWidth, { fit: 'inside', withoutEnlargement: true })
      .jpeg({ quality })
      .toBuffer();

    return `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`;
  } catch (err) {
    console.error('Sharp compression failed for one item:', err.message);
    return base64Str;
  }
}

async function main() {
  console.log('Fetching all journalists list...');
  const { data: journalists, error } = await supabase
    .from('journalists')
    .select('id, full_name')
    .order('created_at', { ascending: false });

  if (error || !journalists) {
    console.error('Failed to fetch list:', error);
    return;
  }

  console.log(`Found ${journalists.length} journalists. Starting optimization...`);

  let totalSavedBytes = 0;
  let processedCount = 0;

  for (let i = 0; i < journalists.length; i++) {
    const jMeta = journalists[i];
    process.stdout.write(`[${i + 1}/${journalists.length}] Processing ${jMeta.full_name}... `);

    // Fetch single record with files
    const { data: j, error: fetchErr } = await supabase
      .from('journalists')
      .select('id, photo_url, document_url')
      .eq('id', jMeta.id)
      .single();

    if (fetchErr || !j) {
      console.log('Skipped (fetch error)');
      continue;
    }

    const initialPhotoLen = (j.photo_url || '').length;
    const initialDocLen = (j.document_url || '').length;
    const initialBytes = (initialPhotoLen + initialDocLen) * 0.75;

    const newPhoto = await compressBase64(j.photo_url, 800, 82);
    const newDoc = await compressBase64(j.document_url, 1400, 80);

    const finalBytes = ((newPhoto || '').length + (newDoc || '').length) * 0.75;
    const saved = initialBytes - finalBytes;

    if (saved > 10 * 1024) {
      // Update in Supabase
      const { error: updateErr } = await supabase
        .from('journalists')
        .update({
          photo_url: newPhoto,
          document_url: newDoc
        })
        .eq('id', j.id);

      if (updateErr) {
        console.log(`Update error: ${updateErr.message}`);
      } else {
        totalSavedBytes += saved;
        processedCount++;
        console.log(`Saved ${(saved / 1024 / 1024).toFixed(2)} MB!`);
      }
    } else {
      console.log('Already optimal.');
    }
  }

  console.log('----------------------------------------------------');
  console.log(`Done! Optimized ${processedCount} records.`);
  console.log(`Total space freed in database: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB!`);
}

main();

import { supabaseAdmin } from './supabase';

function mapToCamel(row) {
  if (!row) return null;
  return {
    id: row.id,
    accreditationCode: row.accreditation_code,
    fullName: row.full_name,
    nationalId: row.national_id,
    mediaOutlet: row.media_outlet,
    outletType: row.outlet_type,
    role: row.role,
    coverageType: row.coverage_type,
    phone: row.phone,
    email: row.email,
    city: row.city,
    country: row.country,
    experienceYears: row.experience_years,
    syndicateNumber: row.syndicate_number,
    photoUrl: row.photo_url,
    documentUrl: row.document_url,
    status: row.status,
    issueDate: row.issue_date,
    expiryDate: row.expiry_date,
    bloodType: row.blood_type,
    zoneAccess: row.zone_access,
    reviewNotes: row.review_notes,
    createdAt: row.created_at,
    approvedAt: row.approved_at,
  };
}

// ========== GET ALL ==========
export async function getAllJournalists() {
  let { data, error } = await supabaseAdmin
    .from('journalists')
    .select('*')
    .order('created_at', { ascending: false });

  // Retry once if transient timeout/connection error (e.g. Supabase waking up)
  if (error) {
    console.warn('Initial fetch failed, retrying once...', error.message);
    await new Promise(resolve => setTimeout(resolve, 800));
    const retry = await supabaseAdmin
      .from('journalists')
      .select('*')
      .order('created_at', { ascending: false });
    data = retry.data;
    error = retry.error;
  }

  if (error) {
    console.error('Error fetching journalists:', error);
    throw new Error(`تعذر استرجاع الطلبات من قاعدة البيانات: ${error.message}`);
  }
  return (data || []).map(mapToCamel);
}

// ========== GET BY ID ==========
export async function getJournalistById(id) {
  const { data, error } = await supabaseAdmin
    .from('journalists')
    .select('*')
    .or(`id.eq.${id},accreditation_code.eq.${id},national_id.eq.${id}`)
    .maybeSingle();

  if (error || !data) return null;
  return mapToCamel(data);
}

// ========== CREATE ==========
export async function createJournalist(formData) {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `lff-2026-${randomSuffix}`;

  const newJournalist = {
    id,
    accreditation_code: `LFF-2026-${randomSuffix}`,
    full_name: formData.fullName || '',
    national_id: formData.nationalId || '',
    media_outlet: formData.mediaOutlet || '',
    outlet_type: formData.outletType || 'مؤسسة إعلامية',
    role: formData.role || 'إعلامي رياضي',
    coverage_type: formData.coverageType || 'شامل',
    phone: formData.phone || '',
    email: formData.email || '',
    city: formData.city || '',
    country: formData.country || 'ليبيا',
    experience_years: formData.experienceYears || '1',
    syndicate_number: formData.syndicateNumber || '',
    photo_url: formData.photoUrl || '',
    document_url: formData.documentUrl || '',
    status: 'PENDING',
    issue_date: '',
    expiry_date: '',
    blood_type: formData.bloodType || 'غير محدد',
    zone_access: 'MEDIA CENTRE - PRESS BOX',
    review_notes: '',
    approved_at: null,
  };

  const { data, error } = await supabaseAdmin
    .from('journalists')
    .insert([newJournalist])
    .select()
    .single();

  if (error) {
    console.error('Error creating journalist:', error);
    throw new Error(error.message);
  }
  return mapToCamel(data);
}

// ========== UPDATE STATUS ==========
export async function updateJournalistStatus(id, { status, reviewNotes, zoneAccess, bloodType }) {
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Build update payload directly — avoid extra SELECT round-trip
  const updates = {
    status,
    ...(reviewNotes !== undefined && { review_notes: reviewNotes }),
    ...(zoneAccess && { zone_access: zoneAccess }),
    ...(bloodType && { blood_type: bloodType }),
    // Only set dates when approving for the first time
    ...(status === 'APPROVED' && {
      issue_date: today,
      expiry_date: nextYear,
      approved_at: new Date().toISOString(),
    }),
  };

  const { data, error } = await supabaseAdmin
    .from('journalists')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating journalist:', error);
    return null;
  }
  return mapToCamel(data);
}

// ========== DELETE ==========
export async function deleteJournalist(id) {
  const { error } = await supabaseAdmin
    .from('journalists')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting journalist:', error);
    return false;
  }
  return true;
}

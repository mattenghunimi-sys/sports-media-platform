import { supabaseAdmin } from './supabase';

// ========== GET ALL ==========
export async function getAllJournalists() {
  const { data, error } = await supabaseAdmin
    .from('journalists')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching journalists:', error);
    return [];
  }
  return data || [];
}

// ========== GET BY ID ==========
export async function getJournalistById(id) {
  const { data, error } = await supabaseAdmin
    .from('journalists')
    .select('*')
    .or(`id.eq.${id},accreditation_code.eq.${id},national_id.eq.${id}`)
    .single();

  if (error) return null;
  return data || null;
}

// ========== CREATE ==========
export async function createJournalist(formData) {
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  const id = `smp-${Date.now()}`;

  const newJournalist = {
    id,
    accreditation_code: `SMA-2026-${randomSuffix}`,
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
    issue_date: null,
    expiry_date: null,
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
  return data;
}

// ========== UPDATE STATUS ==========
export async function updateJournalistStatus(id, { status, reviewNotes, zoneAccess, bloodType }) {
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  // Get current data first
  const { data: current } = await supabaseAdmin
    .from('journalists')
    .select('*')
    .eq('id', id)
    .single();

  if (!current) return null;

  const updates = {
    status: status || current.status,
    review_notes: reviewNotes !== undefined ? reviewNotes : current.review_notes,
    zone_access: zoneAccess || current.zone_access || 'MEDIA CENTRE - PRESS BOX',
    blood_type: bloodType || current.blood_type,
    issue_date: status === 'APPROVED' ? (current.issue_date || today) : current.issue_date,
    expiry_date: status === 'APPROVED' ? (current.expiry_date || nextYear) : current.expiry_date,
    approved_at: status === 'APPROVED' ? (current.approved_at || new Date().toISOString()) : current.approved_at,
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
  return data;
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

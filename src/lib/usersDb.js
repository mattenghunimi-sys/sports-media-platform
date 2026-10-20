import { supabaseAdmin } from './supabase';

// ========== GET ALL USERS ==========
export async function getAllUsers() {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    console.error('Error fetching users:', error);
    return [];
  }
  return data || [];
}

// ========== FIND BY CREDENTIALS ==========
export async function findUserByCredentials(username, password) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .ilike('username', username.trim())
    .eq('password', password)
    .single();

  if (error) return null;
  return data || null;
}

// ========== GET BY ID ==========
export async function getUserById(id) {
  const { data, error } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data || null;
}

// ========== CREATE USER ==========
export async function createUser({ username, password, displayName, role = 'ASSISTANT' }) {
  // Check if username already exists
  const { data: existing } = await supabaseAdmin
    .from('users')
    .select('id')
    .ilike('username', username.trim())
    .single();

  if (existing) {
    throw new Error('اسم المستخدم مستخدم بالفعل، يرجى اختيار اسم مستخدم آخر');
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    username: username.trim(),
    password: password.trim(),
    display_name: displayName || username,
    role: role || 'ASSISTANT',
    last_login: null,
  };

  const { data, error } = await supabaseAdmin
    .from('users')
    .insert([newUser])
    .select()
    .single();

  if (error) {
    console.error('Error creating user:', error);
    throw new Error(error.message);
  }
  return data;
}

// ========== UPDATE USER ==========
export async function updateUser(id, { username, password, displayName, role }) {
  const { data: current, error: fetchError } = await supabaseAdmin
    .from('users')
    .select('*')
    .eq('id', id)
    .single();

  if (fetchError || !current) return null;

  // Check unique username if changed
  if (username && username.trim().toLowerCase() !== current.username.toLowerCase()) {
    const { data: existing } = await supabaseAdmin
      .from('users')
      .select('id')
      .ilike('username', username.trim())
      .neq('id', id)
      .single();

    if (existing) {
      throw new Error('اسم المستخدم الجديد مستخدم بالفعل لحساب آخر');
    }
  }

  const updates = {};
  if (username && username.trim()) updates.username = username.trim();
  if (password && password.trim()) updates.password = password.trim();
  if (displayName) updates.display_name = displayName;
  if (role) updates.role = role;

  const { data, error } = await supabaseAdmin
    .from('users')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating user:', error);
    return null;
  }
  return data;
}

// ========== DELETE USER ==========
export async function deleteUser(id) {
  const { count } = await supabaseAdmin
    .from('users')
    .select('*', { count: 'exact', head: true });

  if (count <= 1) {
    throw new Error('لا يمكن حذف المستخدم الأخير في المنظومة');
  }

  const { error } = await supabaseAdmin
    .from('users')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting user:', error);
    return false;
  }
  return true;
}

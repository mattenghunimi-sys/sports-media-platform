import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const usersFile = path.join(dataDir, 'users.json');

const INITIAL_USERS = [
  {
    id: "usr-super-admin",
    username: "admin",
    password: "lff@2026",
    displayName: "مدير المنظومة الرئيسي",
    role: "SUPER_ADMIN", // SUPER_ADMIN or ASSISTANT
    createdAt: "2026-01-01T00:00:00.000Z",
    lastLogin: null
  }
];

function ensureUsersDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(usersFile)) {
    fs.writeFileSync(usersFile, JSON.stringify(INITIAL_USERS, null, 2), 'utf-8');
  }
}

export function getAllUsers() {
  ensureUsersDb();
  try {
    const data = fs.readFileSync(usersFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading users database:', err);
    return [];
  }
}

export function saveUsers(users) {
  ensureUsersDb();
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2), 'utf-8');
}

export function findUserByCredentials(username, password) {
  const users = getAllUsers();
  return users.find(u => u.username.toLowerCase() === username.toLowerCase().trim() && u.password === password) || null;
}

export function getUserById(id) {
  const users = getAllUsers();
  return users.find(u => u.id === id) || null;
}

export function createUser({ username, password, displayName, role = 'ASSISTANT' }) {
  const users = getAllUsers();
  
  // Check if username already exists
  if (users.some(u => u.username.toLowerCase() === username.toLowerCase().trim())) {
    throw new Error('اسم المستخدم مستخدم بالفعل، يرجى اختيار اسم مستخدم آخر');
  }

  const newUser = {
    id: `usr-${Date.now()}`,
    username: username.trim(),
    password: password.trim(),
    displayName: displayName || username,
    role: role || 'ASSISTANT',
    createdAt: new Date().toISOString(),
    lastLogin: null
  };

  users.push(newUser);
  saveUsers(users);
  return newUser;
}

export function updateUser(id, { username, password, displayName, role }) {
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return null;

  // Check unique username if username changed
  if (username && username.trim().toLowerCase() !== users[index].username.toLowerCase()) {
    if (users.some(u => u.id !== id && u.username.toLowerCase() === username.trim().toLowerCase())) {
      throw new Error('اسم المستخدم الجديد مستخدم بالفعل لحساب آخر');
    }
    users[index].username = username.trim();
  }

  if (password && password.trim()) {
    users[index].password = password.trim();
  }

  if (displayName) {
    users[index].displayName = displayName;
  }

  if (role) {
    users[index].role = role;
  }

  saveUsers(users);
  return users[index];
}

export function deleteUser(id) {
  const users = getAllUsers();
  if (users.length <= 1) {
    throw new Error('لا يمكن حذف المستخدم الأخير في المنظومة');
  }
  const filtered = users.filter(u => u.id !== id);
  if (filtered.length === users.length) return false;
  saveUsers(filtered);
  return true;
}

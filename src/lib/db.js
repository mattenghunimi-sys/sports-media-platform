import fs from 'fs';
import path from 'path';

const dataDir = path.join(process.cwd(), 'data');
const dataFile = path.join(dataDir, 'journalists.json');

// Sample initial data if database doesn't exist
const INITIAL_JOURNALISTS = [
  {
    id: "smp-2026-001",
    accreditationCode: "SMA-2026-9041",
    fullName: "طارق بن عبدالعزيز الحميد",
    nationalId: "1087452319",
    mediaOutlet: "صحيفة الرياضية السعودية",
    outletType: "صحيفة مطبوعة ورقمية",
    role: "محرر ومحلل رياضي",
    coverageType: "دوري روشن للمحترفين وبطولات آسيا",
    phone: "+966501234567",
    email: "tariq.alhamid@example.com",
    city: "الرياض",
    country: "المملكة العربية السعودية",
    experienceYears: "8",
    syndicateNumber: "SA-PRESS-4491",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80",
    documentUrl: "",
    status: "APPROVED", // APPROVED, PENDING, REJECTED
    issueDate: "2026-01-15",
    expiryDate: "2027-01-14",
    bloodType: "O+",
    zoneAccess: "VIP - PRESS BOX - PITCH SIDE",
    reviewNotes: "تم اعتماد الطلب بعد مراجعة خطاب التكليف الرسمي وتوثيق السجل المهني.",
    createdAt: "2026-01-14T10:30:00.000Z",
    approvedAt: "2026-01-15T11:15:00.000Z"
  },
  {
    id: "smp-2026-002",
    accreditationCode: "SMA-2026-9042",
    fullName: "فهد محمد السبيعي",
    nationalId: "1098471203",
    mediaOutlet: "شبكة قنوات الكأس الرياضية",
    outletType: "قناة تلفزيونية فضائية",
    role: "مصور فوتوغرافي ميداني",
    coverageType: "كأس خادم الحرمين الشريفين والفروسية",
    phone: "+966559876543",
    email: "fahad.subaie@example.com",
    city: "جدة",
    country: "المملكة العربية السعودية",
    experienceYears: "5",
    syndicateNumber: "SA-PRESS-6120",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    documentUrl: "",
    status: "APPROVED",
    issueDate: "2026-02-01",
    expiryDate: "2027-01-31",
    bloodType: "A+",
    zoneAccess: "PITCH SIDE - MEDIA CENTRE",
    reviewNotes: "مصور معتمد لنهائيات الموسم الرياضي.",
    createdAt: "2026-01-30T14:20:00.000Z",
    approvedAt: "2026-02-01T09:00:00.000Z"
  },
  {
    id: "smp-2026-003",
    accreditationCode: "PENDING-3301",
    fullName: "سارة عبدالله الزهراني",
    nationalId: "1076329814",
    mediaOutlet: "منصة مدرج الرياضة الرقمية",
    outletType: "منصة إعلامية رقمية وموقع إلكتروني",
    role: "صانعة محتوى ومراسلة رقمية",
    coverageType: "رياضة المرأة ودوري كرة الصالات",
    phone: "+966541122334",
    email: "sarah.zahrani@example.com",
    city: "الدمام",
    country: "المملكة العربية السعودية",
    experienceYears: "3",
    syndicateNumber: "",
    photoUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    documentUrl: "",
    status: "PENDING",
    issueDate: "",
    expiryDate: "",
    bloodType: "B+",
    zoneAccess: "MEDIA CENTRE",
    reviewNotes: "بانتظار إرفاق خطاب تكليف المؤسسة الإعلامية لموسم 2026.",
    createdAt: "2026-03-05T08:45:00.000Z",
    approvedAt: null
  }
];

function ensureDb() {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(dataFile)) {
    fs.writeFileSync(dataFile, JSON.stringify(INITIAL_JOURNALISTS, null, 2), 'utf-8');
  }
}

export function getAllJournalists() {
  ensureDb();
  try {
    const data = fs.readFileSync(dataFile, 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Error reading database:', err);
    return [];
  }
}

export function getJournalistById(id) {
  const all = getAllJournalists();
  return all.find(j => j.id === id || j.accreditationCode === id || j.nationalId === id) || null;
}

export function saveJournalists(journalists) {
  ensureDb();
  fs.writeFileSync(dataFile, JSON.stringify(journalists, null, 2), 'utf-8');
}

export function createJournalist(data) {
  const all = getAllJournalists();
  const id = `smp-${Date.now()}`;
  const randomSuffix = Math.floor(1000 + Math.random() * 9000);
  
  const newJournalist = {
    id,
    accreditationCode: `SMA-2026-${randomSuffix}`,
    fullName: data.fullName || '',
    nationalId: data.nationalId || '',
    mediaOutlet: data.mediaOutlet || '',
    outletType: data.outletType || 'مؤسسة إعلامية',
    role: data.role || 'إعلامي رياضي',
    coverageType: data.coverageType || 'شامل',
    phone: data.phone || '',
    email: data.email || '',
    city: data.city || '',
    country: data.country || 'المملكة العربية السعودية',
    experienceYears: data.experienceYears || '1',
    syndicateNumber: data.syndicateNumber || '',
    photoUrl: data.photoUrl || '',
    documentUrl: data.documentUrl || '',
    status: 'PENDING', // Default state: pending approval
    issueDate: '',
    expiryDate: '',
    bloodType: data.bloodType || 'غير محدد',
    zoneAccess: 'MEDIA CENTRE - PRESS BOX',
    reviewNotes: '',
    createdAt: new Date().toISOString(),
    approvedAt: null
  };

  all.unshift(newJournalist);
  saveJournalists(all);
  return newJournalist;
}

export function updateJournalistStatus(id, { status, reviewNotes, zoneAccess, bloodType }) {
  const all = getAllJournalists();
  const index = all.findIndex(j => j.id === id);
  if (index === -1) return null;

  const current = all[index];
  const today = new Date().toISOString().split('T')[0];
  const nextYear = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

  const updated = {
    ...current,
    status: status || current.status,
    reviewNotes: reviewNotes !== undefined ? reviewNotes : current.reviewNotes,
    zoneAccess: zoneAccess || current.zoneAccess || 'MEDIA CENTRE - PRESS BOX',
    bloodType: bloodType || current.bloodType,
    issueDate: status === 'APPROVED' ? (current.issueDate || today) : current.issueDate,
    expiryDate: status === 'APPROVED' ? (current.expiryDate || nextYear) : current.expiryDate,
    approvedAt: status === 'APPROVED' ? (current.approvedAt || new Date().toISOString()) : current.approvedAt
  };

  all[index] = updated;
  saveJournalists(all);
  return updated;
}

export function deleteJournalist(id) {
  const all = getAllJournalists();
  const filtered = all.filter(j => j.id !== id);
  if (filtered.length === all.length) return false;
  saveJournalists(filtered);
  return true;
}

'use client';

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle, 
  Camera, 
  Radio, 
  Mic, 
  FileText, 
  Award,
  QrCode as QrIcon
} from 'lucide-react';
import LFFLogo from '@/components/LFFLogo';

export default function PressCard({ journalist, showBack = false, scale = 1, isPrint = false }) {
  const [qrSrc, setQrSrc] = useState('');

  const {
    id = '',
    fullName = 'الاسم الكامل للإعلامي',
    mediaOutlet = 'المؤسسة الإعلامية',
    outletType = 'قناة فضائية',
    role = 'مراسل ميداني',
    coverageType = 'الدوري الليبي الممتاز وكأس ليبيا',
    accreditationCode = 'LFF-2026-9041',
    issueDate = '2026-01-15',
    expiryDate = '2027-01-14',
    status = 'APPROVED',
    photoUrl = '',
    bloodType = 'O+',
    zoneAccess = 'المقصورة الصحفية • المركز الإعلامي • أرضية الملعب'
  } = journalist || {};

  const isApproved = status === 'APPROVED';

  // Generate live QR code for official verification page
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://lff.ly';
    const verifyUrl = `${origin}/media-card/${id || accreditationCode}`;
    
    QRCode.toDataURL(verifyUrl, {
      width: 220,
      margin: 1,
      color: {
        dark: '#052e16',
        light: '#ffffff'
      }
    })
      .then(url => setQrSrc(url))
      .catch(err => console.error(err));
  }, [id, accreditationCode]);

  // Convert role to clean Arabic badge category
  const getRoleCategoryBadge = () => {
    if (role.includes('مصور')) {
      return {
        title: 'مصور فوتوغرافي ميداني',
        color: 'from-amber-600 to-amber-700 text-white',
        icon: <Camera className="w-3.5 h-3.5" />
      };
    }
    if (role.includes('مراسل')) {
      return {
        title: 'مراسل ميداني معتمد',
        color: 'from-emerald-600 to-teal-700 text-white',
        icon: <Radio className="w-3.5 h-3.5" />
      };
    }
    if (role.includes('معلق') || role.includes('مذيع')) {
      return {
        title: 'معلق ومحلل رياضي',
        color: 'from-blue-600 to-indigo-700 text-white',
        icon: <Mic className="w-3.5 h-3.5" />
      };
    }
    return {
      title: 'محرر وصحفي رياضي',
      color: 'from-slate-700 to-slate-800 text-white',
      icon: <FileText className="w-3.5 h-3.5" />
    };
  };

  const roleBadge = getRoleCategoryBadge();

  // Parse zones into Arabic badges
  const getZoneChips = () => {
    const zones = [];
    if (zoneAccess.includes('PITCH') || zoneAccess.includes('الملعب')) zones.push('أرضية الملعب');
    if (zoneAccess.includes('PRESS') || zoneAccess.includes('المقصورة')) zones.push('المقصورة الصحفية');
    if (zoneAccess.includes('CENTRE') || zoneAccess.includes('المركز')) zones.push('المركز الإعلامي');
    if (zoneAccess.includes('VIP') || zoneAccess.includes('الشرفية')) zones.push('المنصة الشرفية');
    if (zones.length === 0) zones.push('المركز الإعلامي', 'المقصورة الصحفية');
    return zones;
  };

  return (
    <div 
      className="flex flex-col items-center select-none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* ======================================================== */}
      {/* CARD FRONT SIDE (PRESTIGIOUS OFFICIAL ACCREDITATION BADGE) */}
      {/* ======================================================== */}
      {!showBack ? (
        <div 
          className="w-[380px] h-[710px] rounded-[32px] overflow-hidden relative flex flex-col justify-between text-white shadow-2xl transition-all border-[3px] border-amber-500/70"
          style={{
            background: 'linear-gradient(180deg, #031c0e 0%, #06371c 30%, #052613 65%, #021208 100%)',
            boxShadow: '0 25px 60px -15px rgba(0, 0, 0, 0.9), 0 0 35px rgba(217, 119, 6, 0.25)'
          }}
        >
          {/* Subtle Security Guilloche Pattern Overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.08]"
            style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, #f59e0b 1px, transparent 1px), radial-gradient(circle at 0% 0%, #10b981 1px, transparent 1px)`,
              backgroundSize: '16px 16px'
            }}
          ></div>

          {/* Top Lanyard Slot with Brass / Gold Metallic Ring */}
          <div className="pt-3 pb-0.5 flex justify-center relative z-20 shrink-0">
            <div className="w-16 h-2.5 bg-slate-950 rounded-full border-2 border-amber-500/80 shadow-[inset_0_2px_4px_rgba(0,0,0,0.9)]"></div>
          </div>

          {/* ================= HEADER SECTION ================= */}
          <div className="px-5 pt-0.5 pb-1 text-center relative z-10 shrink-0">
            {/* Centered Large Official Logo */}
            <div className="flex justify-center mb-0.5 drop-shadow-[0_8px_16px_rgba(0,0,0,0.7)]">
              <LFFLogo size={46} />
            </div>

            {/* Federation Official Arabic Name */}
            <h2 className="text-xl font-black text-amber-300 tracking-wide drop-shadow-md">
              الاتحاد الليبي لكرة القدم
            </h2>

            {/* Sub-label in Arabic */}
            <p className="text-[10px] font-bold text-emerald-200/90 tracking-wider mt-0.5">
              الإدارة العامة للإعلام والتوثيق والاتصال
            </p>

            {/* Official Pass Ribbon */}
            <div className="mt-1.5 py-1 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-500 text-slate-950 font-black text-xs shadow-lg flex items-center justify-between border border-amber-200">
              <span className="text-[10px] tracking-tight">الموسم الرياضي 2026 / 2027</span>
              <span className="flex items-center gap-1 text-[11px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>بطاقة اعتماد إعلامي رسمي</span>
              </span>
            </div>
          </div>

          {/* ================= MIDDLE: PHOTO & CREDENTIALS ================= */}
          <div className="px-5 flex flex-col items-center text-center relative z-10 flex-1 justify-center my-1">
            {/* Photo with Official Gold Double Frame & Watermark */}
            <div className="relative mb-2 shrink-0">
              <div className="w-28 h-32 rounded-2xl p-1 bg-gradient-to-b from-amber-400 via-emerald-500 to-amber-600 shadow-2xl">
                <div className="w-full h-full rounded-xl overflow-hidden bg-slate-900 relative border border-slate-950">
                  {photoUrl ? (
                    <img 
                      src={photoUrl} 
                      alt={fullName} 
                      className="w-full h-full object-cover" 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-900">
                      <Camera className="w-8 h-8 mb-1 text-slate-600" />
                      <span className="text-[10px] font-bold">الصورة الشخصية</span>
                    </div>
                  )}

                  {/* Security Hologram Ribbon Overlay */}
                  <div className="absolute inset-0 hologram-effect pointer-events-none opacity-30"></div>
                </div>
              </div>

              {/* Status Badge Pin (معتمد رسمياً) */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 whitespace-nowrap">
                <span className={`px-3 py-0.5 rounded-full text-[10px] font-black shadow-xl border flex items-center gap-1 ${
                  isApproved 
                    ? 'bg-emerald-600 text-white border-emerald-300' 
                    : 'bg-amber-600 text-white border-amber-300'
                }`}>
                  {isApproved ? <CheckCircle2 className="w-3 h-3 text-white" /> : <AlertCircle className="w-3 h-3 text-white" />}
                  <span>{isApproved ? 'معتمد رسمياً' : 'قيد المراجعة'}</span>
                </span>
              </div>
            </div>

            {/* Category Ribbon Under Photo */}
            <div className={`mt-1.5 py-0.5 px-3 rounded-lg bg-gradient-to-r ${roleBadge.color} font-black text-[10.5px] shadow-md flex items-center gap-1.5 border border-white/20 shrink-0`}>
              {roleBadge.icon}
              <span>{role}</span>
            </div>

            {/* Journalist Full Name */}
            <h3 className="text-lg font-black text-white mt-1.5 mb-0.5 tracking-tight drop-shadow-md line-clamp-1">
              {fullName}
            </h3>

            {/* Media Outlet Name */}
            <div className="text-xs font-extrabold text-amber-300 mb-1.5 flex items-center gap-1.5 line-clamp-1">
              <span>{mediaOutlet}</span>
              <span className="text-emerald-400 text-[10px] font-normal">({outletType})</span>
            </div>

            {/* Accreditation Info Box */}
            <div className="w-full bg-slate-950/80 rounded-2xl p-2.5 border border-amber-500/30 text-right space-y-1 shadow-inner">
              <div className="flex items-center justify-between text-xs border-b border-white/10 pb-1">
                <span className="text-slate-400 text-[10px]">رقم الاعتماد الصحفي:</span>
                <span className="font-mono font-black text-amber-400 tracking-wider text-xs">
                  {accreditationCode}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 text-[10px]">المسابقات المعتمدة:</span>
                <span className="text-slate-200 text-[10px] font-bold">
                  {coverageType || 'الدوري الليبي الممتاز وكأس ليبيا'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs border-t border-white/10 pt-1">
                <span className="text-slate-400 text-[10px]">صلاحية البطاقة:</span>
                <span className="text-emerald-400 text-[10px] font-bold">
                  حتى {expiryDate || 'نهاية موسم 2026 / 2027'}
                </span>
              </div>
            </div>

            {/* Stadium Access Zones in Arabic */}
            <div className="w-full mt-2">
              <span className="text-[9px] text-slate-300 font-bold block text-right mb-1">
                المناطق المصرح بدخولها في الملاعب:
              </span>
              <div className="flex flex-wrap gap-1 justify-center">
                {getZoneChips().map((zone, idx) => (
                  <span 
                    key={idx}
                    className="text-[9px] font-black px-2 py-0.5 rounded-md bg-emerald-900/90 text-emerald-200 border border-emerald-500/40 shadow-sm"
                  >
                    ✓ {zone}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* ================= FOOTER: QR CODE & DIGITAL VERIFICATION ================= */}
          <div className="bg-slate-950 border-t-2 border-amber-500/60 px-4 py-3 flex items-center justify-between relative z-10 shrink-0">
            <div className="text-right flex-1 pl-3">
              <div className="flex items-center gap-1 text-amber-400 font-black text-[10.5px] mb-0.5">
                <Award className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span>الوثيقة الرسمية الإلكترونية المعتمدة</span>
              </div>
              <p className="text-[9px] text-slate-300 leading-tight">
                امسح الرمز للتحقق الفوري من صحة سريان البطاقة
              </p>
              <span className="text-[8.5px] font-bold text-emerald-400 block mt-0.5">
                الاتحاد الليبي لكرة القدم • طرابلس - ليبيا
              </span>
            </div>

            {/* High Contrast QR Code with Clear Padding */}
            <div className="w-14 h-14 bg-white p-1 rounded-xl shadow-lg border border-amber-400 flex items-center justify-center shrink-0">
              {qrSrc ? (
                <img src={qrSrc} alt="رمز التحقق" className="w-full h-full object-contain" />
              ) : (
                <QrIcon className="w-10 h-10 text-slate-900" />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* CARD BACK SIDE (OFFICIAL REGULATIONS & MEDICAL DATA) */
        /* ======================================================== */
        <div 
          className="w-[380px] h-[710px] rounded-[32px] overflow-hidden relative flex flex-col justify-between text-white shadow-2xl transition-all border-[3px] border-slate-700 p-5 text-right text-xs"
          style={{
            background: 'linear-gradient(180deg, #020f07 0%, #051f11 50%, #020f07 100%)'
          }}
        >
          {/* Lanyard Slot */}
          <div className="pt-0 pb-1 flex justify-center shrink-0">
            <div className="w-16 h-2.5 bg-slate-950 rounded-full border-2 border-slate-700 shadow-inner"></div>
          </div>

          {/* Header Back */}
          <div className="text-center border-b border-white/10 pb-2 shrink-0">
            <h4 className="text-sm font-black text-amber-300">الاتحاد الليبي لكرة القدم</h4>
            <p className="text-[10px] text-slate-400">الضوابط والتعليمات الرسمية لحاملي بطاقات الاعتماد</p>
          </div>

          {/* Security Hologram Strip */}
          <div className="hologram-effect h-7 rounded-lg border border-amber-400/50 flex items-center justify-center my-1 shrink-0">
            <span className="text-[10px] font-black text-slate-950 tracking-wider">
              ★ الاتحاد الليبي لكرة القدم • شريط الأمان والتوثيق الرسمي ★
            </span>
          </div>

          {/* Instructions and Terms in 100% Arabic */}
          <div className="space-y-1.5 text-[10.5px] leading-relaxed text-slate-200 bg-slate-950/60 p-3.5 rounded-2xl border border-white/5 flex-1 my-2 justify-center flex flex-col">
            <h5 className="font-bold text-amber-400 text-xs border-b border-white/10 pb-1 mb-1.5">
              شروط وتعليمات استخدام البطاقة:
            </h5>
            <ul className="list-disc list-inside space-y-1.5 text-slate-300">
              <li>هذه البطاقة وثيقة رسمية صادرة عن الاتحاد الليبي لكرة القدم مخصصة لحاملها فقط ولا يجوز إعارتها أو التنازل عنها للغير.</li>
              <li>يجب تعليق البطاقة وإبرازها بشكل ظاهر لكافة مسؤولي الأمن وبوابات الملاعب ومنظمي المباريات.</li>
              <li>تخول البطاقة حاملها الدخول للمناطق المحددة فقط والمطابقة لتخصصه الإعلامي (المقصورة الصحفية / أرضية الملعب للمصورين).</li>
              <li>يلتزم حامل البطاقة بالأنظمة واللوائح الإعلامية وميثاق الشرف الرياضي للاتحاد الليبي.</li>
              <li>في حال العثور على البطاقة أو فقدانها يرجى التواصل مع إدارة الإعلام بالاتحاد.</li>
            </ul>
          </div>

          {/* Medical & Emergency info */}
          <div className="bg-slate-950 border border-amber-500/30 rounded-2xl p-2.5 grid grid-cols-2 gap-2 text-[10px] shrink-0 mb-2">
            <div>
              <span className="text-slate-400 block text-[9px]">فصيلة الدم للطوارئ:</span>
              <span className="font-mono font-black text-rose-400 text-sm">{bloodType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px]">طوارئ الملاعب والإسعاف:</span>
              <span className="font-mono font-bold text-amber-300 text-sm">191 / 193</span>
            </div>
          </div>

          {/* Barcode & Official Digital Signature */}
          <div className="border-t border-white/10 pt-2 flex items-center justify-between shrink-0">
            <div className="text-right">
              <span className="text-[8px] text-slate-400 block">الختم الرقمي والتوقيع:</span>
              <div className="text-emerald-400 text-[10px] font-black flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <span>معتمد من الأمانة العامة للاتحاد</span>
              </div>
            </div>

            {/* Barcode pattern */}
            <div className="flex flex-col items-end">
              <div className="flex gap-0.5 h-7 items-center bg-white px-2 py-1 rounded-md">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2].map((w, i) => (
                  <div key={i} className="bg-black h-full" style={{ width: `${w}px` }}></div>
                ))}
              </div>
              <span className="text-[8px] font-mono text-slate-300 mt-0.5">{accreditationCode}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

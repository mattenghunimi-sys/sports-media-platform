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
    coverageType = 'جميع المسابقات الرسمية',
    accreditationCode = 'LFF-2026-9041',
    issueDate = '2026-01-15',
    expiryDate = '2027-01-14',
    status = 'APPROVED',
    photoUrl = '',
    bloodType = 'O+',
    zoneAccess = 'المنصة • المركز الإعلامي • أرضية الملعب'
  } = journalist || {};

  const isApproved = status === 'APPROVED';
  const isRevoked = status === 'REVOKED';

  // Generate live QR code for official verification page
  useEffect(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://lff.ly';
    const verifyUrl = `${origin}/media-card/${id || accreditationCode}`;
    
    QRCode.toDataURL(verifyUrl, {
      width: 200,
      margin: 1,
      color: {
        dark: '#0f172a',
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
        icon: <Camera className="w-3 h-3" />
      };
    }
    if (role.includes('مراسل')) {
      return {
        title: 'مراسل ميداني معتمد',
        color: 'from-emerald-600 to-teal-700 text-white',
        icon: <Radio className="w-3 h-3" />
      };
    }
    if (role.includes('معلق') || role.includes('مذيع')) {
      return {
        title: 'معلق ومحلل رياضي',
        color: 'from-blue-600 to-indigo-700 text-white',
        icon: <Mic className="w-3 h-3" />
      };
    }
    return {
      title: 'محرر وصحفي رياضي',
      color: 'from-slate-700 to-slate-800 text-white',
      icon: <FileText className="w-3 h-3" />
    };
  };

  const roleBadge = getRoleCategoryBadge();

  // Parse zones into Arabic badges (المنصة - المركز الإعلامي - أرضية الملعب)
  const getZoneChips = () => {
    const zones = [];
    const zStr = zoneAccess || '';
    if (zStr.includes('المنصة') || zStr.includes('المقصورة') || zStr.includes('PRESS') || zStr.includes('VIP')) {
      zones.push('المنصة');
    }
    if (zStr.includes('المركز') || zStr.includes('CENTRE')) {
      zones.push('المركز الإعلامي');
    }
    if (zStr.includes('الملعب') || zStr.includes('PITCH')) {
      zones.push('أرضية الملعب');
    }
    if (zones.length === 0) {
      zones.push('المركز الإعلامي', 'المنصة');
    }
    return zones;
  };

  return (
    <div 
      className="flex flex-col items-center select-none"
      style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
    >
      {/* ======================================================== */}
      {/* CARD FRONT SIDE (WHITE BACKGROUND - COMPACT OFFICIAL BADGE) */}
      {/* ======================================================== */}
      {!showBack ? (
        <div 
          className={`w-[325px] h-[580px] rounded-[26px] overflow-hidden relative flex flex-col justify-between bg-white text-slate-800 shadow-xl transition-all border-2 ${
            isRevoked ? 'border-rose-500' : 'border-emerald-600'
          }`}
          style={{
            boxShadow: isRevoked
              ? '0 15px 35px -10px rgba(225, 29, 72, 0.35)'
              : '0 15px 35px -10px rgba(5, 150, 105, 0.25)'
          }}
        >
          {/* Top Lanyard Slot */}
          <div className="pt-2.5 pb-0.5 flex justify-center relative z-20 shrink-0">
            <div className={`w-14 h-2 bg-slate-200 rounded-full border ${
              isRevoked ? 'border-rose-300' : 'border-slate-300'
            }`}></div>
          </div>

          {/* ================= HEADER SECTION ================= */}
          <div className="px-4 pt-0.5 pb-1 text-center relative z-10 shrink-0">
            {/* Centered Official Logo */}
            <div className="flex justify-center mb-0.5">
              <LFFLogo size={38} />
            </div>

            {/* Federation Official Arabic Name */}
            <h2 className="text-lg font-black text-slate-900 tracking-tight leading-tight">
              الاتحاد الليبي لكرة القدم
            </h2>

            {/* Sub-label in Arabic */}
            <p className="text-[9.5px] font-bold text-emerald-700 tracking-wide mt-0.5">
              الإدارة العامة للإعلام والتوثيق والاتصال
            </p>

            {/* Official Pass Ribbon */}
            <div className={`mt-1.5 py-1 px-3 rounded-lg font-black text-[10.5px] shadow-sm flex items-center justify-between border ${
              isRevoked
                ? 'bg-rose-600 text-white border-rose-700'
                : 'bg-gradient-to-r from-emerald-700 via-teal-700 to-emerald-700 text-white border-emerald-800'
            }`}>
              <span className="text-[9.5px]">الموسم 2026 / 2027</span>
              <span className="flex items-center gap-1 text-[10px]">
                {isRevoked ? (
                  <>
                    <AlertCircle className="w-3 h-3 text-white" />
                    <span>البطاقة مسحوبة</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-3 h-3 text-emerald-200" />
                    <span>بطاقة اعتماد إعلامي رسمي</span>
                  </>
                )}
              </span>
            </div>
          </div>

          {/* ================= MIDDLE: PHOTO & CREDENTIALS ================= */}
          <div className="px-4 flex flex-col items-center text-center relative z-10 flex-1 justify-center my-0.5">
            {/* Photo with Frame */}
            <div className="relative mb-1.5 shrink-0">
              <div className={`w-24 h-28 rounded-xl p-0.5 shadow-md ${
                isRevoked
                  ? 'bg-gradient-to-b from-rose-500 to-rose-700'
                  : 'bg-gradient-to-b from-amber-400 via-emerald-500 to-teal-600'
              }`}>
                <div className="w-full h-full rounded-[10px] overflow-hidden bg-slate-100 relative border border-slate-200">
                  {photoUrl ? (
                    <img 
                      src={photoUrl} 
                      alt={fullName} 
                      className={`w-full h-full object-cover ${isRevoked ? 'grayscale contrast-125' : ''}`} 
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-100">
                      <Camera className="w-7 h-7 mb-0.5 text-slate-400" />
                      <span className="text-[9px] font-bold">الصورة</span>
                    </div>
                  )}

                  {/* Red Revocation Stamp Across Photo */}
                  {isRevoked && (
                    <div className="absolute inset-0 bg-rose-950/60 backdrop-blur-[1px] flex items-center justify-center z-20">
                      <div className="transform -rotate-12 bg-rose-600 border border-white px-2 py-0.5 rounded shadow-lg">
                        <span className="text-white font-black text-[10px] tracking-wider block">
                          البطاقة مسحوبة
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Badge Pin */}
              <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap z-20">
                <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black shadow border flex items-center gap-1 ${
                  isRevoked
                    ? 'bg-rose-600 text-white border-rose-300'
                    : isApproved 
                      ? 'bg-emerald-600 text-white border-emerald-300' 
                      : 'bg-amber-600 text-white border-amber-300'
                }`}>
                  {isRevoked ? (
                    <span>مسحوبة</span>
                  ) : isApproved ? (
                    <span>معتمد</span>
                  ) : (
                    <span>قيد المراجعة</span>
                  )}
                </span>
              </div>
            </div>

            {/* Category Ribbon Under Photo */}
            <div className={`mt-1 py-0.5 px-2.5 rounded-md font-bold text-[9.5px] shadow-xs flex items-center gap-1 text-white shrink-0 ${
              isRevoked ? 'bg-slate-700' : `bg-gradient-to-r ${roleBadge.color}`
            }`}>
              {roleBadge.icon}
              <span>{role}</span>
            </div>

            {/* Journalist Full Name */}
            <h3 className="text-base font-black text-slate-900 mt-1 mb-0.5 tracking-tight line-clamp-1">
              {fullName}
            </h3>

            {/* Media Outlet Name */}
            <div className={`text-xs font-extrabold mb-1 flex items-center gap-1 line-clamp-1 ${
              isRevoked ? 'text-rose-700' : 'text-emerald-700'
            }`}>
              <span>{mediaOutlet}</span>
              <span className="text-[9.5px] font-normal text-slate-500">({outletType})</span>
            </div>

            {/* Accreditation Info Box (White/Light theme) */}
            <div className={`w-full rounded-xl p-2 text-right space-y-1 border ${
              isRevoked
                ? 'bg-rose-50 border-rose-200 text-rose-950'
                : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}>
              <div className="flex items-center justify-between text-xs border-b border-slate-200/80 pb-0.5">
                <span className="text-slate-500 text-[9.5px]">رقم الاعتماد الصحفي:</span>
                <span className={`font-mono font-black tracking-wide text-xs ${
                  isRevoked ? 'text-rose-600 line-through' : 'text-amber-800'
                }`}>
                  {accreditationCode}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 text-[9.5px]">المسابقات المعتمدة:</span>
                <span className="text-slate-900 text-[9.5px] font-extrabold">
                  {coverageType || 'جميع المسابقات الرسمية'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs border-t border-slate-200/80 pt-0.5">
                <span className="text-slate-500 text-[9.5px]">صلاحية وسريان البطاقة:</span>
                <span className={`text-[9.5px] font-bold ${
                  isRevoked ? 'text-rose-600' : 'text-emerald-700'
                }`}>
                  {isRevoked ? 'ملغاة ومسحوبة بقرار الاتحاد' : `حتى ${expiryDate || 'نهاية موسم 2026 / 2027'}`}
                </span>
              </div>
            </div>

            {/* Stadium Access Zones in Arabic */}
            <div className="w-full mt-1.5">
              <span className="text-[8.5px] text-slate-500 font-bold block text-right mb-0.5">
                أماكن تواجد الإعلامي المصرحة:
              </span>
              <div className="flex flex-wrap gap-1 justify-center">
                {isRevoked ? (
                  <span className="text-[8.5px] font-black px-2.5 py-0.5 rounded-md bg-rose-100 text-rose-800 border border-rose-300">
                    ✕ غير مصرح بالدخول (البطاقة مسحوبة)
                  </span>
                ) : (
                  getZoneChips().map((zone, idx) => (
                    <span 
                      key={idx}
                      className="text-[8.5px] font-black px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-800 border border-emerald-300 shadow-xs"
                    >
                      ✓ {zone}
                    </span>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* ================= FOOTER: QR CODE & DIGITAL VERIFICATION ================= */}
          <div className={`bg-slate-50 border-t ${
            isRevoked ? 'border-rose-300' : 'border-slate-200'
          } px-3 py-2 flex items-center justify-between relative z-10 shrink-0`}>
            <div className="text-right flex-1 pl-2">
              <div className={`flex items-center gap-1 font-black text-[9.5px] mb-0.5 ${
                isRevoked ? 'text-rose-700' : 'text-emerald-800'
              }`}>
                {isRevoked ? (
                  <AlertCircle className="w-3 h-3 text-rose-600 shrink-0" />
                ) : (
                  <Award className="w-3 h-3 text-amber-600 shrink-0" />
                )}
                <span>{isRevoked ? '⚠️ بطاقة مسحوبة وملغاة رسمياً' : 'الوثيقة الرسمية الإلكترونية المعتمدة'}</span>
              </div>
              <p className={`text-[8.5px] leading-tight ${isRevoked ? 'text-rose-600 font-bold' : 'text-slate-600'}`}>
                {isRevoked ? 'تم إيقاف صلاحية الدخول بقرار الاتحاد' : 'امسح الرمز للتحقق الفوري من صحة وسريان البطاقة'}
              </p>
              <span className={`text-[8px] font-bold block mt-0.5 ${
                isRevoked ? 'text-rose-700' : 'text-emerald-700'
              }`}>
                الاتحاد الليبي لكرة القدم • طرابلس - ليبيا
              </span>
            </div>

            {/* High Contrast QR Code */}
            <div className={`w-12 h-12 bg-white p-0.5 rounded-lg shadow-sm border flex items-center justify-center shrink-0 ${
              isRevoked ? 'border-rose-400' : 'border-slate-300'
            }`}>
              {qrSrc ? (
                <img src={qrSrc} alt="رمز التحقق" className="w-full h-full object-contain" />
              ) : (
                <QrIcon className="w-8 h-8 text-slate-800" />
              )}
            </div>
          </div>
        </div>
      ) : (
        /* ======================================================== */
        /* CARD BACK SIDE (WHITE BACKGROUND - REGULATIONS & DATA) */
        /* ======================================================== */
        <div 
          className={`w-[325px] h-[580px] rounded-[26px] overflow-hidden relative flex flex-col justify-between bg-white text-slate-800 shadow-xl transition-all border-2 p-4 text-right text-xs ${
            isRevoked ? 'border-rose-500' : 'border-emerald-600'
          }`}
        >
          {/* Lanyard Slot */}
          <div className="pt-0 pb-1 flex justify-center shrink-0">
            <div className={`w-14 h-2 bg-slate-200 rounded-full border ${
              isRevoked ? 'border-rose-300' : 'border-slate-300'
            }`}></div>
          </div>

          {/* Header Back */}
          <div className="text-center border-b border-slate-200 pb-1.5 shrink-0">
            <h4 className="text-sm font-black text-slate-900">
              الاتحاد الليبي لكرة القدم
            </h4>
            <p className="text-[9.5px] font-bold text-emerald-700">الضوابط والتعليمات الرسمية لحاملي بطاقات الاعتماد</p>
          </div>

          {/* Warning Badge if Revoked */}
          {isRevoked && (
            <div className="p-2 rounded-xl bg-rose-600 text-white text-center font-bold text-[10px] shadow border border-rose-700 shrink-0 my-1">
              ⛔ إشعار سحب: تم سحب هذه البطاقة رسمياً ويحظر استخدامها في كافة الملاعب
            </div>
          )}

          {/* Security Hologram Strip */}
          <div className="h-6 rounded-md bg-gradient-to-r from-amber-100 via-amber-200 to-emerald-100 border border-amber-300 flex items-center justify-center my-1 shrink-0">
            <span className="text-[9px] font-black text-slate-900 tracking-wide">
              ★ الاتحاد الليبي لكرة القدم • شريط الأمان والتوثيق الرسمي ★
            </span>
          </div>

          {/* Instructions and Terms in 100% Arabic */}
          <div className="space-y-1.5 text-[9.5px] leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200 flex-1 my-1.5 justify-center flex flex-col">
            <h5 className="font-bold text-emerald-800 text-[10.5px] border-b border-slate-200 pb-1 mb-1">
              ضوابط وتعليمات استخدام البطاقة:
            </h5>
            <ul className="list-disc list-inside space-y-1 text-slate-600">
              <li>هذه البطاقة وثيقة رسمية مخصصة لحاملها فقط ولا يجوز إعارتها أو التنازل عنها للغير.</li>
              <li>يجب إبراز البطاقة وتعليقها على الصدر طوال فترة التواجد بالملاعب.</li>
              <li>تخول البطاقة حاملها التواجد فقط في الأماكن المحددة (المنصة - المركز الإعلامي - أرضية الملعب للمصورين).</li>
              <li>الالتزام التام بتعليمات مراقب المباراة والمنسق الإعلامي والجهات المنظمة والأمنية.</li>
              <li>يحق للاتحاد الليبي سحب وإلغاء البطاقة فوراً عند ارتكاب أي مخالفة للضوابط.</li>
            </ul>
          </div>

          {/* Medical & Emergency info */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-2 grid grid-cols-2 gap-2 text-[9.5px] shrink-0 mb-1.5">
            <div>
              <span className="text-slate-500 block text-[8.5px]">فصيلة الدم للطوارئ:</span>
              <span className="font-mono font-black text-rose-600 text-xs">{bloodType}</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[8.5px]">طوارئ الملاعب والإسعاف:</span>
              <span className="font-mono font-bold text-slate-800 text-xs">191 / 193</span>
            </div>
          </div>

          {/* Barcode & Official Digital Signature */}
          <div className="border-t border-slate-200 pt-1.5 flex items-center justify-between shrink-0">
            <div className="text-right">
              <span className="text-[8px] text-slate-500 block">الختم الرقمي والتوقيع:</span>
              <div className="text-emerald-700 text-[9px] font-bold flex items-center gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                <span>معتمد من الأمانة العامة للاتحاد</span>
              </div>
            </div>

            {/* Barcode pattern */}
            <div className="flex flex-col items-end">
              <div className="flex gap-0.5 h-6 items-center bg-white px-1.5 py-0.5 rounded border border-slate-300">
                {[2, 1, 3, 1, 2, 4, 1, 3, 2, 1, 2, 3, 1, 4, 2].map((w, i) => (
                  <div key={i} className="bg-slate-900 h-full" style={{ width: `${w}px` }}></div>
                ))}
              </div>
              <span className="text-[8px] font-mono text-slate-500 mt-0.5">{accreditationCode}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Printer, 
  Share2, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Building2, 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Sparkles,
  ArrowRight,
  RotateCw,
  FileCheck2,
  Maximize2,
  X,
  Ban,
  AlertTriangle
} from 'lucide-react';
import PressCard from '@/components/PressCard';

export default function JournalistProfilePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [journalist, setJournalist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);
  const [cardSide, setCardSide] = useState('front'); // 'front' or 'back'
  const [showDocModal, setShowDocModal] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');

  const handleToggleRevoke = async (newStatus) => {
    const isRevoking = newStatus === 'REVOKED';
    const confirmPrompt = isRevoking
      ? 'هل أنت متأكد من سحب بطاقة الاعتماد وإيقاف صلاحيتها فوراً؟'
      : 'هل أنت متأكد من إلغاء السحب واستعادة صلاحية البطاقة (بعد انقضاء العقوبة أو التعهد بالالتزام)؟';
    
    if (!confirm(confirmPrompt)) return;

    setUpdatingStatus(true);
    setStatusMessage('');

    try {
      const res = await fetch(`/api/journalists/${journalist.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: newStatus,
          reviewNotes: isRevoking
            ? 'تم سحب بطاقة الاعتماد رسمياً بقرار الاتحاد الليبي لكرة القدم لمخالفة ضوابط التغطية.'
            : 'تم إلغاء سحب البطاقة واستعادة صلاحيتها بعد انقضاء العقوبة والتعهد بالالتزام بالضوابط.',
        }),
      });

      const data = await res.json();
      if (data.success) {
        setJournalist(data.data);
        setStatusMessage(isRevoking ? 'تم سحب البطاقة بنجاح وإيقاف الصلاحية' : 'تم إلغاء السحب وتفعيل البطاقة بنجاح');
        setTimeout(() => setStatusMessage(''), 4000);
      } else {
        alert(data.error || 'فشل تحديث حالة البطاقة');
      }
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setUpdatingStatus(false);
    }
  };

  useEffect(() => {
    if (!id) return;

    fetch(`/api/journalists/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setJournalist(data.data);
        } else {
          setError(data.error || 'لم يتم العثور على الإعلامي');
        }
      })
      .catch(err => {
        console.error(err);
        setError('تعذر تحميل بيانات الإعلامي');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleShare = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-24 px-4 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-slate-400 text-sm">جاري جلب بيانات بطاقة الإعلامي الرياضي...</p>
      </div>
    );
  }

  if (error || !journalist) {
    return (
      <div className="max-w-md mx-auto py-20 px-4 text-center">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">تعذر العثور على السجل</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'لم يتم العثور على بيانات هذا الإعلامي'}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-sm hover:bg-slate-700"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>
    );
  }

  const isApproved = journalist.status === 'APPROVED';
  const isRevoked = journalist.status === 'REVOKED';

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">

      {/* Status Toast Notification */}
      {statusMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm flex items-center gap-2 animate-in slide-in-from-bottom-4">
          <CheckCircle2 className="w-5 h-5" />
          {statusMessage}
        </div>
      )}

      {/* Header Banner */}
      <div className={`border rounded-3xl p-6 sm:p-8 shadow-xl mb-6 transition-all ${
        isRevoked 
          ? 'bg-rose-950/40 border-rose-800/60' 
          : 'bg-slate-900 border-slate-800'
      }`}>
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Identity Info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-right">
            <div className="relative">
              <img
                src={journalist.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'}
                alt={journalist.fullName}
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 shadow-xl transition-all ${
                  isRevoked ? 'border-rose-500 grayscale' : 'border-emerald-500'
                }`}
              />
              <div className="absolute -bottom-2 -left-2 bg-slate-950 p-1 rounded-full border border-slate-800">
                {isRevoked ? (
                  <Ban className="w-6 h-6 text-rose-400" />
                ) : isApproved ? (
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                ) : (
                  <Clock className="w-6 h-6 text-amber-400" />
                )}
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
                <h1 className="text-2xl sm:text-3xl font-black text-white">{journalist.fullName}</h1>
                <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                  isRevoked
                    ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                    : isApproved 
                    ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40' 
                    : 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                }`}>
                  {isRevoked ? '🚫 البطاقة مسحوبة' : isApproved ? '✓ اعتماد رسمي معتمد' : '⏳ قيد المراجعة والاعتماد'}
                </span>
              </div>

              <p className="text-sm font-semibold text-emerald-400">{journalist.role} • {journalist.mediaOutlet}</p>
              
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-slate-400">
                <span className="font-mono bg-slate-950 px-2.5 py-1 rounded-md border border-slate-800 text-slate-300">
                  كود الاعتماد: {journalist.accreditationCode}
                </span>
                <span>المدينة: {journalist.city || 'طرابلس'}</span>
                <span>نوع المؤسسة: {journalist.outletType}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center">
            <Link
              href={`/media-card/${journalist.id}/print`}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة بطاقة الاعتماد</span>
            </Link>

            <button
              onClick={handleShare}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold border border-slate-700 transition-colors"
            >
              <Share2 className="w-4 h-4 text-teal-400" />
              <span>{copied ? 'تم نسخ الرابط!' : 'مشاركة الرابط'}</span>
            </button>

            {/* Revoke / Unrevoke Button */}
            {isRevoked ? (
              <button
                onClick={() => handleToggleRevoke('APPROVED')}
                disabled={updatingStatus}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-sm border border-emerald-500 transition-all disabled:opacity-60"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>{updatingStatus ? 'جاري التحديث...' : 'إلغاء السحب وتفعيل البطاقة'}</span>
              </button>
            ) : isApproved ? (
              <button
                onClick={() => handleToggleRevoke('REVOKED')}
                disabled={updatingStatus}
                className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-rose-700 hover:bg-rose-600 text-white font-bold text-sm border border-rose-500/60 transition-all disabled:opacity-60"
              >
                <Ban className="w-4 h-4" />
                <span>{updatingStatus ? 'جاري التحديث...' : 'سحب بطاقة الاعتماد'}</span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      {/* REVOKED Warning Banner */}
      {isRevoked && (
        <div className="mb-8 p-5 bg-rose-950/50 border border-rose-500/60 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-rose-500/20 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-7 h-7 text-rose-400" />
          </div>
          <div>
            <p className="text-rose-300 font-black text-base mb-0.5">⛔ هذه البطاقة مسحوبة وموقوفة الصلاحية رسمياً</p>
            <p className="text-rose-400/80 text-sm">
              {journalist.reviewNotes || 'تم سحب بطاقة الاعتماد بقرار الاتحاد الليبي لكرة القدم.'}
            </p>
            <p className="text-rose-500/60 text-xs mt-1">لا تُقبل هذه البطاقة للدخول إلى الملاعب حتى يتم إلغاء السحب رسمياً.</p>
          </div>
        </div>
      )}

      {/* Main Grid: Details + Badge Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Full Credentials Data (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* 1. Accreditation Details Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <span>بيانات الاعتماد والتصريح الرياضي</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">رقم الاعتماد الرسمي:</span>
                <span className="text-sm font-bold font-mono text-emerald-400">{journalist.accreditationCode}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">المناطق المسموح بالتواجد فيها (Zones):</span>
                <span className="text-sm font-bold text-amber-400">{journalist.zoneAccess || 'المنصة • المركز الإعلامي'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">تاريخ الإصدار:</span>
                <span className="text-slate-200 font-medium">{journalist.issueDate || 'قيد المعالجة'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">تاريخ انتهاء الصلاحية:</span>
                <span className="text-slate-200 font-medium">{journalist.expiryDate || 'موسم 2026/2027'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">المسابقات المصرحة:</span>
                <span className="text-slate-200 font-medium">{journalist.coverageType || 'جميع المسابقات الرسمية'}</span>
              </div>

              <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80">
                <span className="text-slate-400 block mb-1">فصيلة الدم للطوارئ:</span>
                <span className="text-rose-400 font-bold font-mono">{journalist.bloodType || 'O+'}</span>
              </div>
            </div>

            {journalist.reviewNotes && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-300">
                <span className="font-bold block mb-0.5">ملاحظات الاعتماد الإداري:</span>
                {journalist.reviewNotes}
              </div>
            )}
          </div>

          {/* 2. Professional and Media Outlet Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-3">
              <Building2 className="w-5 h-5 text-teal-400" />
              <span>بيانات المؤسسة والسجل المهني</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">المؤسسة الإعلامية:</span>
                <span className="text-white font-semibold">{journalist.mediaOutlet}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">تصنيف المؤسسة:</span>
                <span className="text-slate-300">{journalist.outletType}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">الصفة الصحفية:</span>
                <span className="text-emerald-400 font-semibold">{journalist.role}</span>
              </div>

              <div className="flex justify-between py-2 border-b border-slate-800/60">
                <span className="text-slate-400">سنوات الخبرة:</span>
                <span className="text-slate-300">{journalist.experienceYears} سنوات</span>
              </div>

              {journalist.syndicateNumber && (
                <div className="flex justify-between py-2 border-b border-slate-800/60">
                  <span className="text-slate-400">رقم القيد الصحفي / الهيئة:</span>
                  <span className="text-slate-300 font-mono">{journalist.syndicateNumber}</span>
                </div>
              )}
            </div>
          </div>

          {/* 3. Uploaded Assignment Letter or Media ID Card */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <span>خطاب تكليف المؤسسة أو بطاقة العمل الإعلامي المرفوعة</span>
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-bold">
                مستند التكليف الرسمي
              </span>
            </div>

            {journalist.documentUrl ? (
              <div className="space-y-3">
                <div 
                  onClick={() => setShowDocModal(true)}
                  className="group relative cursor-pointer rounded-2xl overflow-hidden border border-slate-700 bg-slate-950 flex items-center justify-center p-2 hover:border-emerald-500 transition-colors"
                >
                  <img
                    src={journalist.documentUrl}
                    alt="وثيقة تكليف المؤسسة الإعلامية"
                    className="w-full h-auto max-h-80 object-contain rounded-xl group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded-2xl">
                    <span className="text-xs font-bold text-white bg-emerald-600 px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl">
                      <Maximize2 className="w-4 h-4" />
                      <span>عرض وتكبير الوثيقة المرفوعة</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 pt-1">
                  <span>تم إرفاق هذه الوثيقة من قبل الإعلامي لإثبات تكليفه وتفويضه الصحفي.</span>
                  <button
                    onClick={() => setShowDocModal(true)}
                    className="text-emerald-400 hover:text-emerald-300 font-bold flex items-center gap-1.5 text-xs bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                    <span>تكبير المستند</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-400 text-xs">
                <FileCheck2 className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-300 mb-1">تم التحقق من الوثائق الرسمية ورقياً</p>
                <p className="text-[11px] text-slate-500">تم اعتماد هذا السجل بناءً على تفويض ورقي محفوظ بأرشيف الاتحاد الليبي لكرة القدم.</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Interactive Card Preview (5 cols) */}
        <div className="lg:col-span-5 flex flex-col items-center">
          {/* Side Toggle Button */}
          <div className="flex items-center gap-2 mb-4 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => setCardSide('front')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                cardSide === 'front' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الوجه الأمامي
            </button>
            <button
              onClick={() => setCardSide('back')}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                cardSide === 'back' 
                  ? 'bg-emerald-600 text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              الوجه الخلفي
            </button>
            <button
              onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white"
              title="قلب البطاقة"
            >
              <RotateCw className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* The Badge */}
          <div className="p-4 rounded-3xl bg-slate-900/60 border border-slate-800/80 shadow-2xl">
            <PressCard 
              journalist={journalist} 
              showBack={cardSide === 'back'} 
              scale={0.95} 
            />
          </div>

          <p className="text-[11px] text-slate-500 mt-4 text-center max-w-xs">
            البطاقة مزودة برمز QR ديناميكي يفتح هذه الصفحة للتحقق من هوية الإعلامي لدى أمن الملاعب
          </p>
        </div>
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL FOR DOCUMENT VIEWING */}
      {showDocModal && journalist?.documentUrl && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <div className="relative max-w-4xl w-full max-h-[90vh] bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950">
              <div className="flex items-center gap-2">
                <FileCheck2 className="w-5 h-5 text-emerald-400" />
                <span className="font-bold text-white text-sm">
                  وثيقة التكليف: {journalist.fullName} ({journalist.mediaOutlet})
                </span>
              </div>
              <button
                onClick={() => setShowDocModal(false)}
                className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-4 overflow-auto flex items-center justify-center bg-slate-950/60 min-h-[60vh]">
              <img
                src={journalist.documentUrl}
                alt="خطاب التكليف بالحجم الكامل"
                className="max-w-full max-h-[75vh] object-contain rounded-xl shadow-2xl border border-slate-800"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

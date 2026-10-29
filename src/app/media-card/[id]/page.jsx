'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  AlertTriangle,
  RotateCw,
  ArrowRight,
  ShieldCheck,
  Ban
} from 'lucide-react';
import PressCard from '@/components/PressCard';

export default function MediaCardVerificationPage() {
  const params = useParams();
  const { id } = params;

  const [journalist, setJournalist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [cardSide, setCardSide] = useState('front'); // 'front' or 'back'

  useEffect(() => {
    if (!id) return;

    fetch(`/api/journalists/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setJournalist(data.data);
        } else {
          setError(data.error || 'لم يتم العثور على بيانات البطاقة');
        }
      })
      .catch(err => {
        console.error(err);
        setError('تعذر تحميل بيانات التحقق من البطاقة');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center">
        <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-slate-300 text-sm font-semibold">جاري التحقق من بيانات بطاقة الاعتماد...</p>
      </div>
    );
  }

  if (error || !journalist) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-rose-500/10 text-rose-400 flex items-center justify-center mb-4">
          <AlertCircle className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">تعذر التحقق من البطاقة</h2>
        <p className="text-sm text-slate-400 mb-6">{error || 'لم يتم العثور على سجل لهذه البطاقة'}</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-800 text-white text-sm hover:bg-slate-700 transition-colors"
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
    <div className="min-h-[85vh] py-8 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md flex flex-col items-center">
        
        {/* ================= OFFICIAL STATUS VERIFICATION BANNER ================= */}
        <div className={`w-full rounded-2xl p-4 mb-6 shadow-xl border text-center transition-all ${
          isRevoked 
            ? 'bg-rose-950/80 border-rose-600 text-rose-100 shadow-rose-950/40' 
            : isApproved
            ? 'bg-emerald-950/80 border-emerald-500 text-emerald-100 shadow-emerald-950/40'
            : 'bg-amber-950/80 border-amber-500 text-amber-100'
        }`}>
          <div className="flex items-center justify-center gap-2 mb-1.5">
            {isRevoked ? (
              <div className="w-9 h-9 rounded-full bg-rose-600 flex items-center justify-center shadow-md animate-pulse">
                <Ban className="w-5 h-5 text-white" />
              </div>
            ) : isApproved ? (
              <div className="w-9 h-9 rounded-full bg-emerald-600 flex items-center justify-center shadow-md">
                <CheckCircle2 className="w-5 h-5 text-white" />
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-amber-600 flex items-center justify-center shadow-md">
                <Clock className="w-5 h-5 text-white" />
              </div>
            )}

            <h1 className="text-lg font-black tracking-tight">
              {isRevoked 
                ? 'البطاقة مسحوبة وموقوفة الصلاحية' 
                : isApproved 
                ? 'البطاقة معتمدة وسارية الصلاحية' 
                : 'البطاقة قيد المراجعة والاعتماد'}
            </h1>
          </div>

          <p className="text-xs font-semibold">
            {isRevoked 
              ? '⛔ تم سحب هذا الاعتماد بقرار رسمي - يحظر الدخول بها للملاعب' 
              : isApproved 
              ? '✓ مصرح لحاملها بالدخول والتغطية الإعلامية لكافة المسابقات الرسمية' 
              : '⏳ جاري تدقيق واعتماد بيانات الإعلامي من قبل الإدارة'}
          </p>

          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[11px] opacity-90 px-1 font-mono">
            <span>كود: {journalist.accreditationCode}</span>
            <span className="font-sans font-bold">{journalist.fullName}</span>
          </div>
        </div>

        {/* ================= CARD SIDE TOGGLE ================= */}
        <div className="flex items-center gap-2 mb-4 bg-slate-900 p-1.5 rounded-2xl border border-slate-800 shadow-lg">
          <button
            onClick={() => setCardSide('front')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              cardSide === 'front' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الوجه الأمامي
          </button>
          <button
            onClick={() => setCardSide('back')}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              cardSide === 'back' 
                ? 'bg-emerald-600 text-white shadow-md' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            الوجه الخلفي
          </button>
          <button
            onClick={() => setCardSide(cardSide === 'front' ? 'back' : 'front')}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
            title="قلب وجه البطاقة"
          >
            <RotateCw className="w-4 h-4" />
          </button>
        </div>

        {/* ================= THE PRESS CARD ================= */}
        <div className="p-3 sm:p-5 rounded-3xl bg-slate-900/50 border border-slate-800 shadow-2xl flex justify-center">
          <PressCard 
            journalist={journalist} 
            showBack={cardSide === 'back'} 
            scale={1} 
          />
        </div>

        {/* Verification Note */}
        <p className="text-[11px] text-slate-400 mt-4 text-center">
          نظام التحقق الإلكتروني المباشر • الاتحاد الليبي لكرة القدم
        </p>

      </div>
    </div>
  );
}

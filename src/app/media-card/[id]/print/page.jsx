'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Printer, ArrowRight, CheckCircle2, RotateCw, AlertCircle } from 'lucide-react';
import PressCard from '@/components/PressCard';

export default function PrintCardPage() {
  const params = useParams();
  const { id } = params;

  const [journalist, setJournalist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [printLayout, setPrintLayout] = useState('both'); // 'both', 'front', 'back'

  useEffect(() => {
    if (!id) return;

    fetch(`/api/journalists/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setJournalist(data.data);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, [id]);

  const triggerPrint = () => {
    if (typeof window !== 'undefined') {
      window.print();
    }
  };

  if (loading) {
    return (
      <div className="py-24 text-center text-slate-400">
        جاري تجهيز بطاقة الاعتماد للطباعة...
      </div>
    );
  }

  if (!journalist) {
    return (
      <div className="py-20 text-center text-slate-400">
        لم يتم العثور على بيانات الإعلامي
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 py-6 px-4">
      {/* Top Toolbar (Hidden on print) */}
      <div className="no-print max-w-4xl mx-auto mb-8 p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href={`/media-card/${journalist.id}`}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors"
            title="العودة"
          >
            <ArrowRight className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-base font-bold text-white">طباعة بطاقة الاعتماد الصحفي</h1>
            <p className="text-xs text-slate-400">{journalist.fullName} • {journalist.accreditationCode}</p>
          </div>
        </div>

        {/* Layout Options */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            onClick={() => setPrintLayout('both')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              printLayout === 'both' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            الوجهين معاً (للطباعة والطي)
          </button>
          <button
            onClick={() => setPrintLayout('front')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              printLayout === 'front' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            الوجه الأمامي فقط
          </button>
          <button
            onClick={() => setPrintLayout('back')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              printLayout === 'back' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'
            }`}
          >
            الوجه الخلفي فقط
          </button>
        </div>

        {/* Print Button */}
        <button
          onClick={triggerPrint}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-sm shadow-lg shadow-emerald-600/30 transition-transform hover:scale-105"
        >
          <Printer className="w-4 h-4" />
          <span>طباعة فورية للبطاقة</span>
        </button>
      </div>

      {/* Printing Guidance Notice (Hidden on print) */}
      <div className="no-print max-w-4xl mx-auto mb-6 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-400" />
          <span>
            نصيحة الطباعة: للحصول على أفضل جودة وألوان كاملة، تأكد من تفعيل خيار <b>"رسومات الخلفية"</b> في إعدادات نافذة الطباعة.
          </span>
        </div>
      </div>

      {/* PRINT CONTAINER */}
      <div className="print-area flex flex-col md:flex-row items-center justify-center gap-8 py-4">
        {(printLayout === 'both' || printLayout === 'front') && (
          <div className="print-card-wrapper flex flex-col items-center">
            <div className="no-print text-center text-xs text-slate-400 mb-2 font-bold">
              الوجه الأمامي للبطاقة
            </div>
            <PressCard 
              journalist={journalist} 
              showBack={false} 
              scale={1} 
              isPrint={true} 
            />
          </div>
        )}

        {(printLayout === 'both' || printLayout === 'back') && (
          <div className="print-card-wrapper flex flex-col items-center">
            <div className="no-print text-center text-xs text-slate-400 mb-2 font-bold">
              الوجه الخلفي للبطاقة
            </div>
            <PressCard 
              journalist={journalist} 
              showBack={true} 
              scale={1} 
              isPrint={true} 
            />
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { UserPlus, ShieldLock, Award, CheckCircle } from 'lucide-react';
import LFFLogo from '@/components/LFFLogo';
import AdminLoginModal from '@/components/AdminLoginModal';

export default function HomePage() {
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  return (
    <div className="min-h-[85vh] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
      {/* Ambient Lighting Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-emerald-600/15 blur-[140px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-10 left-1/4 w-[350px] h-[250px] bg-amber-500/10 blur-[120px] rounded-full pointer-events-none"></div>

      {/* Main Container */}
      <div className="max-w-2xl w-full mx-auto text-center relative z-10 space-y-8 animate-in fade-in duration-500">
        {/* Libyan Football Federation Logo */}
        <div className="flex justify-center transform hover:scale-105 transition-transform duration-300">
          <LFFLogo size={170} />
        </div>

        {/* Federation Name & System Title */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs sm:text-sm font-bold tracking-wide">
            <Award className="w-4 h-4 text-amber-400" />
            <span>الموسم الرياضي 2026 / 2027</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            الاتحاد الليبي لكرة القدم
          </h1>

          <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300">
            منظومة اعتماد وبطاقات الإعلاميين الرياضيين
          </div>

          <p className="text-sm sm:text-base text-slate-300 max-w-lg mx-auto leading-relaxed pt-2">
            البوابة الرقمية الرسمية لقيد وتسجيل الإعلاميين والصحفيين والمصورين الرياضيين وإصدار بطاقات الاعتماد وتصاريح دخول الملاعب.
          </p>
        </div>

        {/* The Two Main Requested Action Buttons */}
        <div className="pt-4 max-w-md mx-auto flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4">
          {/* Button 1: Register New Journalist */}
          <Link
            href="/register"
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-black text-base shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 hover:scale-105 transition-all duration-200 border border-emerald-400/30"
          >
            <UserPlus className="w-5 h-5" />
            <span>تسجيل إعلامي جديد</span>
          </Link>

          {/* Button 2: Admin Login (Requires Username & Password) */}
          <button
            onClick={() => setIsLoginOpen(true)}
            className="flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-2xl bg-slate-900/90 hover:bg-slate-800 text-slate-100 font-bold text-base shadow-lg shadow-black/40 hover:scale-105 transition-all duration-200 border border-slate-700/80 hover:border-amber-500/50"
          >
            <ShieldLock className="w-5 h-5 text-amber-400" />
            <span>دخول مدير المنظومة</span>
          </button>
        </div>

        {/* Official Footer Verification Tagline */}
        <div className="pt-6 border-t border-slate-800/80 flex items-center justify-center gap-2 text-xs text-slate-500">
          <CheckCircle className="w-4 h-4 text-emerald-500" />
          <span>نظام مشفر وموثق برمز استجابة سريعة QR للملاعب والبطولات الليبية</span>
        </div>
      </div>

      {/* Admin Login Modal (Triggered by Button 2) */}
      <AdminLoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
      />
    </div>
  );
}

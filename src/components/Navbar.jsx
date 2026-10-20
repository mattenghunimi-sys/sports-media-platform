'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LFFLogo from '@/components/LFFLogo';
import { UserPlus, ShieldLock, Home } from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();

  // Hide the navbar on Home ('/') and Register ('/register') as requested
  if (pathname === '/' || pathname === '/register') {
    return null;
  }

  return (
    <header className="no-print sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Federation Title */}
          <Link href="/" className="flex items-center gap-3 group">
            <LFFLogo size={36} className="group-hover:scale-105 transition-transform" />
            <div>
              <div className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                الاتحاد الليبي لكرة القدم
                <span className="text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                  LFF • 2026
                </span>
              </div>
              <p className="text-xs text-slate-400">منظومة اعتماد وبطاقات الإعلاميين الرياضيين</p>
            </div>
          </Link>

          {/* Nav Actions */}
          <nav className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/"
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <Home className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">الرئيسية</span>
            </Link>

            <Link
              href="/register"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-600/30 transition-all hover:scale-105"
            >
              <UserPlus className="w-4 h-4" />
              <span>تسجيل إعلامي</span>
            </Link>

            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 hover:border-amber-500/50 transition-colors"
            >
              <ShieldLock className="w-4 h-4 text-amber-400" />
              <span>دخول الإدارة</span>
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}

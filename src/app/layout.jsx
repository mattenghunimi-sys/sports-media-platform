import './globals.css';
import Navbar from '@/components/Navbar';
import LFFLogo from '@/components/LFFLogo';

export const metadata = {
  title: 'الاتحاد الليبي لكرة القدم | منظومة اعتماد وبطاقات الإعلاميين الرياضيين',
  description: 'البوابة الرسمية للاتحاد الليبي لكرة القدم لتسجيل وتوثيق بيانات الإعلاميين الرياضيين وإصدار بطاقات الاعتماد الصحفية الذكية للملاعب والمسابقات الرسمية.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className="bg-slate-950 text-slate-100 min-h-screen flex flex-col font-sans selection:bg-emerald-600 selection:text-white">
        {/* Navigation Bar (Hidden automatically on home page '/') */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-1">
          {children}
        </main>

        {/* Footer */}
        <footer className="no-print bg-slate-950 border-t border-slate-800/80 py-8 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-slate-400 text-xs">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <LFFLogo size={24} />
                <span className="font-bold text-slate-200">
                  الاتحاد الليبي لكرة القدم - الإدارة العامة للإعلام والتوثيق
                </span>
              </div>
              <p className="text-slate-500">
                جميع الحقوق محفوظة © {new Date().getFullYear()} • المنظومة الإلكترونية الموحدة لبطاقات الملاعب
              </p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}

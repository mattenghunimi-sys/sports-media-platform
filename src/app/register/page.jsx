'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  User, 
  Building2, 
  Camera, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  ArrowRight, 
  FileCheck2,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Briefcase,
  ShieldCheck
} from 'lucide-react';
import LFFLogo from '@/components/LFFLogo';

export default function RegisterPage() {
  const router = useRouter();

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    nationalId: '',
    mediaOutlet: '',
    outletType: 'قناة تلفزيونية فضائية',
    role: 'مراسل ميداني',
    coverageType: 'جميع المسابقات الرسمية',
    phone: '',
    email: '',
    city: 'طرابلس',
    country: 'ليبيا',
    experienceYears: '3',
    syndicateNumber: '',
    bloodType: 'O+',
    photoUrl: '',
    documentUrl: '',
  });

  const [photoPreview, setPhotoPreview] = useState('');
  const [docName, setDocName] = useState('');
  const [photoCompressing, setPhotoCompressing] = useState(false);
  const [docCompressing, setDocCompressing] = useState(false);
  const [photoSizeInfo, setPhotoSizeInfo] = useState('');
  const [docSizeInfo, setDocSizeInfo] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successData, setSuccessData] = useState(null);

  // Helper function to automatically compress and resize images client-side
  const compressImage = (file, { maxWidth = 800, maxHeight = 800, quality = 0.82 } = {}) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (readerEvent) => {
        const img = new Image();
        img.onload = () => {
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve(readerEvent.target.result);
            return;
          }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
          resolve(compressedDataUrl);
        };
        img.onerror = () => resolve(readerEvent.target.result);
        img.src = readerEvent.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Handle Text inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle Photo upload with automatic compression
  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPhotoCompressing(true);
    setPhotoSizeInfo('');

    try {
      const compressed = await compressImage(file, { maxWidth: 800, maxHeight: 800, quality: 0.82 });
      const sizeKB = Math.round((compressed.length * 0.75) / 1024);
      setPhotoPreview(compressed);
      setFormData(prev => ({ ...prev, photoUrl: compressed }));
      setPhotoSizeInfo(`✓ تم تصغير وضغط الصورة بنجاح (${sizeKB} ك.ب)`);
    } catch (err) {
      console.error('Photo compression error:', err);
      alert('تعذر معالجة الصورة، يرجى اختيار صورة أخرى');
    } finally {
      setPhotoCompressing(false);
    }
  };

  // Handle Document upload with automatic compression
  const handleDocUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setDocName(file.name);
    setDocCompressing(true);
    setDocSizeInfo('');

    try {
      const compressed = await compressImage(file, { maxWidth: 1400, maxHeight: 1400, quality: 0.80 });
      const sizeKB = Math.round((compressed.length * 0.75) / 1024);
      setFormData(prev => ({ ...prev, documentUrl: compressed }));
      setDocSizeInfo(`✓ تم تحسين حجم الوثيقة بنجاح (${sizeKB} ك.ب)`);
    } catch (err) {
      console.error('Document compression error:', err);
      alert('تعذر معالجة ملف الوثيقة');
    } finally {
      setDocCompressing(false);
    }
  };

  // Quick preset avatars for convenience
  const setPresetAvatar = (url) => {
    setPhotoPreview(url);
    setFormData(prev => ({ ...prev, photoUrl: url }));
  };

  // Submit Form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    // Client-side validation
    if (!formData.fullName || !formData.nationalId || !formData.mediaOutlet || !formData.phone) {
      setErrorMessage('يرجى ملء جميع الحقول المطلوبة المميزة بـ (*)');
      return;
    }

    if (!formData.documentUrl) {
      setErrorMessage('يرجى إرفاق صورة خطاب تكليف المؤسسة أو بطاقة العمل الإعلامي (إجباري لإحالة الطلب)');
      return;
    }

    if (!agreedToTerms) {
      setErrorMessage('يجب قراءة ضوابط اعتماد الصحفيين والمصورين والتعهد بالالتزام بها للمتابعة');
      return;
    }

    setSubmitting(true);

    try {
      const res = await fetch('/api/journalists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'فشل في حفظ البيانات');
      }

      // Immediately inform user and return to home page as requested
      alert('✓ تم إرسال طلب تسجيل الإعلامي بنجاح، والطلب الآن قيد المراجعة والاعتماد.');
      router.push('/');
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || 'حدث خطأ أثناء إرسال البيانات');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Top Header with Logo and Back Button */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-5 border-b border-slate-800">
        <div className="flex items-center gap-3.5">
          <LFFLogo size={42} />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-semibold mb-1">
              <span>الاتحاد الليبي لكرة القدم • موسم 2026</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">طلب قيد وتسجيل إعلامي رياضي</h1>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-semibold border border-slate-800 hover:border-slate-700 transition-colors shadow-sm"
        >
          <ArrowRight className="w-4 h-4 text-emerald-400" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>

      {/* Registration Form (Centered without Card Preview as requested) */}
      <div className="max-w-3xl mx-auto">
        <div className="bg-slate-900/90 border border-slate-800/90 rounded-3xl p-6 sm:p-8 shadow-xl">
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 1. Personal Information */}
            <div>
              <div className="flex items-center gap-2 text-base font-bold text-white mb-4 pb-2 border-b border-slate-800">
                <User className="w-5 h-5 text-emerald-400" />
                <span>1. البيانات الشخصية</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    الاسم الكامل (الثلاثي أو الرباعي) *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    placeholder="مثال: سالم مفتاح الورفلي"
                    value={formData.fullName}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    رقم الهوية الوطنية / جواز السفر *
                  </label>
                  <input
                    type="text"
                    name="nationalId"
                    required
                    placeholder="10XXXXXXXX"
                    value={formData.nationalId}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    فصيلة الدم (للطوارئ الرياضية)
                  </label>
                  <select
                    name="bloodType"
                    value={formData.bloodType}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    رقم الجوال / الواتساب *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+2189XXXXXXXX"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white font-mono outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    البريد الإلكتروني
                  </label>
                  <input
                    type="email"
                    name="email"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    المدينة
                  </label>
                  <input
                    type="text"
                    name="city"
                    placeholder="طرابلس / بنغازي / مصراتة / الزاوية..."
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    الدولة
                  </label>
                  <input
                    type="text"
                    name="country"
                    value={formData.country}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 2. Media & Professional Details */}
            <div>
              <div className="flex items-center gap-2 text-base font-bold text-white mb-4 pb-2 border-b border-slate-800">
                <Building2 className="w-5 h-5 text-teal-400" />
                <span>2. بيانات المؤسسة والصفة الإعلامية</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    اسم المؤسسة الإعلامية أو القناة / الصحيفة / المنصة *
                  </label>
                  <input
                    type="text"
                    name="mediaOutlet"
                    required
                    placeholder="مثال: قناة ليبيا الرياضية / صحيفة الصباح الليبية / منصة ريميسا"
                    value={formData.mediaOutlet}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    نوع المؤسسة الإعلامية
                  </label>
                  <select
                    name="outletType"
                    value={formData.outletType}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="قناة تلفزيونية فضائية">قناة تلفزيونية فضائية</option>
                    <option value="صحيفة ورقية وإلكترونية">صحيفة ورقية وإلكترونية</option>
                    <option value="محطة إذاعية">محطة إذاعية</option>
                    <option value="وكالة أنباء رسمية">وكالة أنباء رسمية</option>
                    <option value="منصة رقمية وصانع محتوى">منصة رقمية وصانع محتوى</option>
                    <option value="إعلامي رياضي مستقل (Freelance)">إعلامي رياضي مستقل (Freelance)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    الصفة الصحفية / التخصص *
                  </label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  >
                    <option value="مراسل ميداني">مراسل ميداني (Field Reporter)</option>
                    <option value="مصور فوتوغرافي">مصور فوتوغرافي (Photographer)</option>
                    <option value="مصور فيديو تلفزيوني">مصور فيديو تلفزيوني (Cameraman)</option>
                    <option value="معلق ومحلل رياضي">معلق ومحلل رياضي (Commentator)</option>
                    <option value="محرر صحفي رياضي">محرر صحفي رياضي (Journalist)</option>
                    <option value="صانع محتوى رقمي">صانع محتوى رقمي (Digital Creator)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    المسابقات المصرح بتغطيتها
                  </label>
                  <input
                    type="text"
                    name="coverageType"
                    placeholder="جميع المسابقات الرسمية"
                    value={formData.coverageType}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    سنوات الخبرة في الإعلام الرياضي
                  </label>
                  <input
                    type="number"
                    min="1"
                    name="experienceYears"
                    value={formData.experienceYears}
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl px-4 py-2.5 text-sm text-white outline-none"
                  />
                </div>
              </div>
            </div>

            {/* 3. Photo & Document Upload */}
            <div>
              <div className="flex items-center gap-2 text-base font-bold text-white mb-4 pb-2 border-b border-slate-800">
                <Camera className="w-5 h-5 text-amber-400" />
                <span>3. الصورة الشخصية وإثبات الهوية</span>
              </div>

              {/* Photo Upload Area */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  الصورة الشخصية الرسمية للبطاقة (خلفية بيضاء أو رسمية)
                </label>
                <div className="flex flex-col sm:flex-row items-center gap-4 p-4 rounded-2xl bg-slate-950 border border-dashed border-slate-700">
                  <div className="w-20 h-24 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 flex items-center justify-center shrink-0">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-8 h-8 text-slate-500" />
                    )}
                  </div>
                  <div className="flex-1 text-center sm:text-right">
                    <label className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-colors ${
                      photoCompressing ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500'
                    }`}>
                      <Upload className="w-4 h-4" />
                      <span>{photoCompressing ? 'جاري ضغط وتصغير الصورة...' : (formData.photoUrl ? 'تغيير الصورة الشخصية' : 'اختر صورة من جهازك')}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        disabled={photoCompressing}
                        onChange={handlePhotoUpload} 
                        className="hidden" 
                      />
                    </label>
                    {photoSizeInfo ? (
                      <p className="text-[11px] text-emerald-400 font-semibold mt-1">{photoSizeInfo}</p>
                    ) : (
                      <p className="text-[11px] text-slate-400 mt-1">يتم تصغير وضغط الصورة تلقائياً بجودة عالية لتناسب البطاقة</p>
                    )}

                    {/* Quick test avatars */}
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-[10px] text-slate-500">أو اختر صورة تجريبية:</span>
                      <button
                        type="button"
                        onClick={() => setPresetAvatar('https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80')}
                        className="text-[10px] text-emerald-400 hover:underline"
                      >
                        نموذج 1
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresetAvatar('https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80')}
                        className="text-[10px] text-emerald-400 hover:underline"
                      >
                        نموذج 2
                      </button>
                      <button
                        type="button"
                        onClick={() => setPresetAvatar('https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=400&q=80')}
                        className="text-[10px] text-emerald-400 hover:underline"
                      >
                        نموذج 3
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assignment Letter / Document Upload (Mandatory) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <span>خطاب تكليف المؤسسة الإعلامية أو صورة بطاقة العمل *</span>
                    <span className="text-[10px] bg-rose-500/20 text-rose-300 border border-rose-500/30 px-2 py-0.2 rounded-full font-bold">
                      إجباري لإحالة الطلب
                    </span>
                  </label>
                  {formData.documentUrl && (
                    <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" />
                      <span>تم إرفاق الوثيقة</span>
                    </span>
                  )}
                </div>

                <div className={`p-4 rounded-2xl bg-slate-950 border border-dashed transition-all ${
                  formData.documentUrl ? 'border-emerald-500/50 bg-emerald-950/10' : 'border-slate-700'
                } flex flex-col sm:flex-row items-center justify-between gap-4`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                      formData.documentUrl ? 'bg-emerald-500/20 text-emerald-400' : 'bg-teal-500/10 text-teal-400'
                    }`}>
                      <FileCheck2 className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-xs text-slate-200 block font-bold">
                        {docName || (formData.documentUrl ? 'تم رفع وثيقة التكليف بنجاح' : 'إرفاق المستند (صورة أو PDF)')}
                      </span>
                      {docSizeInfo ? (
                        <span className="text-[10px] text-emerald-400 font-semibold block">{docSizeInfo}</span>
                      ) : (
                        <span className="text-[10px] text-slate-400">
                          صورة من خطاب التكليف الرسمي الصادر من القناة أو الصحيفة أو بطاقة عضوية المؤسسة
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <label className={`cursor-pointer px-4 py-2 rounded-xl text-white text-xs font-bold transition-all shadow-md flex items-center gap-1.5 ${
                      docCompressing ? 'bg-amber-600 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-500'
                    }`}>
                      <Upload className="w-3.5 h-3.5" />
                      <span>{docCompressing ? 'جاري تحسين الوثيقة...' : (formData.documentUrl ? 'تغيير الوثيقة' : 'رفع الوثيقة الآن *')}</span>
                      <input 
                        type="file" 
                        required
                        accept="image/*,.pdf" 
                        disabled={docCompressing}
                        onChange={handleDocUpload} 
                        className="hidden" 
                      />
                    </label>

                    {/* Quick test sample document */}
                    {!formData.documentUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          const sample = 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=800&q=80';
                          setDocName('خطاب_تكليف_رسمي_نموذج.jpg');
                          setFormData(prev => ({ ...prev, documentUrl: sample }));
                        }}
                        className="text-[10px] text-slate-400 hover:text-emerald-400 underline whitespace-nowrap"
                      >
                        نموذج تجريبي
                      </button>
                    )}
                  </div>
                </div>

                {/* Thumbnail preview if document is an image */}
                {formData.documentUrl && formData.documentUrl.startsWith('data:image') && (
                  <div className="mt-3 p-2 bg-slate-950 rounded-xl border border-slate-800 flex items-center gap-3">
                    <img 
                      src={formData.documentUrl} 
                      alt="وثيقة التكليف" 
                      className="w-16 h-16 rounded-lg object-cover border border-emerald-500/50" 
                    />
                    <span className="text-[11px] text-slate-300">معاينة الوثيقة المرفوعة جاهزة للمراجعة والاعتماد</span>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Official Terms & Regulations */}
            <div className="pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2 text-base font-bold text-white mb-3 pb-2 border-b border-slate-800">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <span>4. ضوابط اعتماد الصحفيين والمصورين لتغطية مباريات الدوري الممتاز</span>
              </div>

              {/* Regulations Box */}
              <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800/90 shadow-inner mb-4">
                <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span className="text-xs font-bold text-white">الموسم الرياضي 2026–2027</span>
                  </div>
                  <span className="text-[11px] text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                    الاتحاد الليبي لكرة القدم
                  </span>
                </div>

                <ul className="space-y-2.5 text-xs text-slate-300 pr-1 leading-relaxed">
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>الالتزام بلوائح الاتحاد الليبي لكرة القدم والضوابط المنظمة للمباريات.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>إبراز البطاقة الإعلامية وتعليقها على الصدر طوال فترة التغطية.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>التزام المصورين بارتداء الغلالات أو السترات المخصصة والمميزة لهم.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>التقيد بالأماكن المخصصة للصحفيين والمصورين وعدم تجاوزها.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>عدم دخول أرضية الملعب أو المناطق المحظورة إلا بإذن مسبق.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>عدم إعاقة سير المباريات أو عمل اللاعبين والحكام والأجهزة الفنية والتنظيمية.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>الالتزام بتعليمات مراقب المباراة والمنسق الإعلامي والجهات المنظمة والأمنية.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>المحافظة على النظام والانضباط داخل الملعب واحترام حقوق بقية المعتمدين.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                    <span>مغادرة المناطق المخصصة للتغطية عند انتهاء المدة المحددة أو بطلب من الجهة المنظمة.</span>
                  </li>
                  <li className="flex items-start gap-2.5 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                    <span className="font-semibold">يحق للاتحاد الليبي لكرة القدم سحب بطاقة الاعتماد وإلغائها من أي صحفي أو مصور يخالف هذه الضوابط أو لا يلتزم بها.</span>
                  </li>
                </ul>
              </div>

              {/* Mandatory Undertaking & Acknowledgment */}
              <label className={`flex items-start gap-3 p-4 rounded-2xl border transition-all cursor-pointer mb-6 ${
                agreedToTerms
                  ? 'bg-emerald-950/20 border-emerald-500/60 shadow-sm shadow-emerald-500/10'
                  : 'bg-slate-950 border-amber-500/40 hover:border-amber-400/70'
              }`}>
                <input
                  type="checkbox"
                  required
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-emerald-600 focus:ring-0 focus:ring-offset-0 bg-slate-900 border-slate-700 cursor-pointer"
                />
                <span className="text-xs font-semibold text-slate-100 leading-relaxed">
                  أقرّ باطلاعي على الضوابط المذكورة أعلاه، وأتعهد بالالتزام بها طوال فترة اعتمادي لتغطية مباريات الدوري الممتاز للموسم الرياضي 2026–2027، وأوافق على اتخاذ الإجراءات المنصوص عليها بحقّي عند مخالفتها. <span className="text-rose-400 font-bold">*</span>
                </span>
              </label>

              <button
                type="submit"
                disabled={submitting || !agreedToTerms}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? (
                  <span>جاري حفظ البيانات...</span>
                ) : (
                  <>
                    <Sparkles className="w-5 h-5" />
                    <span>إرسال طلب التسجيل واستخراج البطاقة</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

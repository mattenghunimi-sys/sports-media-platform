import { NextResponse } from 'next/server';
import { getAllJournalists, createJournalist } from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status');
    const query = searchParams.get('query');

    let list = getAllJournalists();

    if (status && status !== 'ALL') {
      list = list.filter(j => j.status === status);
    }

    if (query) {
      const q = query.trim().toLowerCase();
      list = list.filter(j => 
        j.fullName?.toLowerCase().includes(q) ||
        j.mediaOutlet?.toLowerCase().includes(q) ||
        j.accreditationCode?.toLowerCase().includes(q) ||
        j.nationalId?.includes(q) ||
        j.phone?.includes(q)
      );
    }

    return NextResponse.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('API GET journalists error:', error);
    return NextResponse.json({ success: false, error: 'حدث خطأ في استرجاع البيانات' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();

    // Required fields validation including mandatory assignment document
    if (!body.fullName || !body.nationalId || !body.mediaOutlet || !body.role || !body.phone || !body.documentUrl) {
      return NextResponse.json({
        success: false,
        error: 'يرجى استكمال جميع الحقول الإلزامية وإرفاق خطاب تكليف المؤسسة أو بطاقة العمل الإعلامي'
      }, { status: 400 });
    }

    const created = createJournalist(body);

    return NextResponse.json({
      success: true,
      message: 'تم تسجيل الطلب بنجاح وهو الآن قيد المراجعة والاعتماد',
      data: created
    }, { status: 201 });
  } catch (error) {
    console.error('API POST journalist error:', error);
    return NextResponse.json({ success: false, error: 'تعذر حفظ البيانات' }, { status: 500 });
  }
}

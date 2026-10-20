import { NextResponse } from 'next/server';
import { getJournalistById, updateJournalistStatus, deleteJournalist } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const { id } = params;
    const journalist = getJournalistById(id);

    if (!journalist) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على الإعلامي المطلوب' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: journalist });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'خطأ في جلب بيانات الإعلامي' }, { status: 500 });
  }
}

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    const updated = updateJournalistStatus(id, {
      status: body.status,
      reviewNotes: body.reviewNotes,
      zoneAccess: body.zoneAccess,
      bloodType: body.bloodType
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'لم يتم العثور على السجل' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث حالة السجل بنجاح',
      data: updated
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'تعذر تحديث الحالة' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const deleted = deleteJournalist(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'السجل غير موجود' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'تم حذف السجل بنجاح' });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'تعذر حذف السجل' }, { status: 500 });
  }
}

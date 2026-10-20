import { NextResponse } from 'next/server';
import { updateUser, deleteUser } from '@/lib/usersDb';

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();
    const { username, password, displayName, role } = body;

    if (password && password.trim().length > 0 && password.trim().length < 5) {
      return NextResponse.json({
        success: false,
        error: 'كلمة المرور الجديدة يجب أن تكون 5 أحرف أو أرقام على الأقل'
      }, { status: 400 });
    }

    const updated = await updateUser(id, {
      username,
      password,
      displayName,
      role
    });

    if (!updated) {
      return NextResponse.json({ success: false, error: 'المستخدم غير موجود' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم تحديث بيانات المستخدم بنجاح',
      data: {
        id: updated.id,
        username: updated.username,
        displayName: updated.displayName,
        role: updated.role
      }
    });
  } catch (err) {
    console.error('API PATCH user error:', err);
    return NextResponse.json({ success: false, error: err.message || 'تعذر التحديث' }, { status: 400 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const deleted = await deleteUser(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'المستخدم غير موجود' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'تم حذف حساب المستخدم بنجاح'
    });
  } catch (err) {
    console.error('API DELETE user error:', err);
    return NextResponse.json({ success: false, error: err.message || 'تعذر الحذف' }, { status: 400 });
  }
}

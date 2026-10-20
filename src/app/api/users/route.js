import { NextResponse } from 'next/server';
import { getAllUsers, createUser } from '@/lib/usersDb';

export async function GET() {
  try {
    const users = getAllUsers();
    // Return sanitized users
    const sanitized = users.map(u => ({
      id: u.id,
      username: u.username,
      displayName: u.displayName,
      role: u.role,
      createdAt: u.createdAt,
      lastLogin: u.lastLogin
    }));

    return NextResponse.json({ success: true, data: sanitized });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'تعذر جلب قائمة المستخدمين' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password, displayName, role } = body;

    if (!username || !password) {
      return NextResponse.json({
        success: false,
        error: 'يرجى تزويد اسم المستخدم ورمز المرور'
      }, { status: 400 });
    }

    if (password.length < 5) {
      return NextResponse.json({
        success: false,
        error: 'رمز المرور يجب أن يتكون من 5 أحرف أو أرقام على الأقل'
      }, { status: 400 });
    }

    const newUser = createUser({
      username,
      password,
      displayName: displayName || username,
      role: role || 'ASSISTANT'
    });

    return NextResponse.json({
      success: true,
      message: 'تم إضافة المستخدم / المشرف المساعد بنجاح',
      data: {
        id: newUser.id,
        username: newUser.username,
        displayName: newUser.displayName,
        role: newUser.role,
        createdAt: newUser.createdAt
      }
    }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || 'فشل إضافة المستخدم' }, { status: 400 });
  }
}

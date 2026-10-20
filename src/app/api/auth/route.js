import { NextResponse } from 'next/server';
import { findUserByCredentials, getUserById } from '@/lib/usersDb';

export const dynamic = 'force-dynamic';

const COOKIE_NAME = 'lff_admin_session';

export async function GET(request) {
  const session = request.cookies.get(COOKIE_NAME);
  if (!session || !session.value) {
    return NextResponse.json({ authenticated: false });
  }

  try {
    const rawData = Buffer.from(session.value, 'base64').toString('utf-8');
    const parsed = JSON.parse(rawData);
    const user = await getUserById(parsed.userId);

    if (!user) {
      return NextResponse.json({ authenticated: false });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name || user.username,
        role: user.role
      }
    });
  } catch (err) {
    return NextResponse.json({ authenticated: false });
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'يرجى إدخال اسم المستخدم ورمز المرور' },
        { status: 400 }
      );
    }

    const user = await findUserByCredentials(username, password);

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'اسم المستخدم أو رمز المرور غير صحيح' },
        { status: 401 }
      );
    }

    // Prepare session token payload
    const sessionData = {
      userId: user.id,
      username: user.username,
      role: user.role,
      loginAt: Date.now()
    };
    const sessionToken = Buffer.from(JSON.stringify(sessionData)).toString('base64');

    const response = NextResponse.json({
      success: true,
      message: 'تم تسجيل دخول مدير المنظومة بنجاح',
      user: {
        id: user.id,
        username: user.username,
        displayName: user.display_name || user.username,
        role: user.role
      }
    });

    response.cookies.set(COOKIE_NAME, sessionToken, {
      httpOnly: false,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    });

    return response;
  } catch (err) {
    console.error('Auth error:', err);
    return NextResponse.json(
      { success: false, error: 'حدث خطأ أثناء معالجة تسجيل الدخول' },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({
    success: true,
    message: 'تم تسجيل الخروج بنجاح'
  });

  response.cookies.set(COOKIE_NAME, '', {
    path: '/',
    maxAge: 0
  });

  return response;
}

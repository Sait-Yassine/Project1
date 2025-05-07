import { NextResponse } from 'next/server';
import { getToken } from '@/lib/auth';

export async function GET() {
  try {
    const token = getToken();
    if (!token) {
      return NextResponse.json({ isAdmin: false });
    }

    const response = await fetch('http://localhost:9090/api/auth/verify-admin', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      return NextResponse.json({ isAdmin: false });
    }

    const data = await response.json();
    return NextResponse.json({ isAdmin: data.isAdmin });
  } catch (error) {
    console.error('Error checking admin status:', error);
    return NextResponse.json({ isAdmin: false });
  }
} 
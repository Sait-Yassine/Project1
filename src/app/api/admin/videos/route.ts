import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// GET /api/admin/videos
export async function GET() {
  try {
    const response = await fetch('http://localhost:9090/api/videos');
    
    if (!response.ok) {
      throw new Error('Failed to fetch videos');
    }
    
    const data = await response.json();
    
    // Ensure we're returning an array
    if (!Array.isArray(data)) {
      console.error('Backend returned non-array data:', data);
      return NextResponse.json([], { status: 200 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching videos:', error);
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json({ error: 'Failed to fetch videos' }, { status: 500 });
  }
}

// POST /api/admin/videos
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    const response = await fetch('http://localhost:9090/api/videos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(body)
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to create video');
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error creating video:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create video' },
      { status: 500 }
    );
  }
} 
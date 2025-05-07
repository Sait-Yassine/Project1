import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

// GET /api/admin/courses
export async function GET() {
  try {
    const response = await fetch('http://localhost:9090/api/courses');
    
    if (!response.ok) {
      throw new Error('Failed to fetch courses');
    }
    
    const data = await response.json();
    
    // Ensure we're returning an array
    if (!Array.isArray(data)) {
      console.error('Backend returned non-array data:', data);
      return NextResponse.json([], { status: 200 });
    }
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching courses:', error);
    // Return empty array instead of error to prevent frontend crashes
    return NextResponse.json({ error: 'Failed to fetch courses' }, { status: 500 });
  }
}

// POST /api/admin/courses
export async function POST(request: Request) {
  try {
    const body = await request.json();
    console.log('Received request body:', body); // Log the request body

    const headersList = await headers();
    const authHeader = headersList.get('authorization');
    console.log('Auth header:', authHeader ? 'Present' : 'Missing'); // Log auth header status
    
    if (!authHeader) {
      return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return NextResponse.json({ error: 'Invalid token format' }, { status: 401 });
    }

    console.log('Creating course with payload:', body); // Debug log

    try {
      const response = await fetch('http://localhost:9090/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });
      
      const data = await response.json();
      console.log('Backend response:', { status: response.status, data }); // Log full response
      
      if (!response.ok) {
        console.error('Backend error:', data); // Debug log
        return NextResponse.json(
          { error: data.error || 'Failed to create course' },
          { status: response.status }
        );
      }
      
      return NextResponse.json(data);
    } catch (fetchError) {
      console.error('Error calling backend:', fetchError);
      return NextResponse.json(
        { error: 'Failed to connect to backend service' },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Error creating course:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create course' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';

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
    return NextResponse.json([], { status: 200 }); // Return empty array instead of error
  }
} 
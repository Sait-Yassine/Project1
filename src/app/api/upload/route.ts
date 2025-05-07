import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

// Function to sanitize filename
function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric chars with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
    .substring(0, 50); // Limit length
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title = formData.get('title') as string;
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: 'Title is required' },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Create filename using sanitized title
    const sanitizedTitle = sanitizeFilename(title);
    const uniqueId = uuidv4().slice(0, 8); // Use first 8 chars of UUID for uniqueness
    const extension = file.name.split('.').pop();
    const filename = `${sanitizedTitle}-${uniqueId}.${extension}`;

    // Determine upload directory based on file type
    const isVideo = file.type.startsWith('video/');
    const uploadDir = isVideo ? 'public/videos' : 'public/thumbnails';
    const path = join(process.cwd(), uploadDir, filename);

    // Save the file
    await writeFile(path, buffer);

    // Return the public URL
    const publicUrl = `/${uploadDir.replace('public/', '')}/${filename}`;
    return NextResponse.json({ url: publicUrl });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Error uploading file' },
      { status: 500 }
    );
  }
} 
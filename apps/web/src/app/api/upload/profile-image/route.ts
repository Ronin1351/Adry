import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { generateProfileImageUploadUrl, validateFile } from '@/lib/storage/signed-urls';
import { z } from 'zod';

// Maximum file size: 5MB for profile images
const MAX_FILE_SIZE = 5 * 1024 * 1024;

const uploadSchema = z.object({
  fileName: z.string().min(1, 'File name is required'),
  fileSize: z.number().int().min(1, 'File size must be greater than 0').max(MAX_FILE_SIZE, 'File size must not exceed 5MB'),
  contentType: z.string().min(1, 'Content type is required'),
});

// POST /api/upload/profile-image - Generate signed URL for profile image upload
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if (session.user.role !== 'EMPLOYEE') {
      return NextResponse.json({ error: 'Only employees can upload profile images' }, { status: 403 });
    }

    const body = await request.json();
    const { fileName, fileSize, contentType } = uploadSchema.parse(body);

    // Create a mock file object for validation
    const mockFile = {
      name: fileName,
      size: fileSize,
      type: contentType,
    } as File;

    // Validate file
    const validation = validateFile(mockFile, 'image');
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Generate signed URL
    const uploadData = await generateProfileImageUploadUrl(
      session.user.id,
      fileName,
      contentType
    );

    return NextResponse.json({
      signedUrl: uploadData.signedUrl,
      publicUrl: uploadData.publicUrl,
      key: uploadData.key,
      expiresAt: uploadData.expiresAt,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation error', details: error.errors },
        { status: 400 }
      );
    }

    console.error('Error generating profile image upload URL:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

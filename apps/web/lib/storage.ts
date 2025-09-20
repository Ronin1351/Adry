import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const s3Client = new S3Client({
  region: process.env.R2_REGION!,
  endpoint: process.env.R2_ENDPOINT!,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME!;
const PUBLIC_URL = process.env.R2_PUBLIC_URL!;

// File upload to R2
export async function uploadFile(
  file: Buffer | Uint8Array | string,
  key: string,
  contentType: string
) {
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
  });

  await s3Client.send(command);
  return `${PUBLIC_URL}/${key}`;
}

// Generate signed URL for private files
export async function getSignedFileUrl(key: string, expiresIn: number = 3600) {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

// Delete file from R2
export async function deleteFile(key: string) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

// Generate file key for organized storage
export function generateFileKey(type: 'profile' | 'document', userId: string, filename: string) {
  const timestamp = Date.now();
  const extension = filename.split('.').pop();
  return `${type}s/${userId}/${timestamp}-${filename}`;
}

// Validate file type and size
export function validateFile(file: File, maxSize: number = 5 * 1024 * 1024) {
  const allowedTypes = [
    'image/jpeg',
    'image/png',
    'image/webp',
    'application/pdf',
    'image/jpg',
  ];

  if (!allowedTypes.includes(file.type)) {
    throw new Error('Invalid file type. Only JPEG, PNG, WebP, and PDF files are allowed.');
  }

  if (file.size > maxSize) {
    throw new Error(`File size must be less than ${maxSize / 1024 / 1024}MB.`);
  }

  return true;
}

// Image optimization settings
export const imageOptimization = {
  profile: {
    width: 400,
    height: 400,
    quality: 80,
    format: 'webp' as const,
  },
  document: {
    width: 1200,
    height: 1600,
    quality: 90,
    format: 'jpeg' as const,
  },
};

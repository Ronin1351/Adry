import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { v4 as uuidv4 } from 'uuid';

// Initialize S3 client for Cloudflare R2
const s3Client = new S3Client({
  region: 'auto', // Cloudflare R2 uses 'auto'
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID as string,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY as string,
  },
});

const BUCKET_NAME = process.env.R2_BUCKET_NAME as string;
const PUBLIC_URL = process.env.R2_PUBLIC_URL as string;

// File type validation
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

export interface UploadOptions {
  folder: 'profiles' | 'documents' | 'temp';
  userId: string;
  fileType: 'image' | 'document';
  fileName?: string;
  expiresIn?: number; // seconds
}

export interface SignedUrlResponse {
  signedUrl: string;
  publicUrl: string;
  key: string;
  expiresAt: Date;
}

export interface FileValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validate file before upload
 */
export function validateFile(file: File, type: 'image' | 'document'): FileValidationResult {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size must be less than ${formatFileSize(MAX_FILE_SIZE)}`,
    };
  }

  // Check file type
  const allowedTypes = type === 'image' ? ALLOWED_IMAGE_TYPES : ALLOWED_DOCUMENT_TYPES;
  if (!allowedTypes.includes(file.type)) {
    return {
      isValid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(', ')}`,
    };
  }

  return { isValid: true };
}

/**
 * Generate a unique file key
 */
export function generateFileKey(options: UploadOptions, originalFileName: string): string {
  const timestamp = Date.now();
  const uuid = uuidv4();
  const extension = originalFileName.split('.').pop() || '';
  const sanitizedFileName = originalFileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  
  return `${options.folder}/${options.userId}/${timestamp}-${uuid}-${sanitizedFileName}`;
}

/**
 * Generate signed URL for file upload
 */
export async function generateUploadSignedUrl(
  options: UploadOptions,
  originalFileName: string,
  contentType: string
): Promise<SignedUrlResponse> {
  const key = generateFileKey(options, originalFileName);
  const expiresIn = options.expiresIn || 3600; // 1 hour default

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: contentType,
    ACL: 'public-read', // For direct access
    Metadata: {
      userId: options.userId,
      folder: options.folder,
      uploadedAt: new Date().toISOString(),
    },
  });

  const signedUrl = await getSignedUrl(s3Client, command, { expiresIn });
  const publicUrl = `${PUBLIC_URL}/${key}`;
  const expiresAt = new Date(Date.now() + expiresIn * 1000);

  return {
    signedUrl,
    publicUrl,
    key,
    expiresAt,
  };
}

/**
 * Generate signed URL for file download/view
 */
export async function generateDownloadSignedUrl(
  key: string,
  expiresIn: number = 3600
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

/**
 * Delete file from storage
 */
export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Upload file directly to S3 (server-side)
 */
export async function uploadFileDirect(
  file: Buffer,
  options: UploadOptions,
  originalFileName: string,
  contentType: string
): Promise<SignedUrlResponse> {
  const key = generateFileKey(options, originalFileName);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file,
    ContentType: contentType,
    ACL: 'public-read',
    Metadata: {
      userId: options.userId,
      folder: options.folder,
      uploadedAt: new Date().toISOString(),
    },
  });

  await s3Client.send(command);
  const publicUrl = `${PUBLIC_URL}/${key}`;

  return {
    signedUrl: publicUrl, // For direct uploads, return public URL
    publicUrl,
    key,
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
  };
}

/**
 * Get file metadata
 */
export async function getFileMetadata(key: string) {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    const response = await s3Client.send(command);
    return {
      contentType: response.ContentType,
      contentLength: response.ContentLength,
      lastModified: response.LastModified,
      metadata: response.Metadata,
    };
  } catch (error) {
    console.error('Error getting file metadata:', error);
    return null;
  }
}

/**
 * Check if file exists
 */
export async function fileExists(key: string): Promise<boolean> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
    });

    await s3Client.send(command);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Get file extension from filename
 */
export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() || '';
}

/**
 * Generate thumbnail key for images
 */
export function generateThumbnailKey(originalKey: string): string {
  const parts = originalKey.split('/');
  const filename = parts[parts.length - 1];
  const nameWithoutExt = filename.split('.')[0];
  const extension = getFileExtension(filename);
  
  parts[parts.length - 1] = `${nameWithoutExt}_thumb.${extension}`;
  return parts.join('/');
}

/**
 * Clean up old temporary files
 */
export async function cleanupTempFiles(userId: string, olderThanHours: number = 24): Promise<void> {
  // This would require listing objects with a prefix
  // For now, we'll implement a simple cleanup based on timestamp in filename
  const cutoffTime = Date.now() - (olderThanHours * 60 * 60 * 1000);
  
  // In a real implementation, you'd use ListObjectsV2Command to find files
  // and delete them based on the timestamp in the filename
  console.log(`Cleanup temp files for user ${userId} older than ${olderThanHours} hours`);
}

/**
 * Generate presigned URL for profile image upload
 */
export async function generateProfileImageUploadUrl(
  userId: string,
  fileName: string,
  contentType: string
): Promise<SignedUrlResponse> {
  return generateUploadSignedUrl(
    {
      folder: 'profiles',
      userId,
      fileType: 'image',
    },
    fileName,
    contentType
  );
}

/**
 * Generate presigned URL for document upload
 */
export async function generateDocumentUploadUrl(
  userId: string,
  fileName: string,
  contentType: string,
  documentType: string
): Promise<SignedUrlResponse> {
  return generateUploadSignedUrl(
    {
      folder: 'documents',
      userId,
      fileType: 'document',
    },
    fileName,
    contentType
  );
}

/**
 * Generate presigned URL for temporary file upload
 */
export async function generateTempUploadUrl(
  userId: string,
  fileName: string,
  contentType: string
): Promise<SignedUrlResponse> {
  return generateUploadSignedUrl(
    {
      folder: 'temp',
      userId,
      fileType: 'image',
      expiresIn: 3600, // 1 hour for temp files
    },
    fileName,
    contentType
  );
}

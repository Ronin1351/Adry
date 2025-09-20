'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Upload, 
  CheckCircle, 
  XCircle, 
  Clock, 
  FileText, 
  AlertCircle,
  Download,
  Eye,
  Trash2
} from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

interface Document {
  id: string;
  type: string;
  fileName: string;
  fileSize: number;
  fileUrl: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  uploadedAt: Date;
  verifiedAt?: Date;
  verifiedBy?: string;
  rejectionReason?: string;
  expiresAt?: Date;
}

interface DocumentUploadProps {
  documentType: string;
  required: boolean;
  onUpload: (file: File) => Promise<void>;
  onDelete: (documentId: string) => void;
  document?: Document;
  isUploading?: boolean;
  uploadProgress?: number;
}

const DOCUMENT_TYPES = {
  'PhilSys ID': {
    description: 'Philippine National ID (PhilSys)',
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 5 * 1024 * 1024, // 5MB
    format: '13-digit number',
  },
  'PhilHealth ID': {
    description: 'PhilHealth Identification Card',
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 5 * 1024 * 1024,
    format: 'XX-XXXXXXXXX-X',
  },
  'Pag-IBIG ID': {
    description: 'Pag-IBIG Fund ID',
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 5 * 1024 * 1024,
    format: 'XXXX-XXXX-XXXX',
  },
  'NBI Clearance': {
    description: 'National Bureau of Investigation Clearance',
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 5 * 1024 * 1024,
    format: 'NBI Clearance Certificate',
  },
  'Police Clearance': {
    description: 'Police Clearance Certificate',
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 5 * 1024 * 1024,
    format: 'Police Clearance Certificate',
  },
  'Passport': {
    description: 'Philippine Passport (if available)',
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 5 * 1024 * 1024,
    format: 'Passport Number',
  },
};

export function DocumentUpload({
  documentType,
  required,
  onUpload,
  onDelete,
  document,
  isUploading = false,
  uploadProgress = 0,
}: DocumentUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const config = DOCUMENT_TYPES[documentType as keyof typeof DOCUMENT_TYPES] || {
    description: documentType,
    acceptedTypes: ['image/jpeg', 'image/png', 'application/pdf'],
    maxSize: 5 * 1024 * 1024,
    format: 'Document',
  };

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      setError(null);
      
      if (rejectedFiles.length > 0) {
        const rejection = rejectedFiles[0];
        if (rejection.errors[0]?.code === 'file-too-large') {
          setError(`File size must be less than ${formatFileSize(config.maxSize)}`);
        } else if (rejection.errors[0]?.code === 'file-invalid-type') {
          setError('Invalid file type. Please upload JPEG, PNG, or PDF files.');
        } else {
          setError('File upload failed. Please try again.');
        }
        return;
      }

      if (acceptedFiles.length > 0) {
        onUpload(acceptedFiles[0]);
      }
    },
    [onUpload, config.maxSize]
  );

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'application/pdf': ['.pdf'],
    },
    maxSize: config.maxSize,
    multiple: false,
    disabled: isUploading || !!document,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'UNDER_REVIEW':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'PENDING':
        return <Clock className="h-5 w-5 text-yellow-600" />;
      case 'EXPIRED':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return <FileText className="h-5 w-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'UNDER_REVIEW':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'EXPIRED':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return 'Verified';
      case 'REJECTED':
        return 'Rejected';
      case 'UNDER_REVIEW':
        return 'Under Review';
      case 'PENDING':
        return 'Pending Review';
      case 'EXPIRED':
        return 'Expired';
      default:
        return 'Not Uploaded';
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-PH', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const isExpired = document?.expiresAt && new Date(document.expiresAt) < new Date();

  return (
    <Card className={`transition-all duration-200 ${dragActive ? 'ring-2 ring-blue-500' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{documentType}</CardTitle>
          <div className="flex items-center gap-2">
            {required && (
              <Badge variant="destructive" className="text-xs">
                Required
              </Badge>
            )}
            {document && (
              <Badge variant="outline" className="text-xs">
                {getStatusText(document.status)}
              </Badge>
            )}
          </div>
        </div>
        <p className="text-sm text-gray-600">{config.description}</p>
        <p className="text-xs text-gray-500">Format: {config.format}</p>
      </CardHeader>

      <CardContent className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {document ? (
          // Document uploaded state
          <div className={`p-4 rounded-lg border ${getStatusColor(document.status)}`}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-3">
                {getStatusIcon(document.status)}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{document.fileName}</h4>
                    <span className="text-sm text-gray-500">
                      ({formatFileSize(document.fileSize)})
                    </span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Uploaded: {formatDate(document.uploadedAt)}
                  </p>
                  {document.verifiedAt && (
                    <p className="text-sm text-gray-600">
                      Verified: {formatDate(document.verifiedAt)}
                      {document.verifiedBy && ` by ${document.verifiedBy}`}
                    </p>
                  )}
                  {document.rejectionReason && (
                    <p className="text-sm text-red-600 mt-1">
                      Reason: {document.rejectionReason}
                    </p>
                  )}
                  {isExpired && (
                    <p className="text-sm text-orange-600 mt-1">
                      Expired: {formatDate(document.expiresAt!)}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(document.fileUrl, '_blank')}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => window.open(document.fileUrl, '_blank')}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(document.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ) : (
          // Upload area
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
              ${isDragReject 
                ? 'border-red-300 bg-red-50' 
                : dragActive 
                  ? 'border-blue-300 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }
              ${isUploading ? 'pointer-events-none opacity-50' : ''}
            `}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="space-y-3">
                <Upload className="h-8 w-8 mx-auto text-blue-600" />
                <div className="space-y-2">
                  <p className="text-sm font-medium">Uploading...</p>
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-xs text-gray-500">{uploadProgress}% complete</p>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <Upload className="h-8 w-8 mx-auto text-gray-400" />
                <div>
                  <p className="text-sm font-medium">
                    {dragActive ? 'Drop file here' : 'Click to upload or drag and drop'}
                  </p>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG, or PDF (max {formatFileSize(config.maxSize)})
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Upload requirements */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Accepted formats: JPEG, PNG, PDF</p>
          <p>• Maximum file size: {formatFileSize(config.maxSize)}</p>
          <p>• Clear, readable images preferred</p>
          {required && <p>• This document is required for verification</p>}
        </div>
      </CardContent>
    </Card>
  );
}

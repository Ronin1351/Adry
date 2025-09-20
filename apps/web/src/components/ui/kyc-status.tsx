'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  CheckCircle, 
  Clock, 
  XCircle, 
  AlertCircle,
  FileText,
  Upload,
  Eye,
  Download
} from 'lucide-react';

interface Document {
  id: string;
  type: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'REJECTED' | 'EXPIRED';
  fileName: string;
  uploadedAt: Date;
  verifiedAt?: Date;
  rejectionReason?: string;
  expiresAt?: Date;
}

interface KYCStatusProps {
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'VERIFIED' | 'REJECTED';
  documents: Document[];
  onUploadDocument: (type: string) => void;
  onViewDocument: (documentId: string) => void;
  onReuploadDocument: (documentId: string) => void;
}

const REQUIRED_DOCUMENTS = [
  {
    type: 'PhilSys ID',
    description: 'Philippine National ID (PhilSys)',
    required: true,
    format: '13-digit number',
  },
  {
    type: 'PhilHealth ID',
    description: 'PhilHealth Identification Card',
    required: true,
    format: 'XX-XXXXXXXXX-X',
  },
  {
    type: 'Pag-IBIG ID',
    description: 'Pag-IBIG Fund ID',
    required: true,
    format: 'XXXX-XXXX-XXXX',
  },
  {
    type: 'NBI Clearance',
    description: 'National Bureau of Investigation Clearance',
    required: true,
    format: 'NBI Clearance Certificate',
  },
  {
    type: 'Police Clearance',
    description: 'Police Clearance Certificate',
    required: true,
    format: 'Police Clearance Certificate',
  },
  {
    type: 'Passport',
    description: 'Philippine Passport (if available)',
    required: false,
    format: 'Passport Number',
  },
];

export function KYCStatus({
  status,
  documents,
  onUploadDocument,
  onViewDocument,
  onReuploadDocument,
}: KYCStatusProps) {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return {
          icon: CheckCircle,
          color: 'text-green-600',
          bgColor: 'bg-green-50',
          borderColor: 'border-green-200',
          label: 'Verified',
          description: 'All documents verified and approved',
        };
      case 'IN_PROGRESS':
        return {
          icon: Clock,
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200',
          label: 'In Progress',
          description: 'Documents under review',
        };
      case 'REJECTED':
        return {
          icon: XCircle,
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200',
          label: 'Rejected',
          description: 'Some documents were rejected',
        };
      default:
        return {
          icon: AlertCircle,
          color: 'text-gray-600',
          bgColor: 'bg-gray-50',
          borderColor: 'border-gray-200',
          label: 'Not Started',
          description: 'Upload your documents to get verified',
        };
    }
  };

  const getDocumentStatus = (docType: string) => {
    const doc = documents.find(d => d.type === docType);
    if (!doc) return 'NOT_UPLOADED';
    return doc.status;
  };

  const getDocumentIcon = (docStatus: string) => {
    switch (docStatus) {
      case 'VERIFIED':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'REJECTED':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'UNDER_REVIEW':
      case 'PENDING':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  const getDocumentStatusColor = (docStatus: string) => {
    switch (docStatus) {
      case 'VERIFIED':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'REJECTED':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'UNDER_REVIEW':
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getDocumentStatusText = (docStatus: string) => {
    switch (docStatus) {
      case 'VERIFIED':
        return 'Verified';
      case 'REJECTED':
        return 'Rejected';
      case 'UNDER_REVIEW':
        return 'Under Review';
      case 'PENDING':
        return 'Pending';
      default:
        return 'Not Uploaded';
    }
  };

  const calculateProgress = () => {
    const verifiedDocs = documents.filter(doc => doc.status === 'VERIFIED').length;
    const requiredDocs = REQUIRED_DOCUMENTS.filter(doc => doc.required).length;
    return Math.round((verifiedDocs / requiredDocs) * 100);
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;
  const progress = calculateProgress();

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Icon className={`h-5 w-5 ${config.color}`} />
            <span className={config.color}>KYC Status: {config.label}</span>
          </CardTitle>
          <Badge 
            variant={status === 'VERIFIED' ? 'default' : 'secondary'}
            className={config.color}
          >
            {progress}%
          </Badge>
        </div>
        <p className="text-sm text-gray-600">{config.description}</p>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {REQUIRED_DOCUMENTS.map((doc) => {
            const docStatus = getDocumentStatus(doc.type);
            const isUploaded = docStatus !== 'NOT_UPLOADED';
            const isVerified = docStatus === 'VERIFIED';
            const isRejected = docStatus === 'REJECTED';
            const document = documents.find(d => d.type === doc.type);

            return (
              <div
                key={doc.type}
                className={`
                  p-4 rounded-lg border-2 transition-all duration-200
                  ${isVerified 
                    ? 'bg-green-50 border-green-200' 
                    : isRejected 
                      ? 'bg-red-50 border-red-200' 
                      : isUploaded 
                        ? 'bg-yellow-50 border-yellow-200' 
                        : 'bg-gray-50 border-gray-200'
                  }
                `}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    {getDocumentIcon(docStatus)}
                    <h3 className="font-medium">{doc.type}</h3>
                    {doc.required && (
                      <Badge variant="destructive" className="text-xs">
                        Required
                      </Badge>
                    )}
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getDocumentStatusColor(docStatus)}`}
                  >
                    {getDocumentStatusText(docStatus)}
                  </Badge>
                </div>

                <p className="text-sm text-gray-600 mb-3">{doc.description}</p>
                <p className="text-xs text-gray-500 mb-3">Format: {doc.format}</p>

                {isUploaded && document && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-600">{document.fileName}</span>
                      <span className="text-gray-500">
                        {new Date(document.uploadedAt).toLocaleDateString()}
                      </span>
                    </div>
                    
                    {isRejected && document.rejectionReason && (
                      <Alert variant="destructive" className="py-2">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription className="text-xs">
                          {document.rejectionReason}
                        </AlertDescription>
                      </Alert>
                    )}

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onViewDocument(document.id)}
                      >
                        <Eye className="h-3 w-3 mr-1" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onReuploadDocument(document.id)}
                      >
                        <Upload className="h-3 w-3 mr-1" />
                        Re-upload
                      </Button>
                    </div>
                  </div>
                )}

                {!isUploaded && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onUploadDocument(doc.type)}
                    className="w-full"
                  >
                    <Upload className="h-3 w-3 mr-1" />
                    Upload Document
                  </Button>
                )}
              </div>
            );
          })}
        </div>

        {status === 'REJECTED' && (
          <Alert variant="destructive">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              Some documents were rejected. Please review the reasons above and re-upload the corrected documents.
            </AlertDescription>
          </Alert>
        )}

        {status === 'IN_PROGRESS' && (
          <Alert>
            <Clock className="h-4 w-4" />
            <AlertDescription>
              Your documents are under review. This process typically takes 1-3 business days.
            </AlertDescription>
          </Alert>
        )}

        {status === 'VERIFIED' && (
          <Alert className="bg-green-50 border-green-200">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Congratulations! All your documents have been verified. Your profile is now fully verified.
            </AlertDescription>
          </Alert>
        )}

        {status === 'NOT_STARTED' && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Upload your identification documents to get verified. Verified profiles are 3x more likely to be hired.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}

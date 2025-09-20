import { apiClient } from '../client';
import { Document, AdryApiResponse } from '../../types/adry';

export const adryDocumentAPI = {
  // Upload Document
  uploadDocument: (employeeId: string, file: File, type: string) => {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('type', type);
    return apiClient.upload<AdryApiResponse<Document>>(
      `/documents/employee/${employeeId}`,
      formData
    );
  },

  // Get Employee Documents
  getEmployeeDocuments: (employeeId: string) =>
    apiClient.get<AdryApiResponse<Document[]>>(`/documents/employee/${employeeId}`),

  // Update Document
  updateDocument: (documentId: string, data: Partial<Document>) =>
    apiClient.put<AdryApiResponse<Document>>(`/documents/${documentId}`, data),

  // Delete Document
  deleteDocument: (documentId: string) =>
    apiClient.delete<AdryApiResponse<null>>(`/documents/${documentId}`),

  // Admin: Verify Document
  verifyDocument: (documentId: string, status: 'VERIFIED' | 'REJECTED', reason?: string) =>
    apiClient.patch<AdryApiResponse<Document>>(
      `/documents/${documentId}/verify`,
      { status, reason }
    ),

  // Admin: Get Pending Documents
  getPendingDocuments: (params: { page?: number; limit?: number }) =>
    apiClient.get<AdryApiResponse<{ data: Document[]; pagination: any }>>(
      '/documents/pending',
      { params }
    ),

  // Get Document Types
  getDocumentTypes: () =>
    apiClient.get<AdryApiResponse<{ type: string; label: string; required: boolean }[]>>(
      '/documents/types'
    ),
};

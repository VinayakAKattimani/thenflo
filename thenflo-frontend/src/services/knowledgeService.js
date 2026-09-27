import { request, mockDelay } from './apiClient.js';
import { USE_MOCK } from './config.js';
import { mockKnowledgeDocuments } from './mock/mockData.js';

let documents = [...mockKnowledgeDocuments];

export async function listDocuments() {
  if (USE_MOCK.knowledge) {
    await mockDelay(400);
    return [...documents].sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt));
  }
  // Real path — Gateway exposes Knowledge under /knowledge/... per the
  // architecture brief; exact list path/response to be confirmed.
  return request('/knowledge/documents');
}

export async function uploadDocument(file) {
  if (USE_MOCK.knowledge) {
    const doc = {
      id: 'doc_' + Date.now(),
      name: file.name,
      type: file.name.split('.').pop(),
      sizeBytes: file.size,
      status: 'processing',
      chunkCount: null,
      uploadedAt: new Date().toISOString()
    };
    documents = [doc, ...documents];
    await mockDelay(1200);
    doc.status = 'processed';
    doc.chunkCount = Math.round(file.size / 3000) + 4;
    return doc;
  }
  const formData = new FormData();
  formData.append('file', file);
  return request('/knowledge/documents', { method: 'POST', body: formData, isFormData: true });
}

export async function deleteDocument(documentId) {
  if (USE_MOCK.knowledge) {
    await mockDelay(300);
    documents = documents.filter((d) => d.id !== documentId);
    return { success: true };
  }
  return request(`/knowledge/documents/${documentId}`, { method: 'DELETE' });
}

export async function searchKnowledge(query) {
  if (USE_MOCK.knowledge) {
    await mockDelay(500);
    return documents
      .filter((d) => d.status === 'processed')
      .slice(0, 3)
      .map((d, i) => ({
        documentId: d.id,
        documentName: d.name,
        snippet: `Relevant passage ${i + 1} matching "${query}" would appear here once RAG search is connected.`,
        score: 0.91 - i * 0.08
      }));
  }
  return request('/knowledge/search', { method: 'POST', body: { query } });
}

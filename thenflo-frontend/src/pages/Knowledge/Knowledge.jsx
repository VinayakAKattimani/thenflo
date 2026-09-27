import React, { useEffect, useRef, useState } from 'react';
import PageHeader from '../../components/common/PageHeader.jsx';
import EmptyState from '../../components/common/EmptyState.jsx';
import StatusBadge from '../../components/common/StatusBadge.jsx';
import * as knowledgeService from '../../services/knowledgeService.js';
import { KnowledgeIcon, UploadIcon, TrashIcon } from '../../components/common/Icons.jsx';
import './Knowledge.css';

function formatSize(bytes) {
  if (bytes < 1_000_000) return `${Math.round(bytes / 1000)} KB`;
  return `${(bytes / 1_000_000).toFixed(1)} MB`;
}

export default function Knowledge() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(null);
  const [searching, setSearching] = useState(false);
  const fileInputRef = useRef(null);

  const refresh = () => knowledgeService.listDocuments().then(setDocuments);

  useEffect(() => {
    refresh().finally(() => setLoading(false));
  }, []);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (!file) return;
    await refresh();
    await knowledgeService.uploadDocument(file);
    await refresh();
  };

  const handleDelete = async (id) => {
    await knowledgeService.deleteDocument(id);
    await refresh();
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setSearching(true);
    const hits = await knowledgeService.searchKnowledge(query.trim());
    setResults(hits);
    setSearching(false);
  };

  return (
    <div className="knowledge-page">
      <PageHeader
        title="Knowledge"
        subtitle="Give ThenFLo information to work with."
        actions={
          <>
            <input ref={fileInputRef} type="file" hidden onChange={handleUpload} />
            <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
              <UploadIcon /> Upload document
            </button>
          </>
        }
      />

      <form className="knowledge-search" onSubmit={handleSearch}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search across your knowledge base…"
        />
        <button type="submit" className="btn" disabled={searching || !query.trim()}>
          {searching ? 'Searching…' : 'Search'}
        </button>
      </form>

      {results && (
        <div className="knowledge-results">
          {results.map((r, i) => (
            <div key={i} className="knowledge-result-item">
              <span className="knowledge-result-source">{r.documentName}</span>
              <p>{r.snippet}</p>
            </div>
          ))}
        </div>
      )}

      {loading ? (
        <p className="knowledge-loading">Loading documents…</p>
      ) : documents.length === 0 ? (
        <EmptyState
          icon={KnowledgeIcon}
          title="No documents yet"
          description="Upload PDFs, docs, or spreadsheets so ThenFLo can reference them in conversations."
          action={
            <button className="btn btn-primary" onClick={() => fileInputRef.current?.click()}>
              <UploadIcon /> Upload your first document
            </button>
          }
        />
      ) : (
        <table className="knowledge-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Status</th>
              <th>Chunks</th>
              <th>Size</th>
              <th aria-label="Actions" />
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id}>
                <td>{doc.name}</td>
                <td>
                  <StatusBadge
                    label={doc.status === 'processed' ? 'Processed' : 'Processing'}
                    tone={doc.status === 'processed' ? 'success' : 'active'}
                  />
                </td>
                <td>{doc.chunkCount ?? '—'}</td>
                <td>{formatSize(doc.sizeBytes)}</td>
                <td>
                  <button className="knowledge-delete" onClick={() => handleDelete(doc.id)} aria-label={`Delete ${doc.name}`}>
                    <TrashIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback } from 'react';
import type { Submission } from '../types';
import { getSubmissions, deleteSubmission } from '../utils/storage';
import SubmissionTable from './SubmissionTable';
import EditModal from './EditModal';

function formatDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) {
      return isoString;
    }
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return isoString;
  }
}

const AdminDashboard: React.FC = () => {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [editingSubmission, setEditingSubmission] = useState<Submission | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>('');

  const loadSubmissions = useCallback((): void => {
    const data = getSubmissions();
    setSubmissions(data);
  }, []);

  useEffect(() => {
    loadSubmissions();
  }, [loadSubmissions]);

  const totalSubmissions = submissions.length;

  const uniqueDepartments = new Set(submissions.map((s) => s.department)).size;

  const latestSubmission = submissions.length > 0
    ? submissions.reduce((latest, current) => {
        return new Date(current.submittedOn) > new Date(latest.submittedOn)
          ? current
          : latest;
      })
    : null;

  const latestDate = latestSubmission
    ? formatDate(latestSubmission.submittedOn)
    : 'N/A';

  const filteredSubmissions = submissions.filter((s) => {
    const term = searchTerm.toLowerCase();
    return (
      s.fullName.toLowerCase().includes(term) ||
      s.email.toLowerCase().includes(term) ||
      s.mobile.toLowerCase().includes(term) ||
      s.department.toLowerCase().includes(term)
    );
  });

  const handleEdit = (submission: Submission): void => {
    setEditingSubmission(submission);
  };

  const handleEditSave = (): void => {
    setEditingSubmission(null);
    loadSubmissions();
  };

  const handleEditClose = (): void => {
    setEditingSubmission(null);
  };

  const handleDeleteRequest = (id: string): void => {
    setDeletingId(id);
  };

  const handleDeleteConfirm = (): void => {
    if (deletingId) {
      deleteSubmission(deletingId);
      setDeletingId(null);
      loadSubmissions();
    }
  };

  const handleDeleteCancel = (): void => {
    setDeletingId(null);
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      handleDeleteCancel();
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>Admin Dashboard</h1>
        <p style={styles.subtitle}>
          Manage all onboarding interest submissions.
        </p>
      </div>

      <div style={styles.statsGrid}>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{totalSubmissions}</div>
          <div style={styles.statLabel}>Total Submissions</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{uniqueDepartments}</div>
          <div style={styles.statLabel}>Unique Departments</div>
        </div>
        <div style={styles.statCard}>
          <div style={styles.statValue}>{latestDate}</div>
          <div style={styles.statLabel}>Latest Submission</div>
        </div>
      </div>

      <div style={styles.tableContainer}>
        <div style={styles.tableHeader}>
          <h2 style={styles.tableTitle}>Submissions</h2>
          <input
            type="text"
            placeholder="Search by name, email, mobile, or department..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setSearchTerm(e.target.value)
            }
            style={styles.searchInput}
          />
        </div>
        <SubmissionTable
          submissions={filteredSubmissions}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      </div>

      {editingSubmission && (
        <EditModal
          submission={editingSubmission}
          onSave={handleEditSave}
          onClose={handleEditClose}
        />
      )}

      {deletingId && (
        <div style={styles.overlay} onClick={handleOverlayClick}>
          <div style={styles.confirmCard}>
            <h2 style={styles.confirmTitle}>Confirm Deletion</h2>
            <p style={styles.confirmText}>
              Are you sure you want to delete this submission? This action cannot
              be undone.
            </p>
            <div style={styles.confirmActions}>
              <button
                type="button"
                onClick={handleDeleteCancel}
                style={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                style={styles.deleteButton}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  page: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem',
  },
  header: {
    marginBottom: '2rem',
  },
  title: {
    fontSize: '1.875rem',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 4px 0',
  },
  subtitle: {
    fontSize: '1rem',
    color: '#6b7280',
    margin: 0,
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '1rem',
    marginBottom: '2rem',
  },
  statCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '1.5rem',
    textAlign: 'center' as const,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  statValue: {
    fontSize: '1.875rem',
    fontWeight: 700,
    color: '#2563eb',
    marginBottom: '4px',
  },
  statLabel: {
    fontSize: '0.875rem',
    color: '#6b7280',
    fontWeight: 500,
  },
  tableContainer: {
    backgroundColor: '#ffffff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    overflow: 'hidden',
  },
  tableHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1.5rem',
    borderBottom: '1px solid #e5e7eb',
    flexWrap: 'wrap' as const,
    gap: '1rem',
  },
  tableTitle: {
    fontSize: '1.25rem',
    fontWeight: 600,
    color: '#111827',
    margin: 0,
  },
  searchInput: {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '0.875rem',
    outline: 'none',
    minWidth: '220px',
    transition: 'border-color 150ms ease',
    boxSizing: 'border-box' as const,
  },
  overlay: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2000,
    padding: '1rem',
  },
  confirmCard: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    width: '100%',
    maxWidth: '420px',
  },
  confirmTitle: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111827',
    margin: '0 0 1rem 0',
  },
  confirmText: {
    fontSize: '1rem',
    color: '#4b5563',
    lineHeight: 1.6,
    margin: '0 0 1.5rem 0',
  },
  confirmActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
  },
  cancelButton: {
    padding: '8px 24px',
    fontSize: '1rem',
    fontWeight: 500,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
  },
  deleteButton: {
    padding: '8px 24px',
    fontSize: '1rem',
    fontWeight: 600,
    backgroundColor: '#dc2626',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
  },
};

export default AdminDashboard;
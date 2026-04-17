import React from 'react';
import type { Submission } from '../types';

interface SubmissionTableProps {
  submissions: Submission[];
  onEdit: (submission: Submission) => void;
  onDelete: (id: string) => void;
}

const departmentBadgeColors: Record<string, { background: string; color: string }> = {
  Engineering: { background: '#dbeafe', color: '#1e40af' },
  Design: { background: '#fce7f3', color: '#9d174d' },
  Marketing: { background: '#fef3c7', color: '#92400e' },
  Sales: { background: '#d1fae5', color: '#065f46' },
  HR: { background: '#ede9fe', color: '#5b21b6' },
  Finance: { background: '#ffedd5', color: '#9a3412' },
};

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

const SubmissionTable: React.FC<SubmissionTableProps> = ({ submissions, onEdit, onDelete }) => {
  if (submissions.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <p style={styles.emptyText}>No submissions yet.</p>
      </div>
    );
  }

  return (
    <div style={styles.tableWrapper}>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.th}>#</th>
            <th style={styles.th}>Full Name</th>
            <th style={styles.th}>Email</th>
            <th style={styles.th}>Mobile</th>
            <th style={styles.th}>Department</th>
            <th style={styles.th}>Submitted On</th>
            <th style={styles.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {submissions.map((submission, index) => {
            const badgeStyle = departmentBadgeColors[submission.department] || {
              background: '#f3f4f6',
              color: '#374151',
            };

            return (
              <tr key={submission.id} style={index % 2 === 0 ? styles.rowEven : styles.rowOdd}>
                <td style={styles.td}>{index + 1}</td>
                <td style={styles.td}>{submission.fullName}</td>
                <td style={styles.td}>{submission.email}</td>
                <td style={styles.td}>{submission.mobile}</td>
                <td style={styles.td}>
                  <span
                    style={{
                      ...styles.badge,
                      backgroundColor: badgeStyle.background,
                      color: badgeStyle.color,
                    }}
                  >
                    {submission.department}
                  </span>
                </td>
                <td style={styles.td}>{formatDate(submission.submittedOn)}</td>
                <td style={styles.td}>
                  <div style={styles.actions}>
                    <button
                      type="button"
                      style={styles.editButton}
                      onClick={() => onEdit(submission)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      style={styles.deleteButton}
                      onClick={() => onDelete(submission.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  tableWrapper: {
    overflowX: 'auto',
    width: '100%',
    WebkitOverflowScrolling: 'touch',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '800px',
    fontSize: '14px',
  },
  th: {
    textAlign: 'left',
    padding: '12px 16px',
    borderBottom: '2px solid #e5e7eb',
    backgroundColor: '#f9fafb',
    fontWeight: 600,
    color: '#374151',
    whiteSpace: 'nowrap',
  },
  td: {
    padding: '12px 16px',
    borderBottom: '1px solid #e5e7eb',
    color: '#1f2937',
    verticalAlign: 'middle',
  },
  rowEven: {
    backgroundColor: '#ffffff',
  },
  rowOdd: {
    backgroundColor: '#f9fafb',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 600,
    whiteSpace: 'nowrap',
  },
  actions: {
    display: 'flex',
    gap: '8px',
    alignItems: 'center',
  },
  editButton: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#1e40af',
    backgroundColor: '#dbeafe',
    border: '1px solid #93c5fd',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  deleteButton: {
    padding: '6px 14px',
    fontSize: '13px',
    fontWeight: 500,
    color: '#991b1b',
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '6px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },
  emptyContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '48px 16px',
  },
  emptyText: {
    fontSize: '16px',
    color: '#6b7280',
    fontStyle: 'italic',
  },
};

export default SubmissionTable;
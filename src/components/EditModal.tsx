import React, { useState } from 'react';
import type { Submission, Department, FormErrors, EditFormData } from '../types';
import { DEPARTMENTS } from '../types';
import { validateName, validateMobile, validateDepartment } from '../utils/validators';
import { updateSubmission } from '../utils/storage';

interface EditModalProps {
  submission: Submission;
  onSave: () => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ submission, onSave, onClose }) => {
  const [formData, setFormData] = useState<EditFormData>({
    fullName: submission.fullName,
    mobile: submission.mobile,
    department: submission.department,
  });

  const [errors, setErrors] = useState<Pick<FormErrors, 'fullName' | 'mobile' | 'department'>>({
    fullName: '',
    mobile: '',
    department: '',
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    let error = '';
    if (name === 'fullName') {
      error = validateName(value);
    } else if (name === 'mobile') {
      error = validateMobile(value);
    } else if (name === 'department') {
      error = validateDepartment(value);
    }
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const validateAll = (): boolean => {
    const fullNameError = validateName(formData.fullName);
    const mobileError = validateMobile(formData.mobile);
    const departmentError = validateDepartment(formData.department);

    setErrors({
      fullName: fullNameError,
      mobile: mobileError,
      department: departmentError,
    });

    return !fullNameError && !mobileError && !departmentError;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();

    if (!validateAll()) {
      return;
    }

    updateSubmission(submission.id, {
      fullName: formData.fullName.trim(),
      mobile: formData.mobile.trim(),
      department: formData.department,
    });

    onSave();
  };

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div style={styles.overlay} onClick={handleOverlayClick}>
      <div style={styles.card}>
        <h2 style={styles.title}>Edit Submission</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div style={styles.formGroup}>
            <label htmlFor="edit-fullName" style={styles.label}>
              Full Name <span style={styles.required}>*</span>
            </label>
            <input
              id="edit-fullName"
              name="fullName"
              type="text"
              value={formData.fullName}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.fullName ? styles.inputError : {}),
              }}
              placeholder="Enter full name"
            />
            {errors.fullName && (
              <p style={styles.errorText}>{errors.fullName}</p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="edit-email" style={styles.label}>
              Email
            </label>
            <input
              id="edit-email"
              name="email"
              type="email"
              value={submission.email}
              disabled
              style={{ ...styles.input, ...styles.inputDisabled }}
            />
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="edit-mobile" style={styles.label}>
              Mobile Number <span style={styles.required}>*</span>
            </label>
            <input
              id="edit-mobile"
              name="mobile"
              type="text"
              value={formData.mobile}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.mobile ? styles.inputError : {}),
              }}
              placeholder="Enter 10-digit mobile number"
            />
            {errors.mobile && (
              <p style={styles.errorText}>{errors.mobile}</p>
            )}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="edit-department" style={styles.label}>
              Department <span style={styles.required}>*</span>
            </label>
            <select
              id="edit-department"
              name="department"
              value={formData.department}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.department ? styles.inputError : {}),
              }}
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((dept: Department) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p style={styles.errorText}>{errors.department}</p>
            )}
          </div>

          <div style={styles.actions}>
            <button
              type="button"
              onClick={onClose}
              style={styles.cancelButton}
            >
              Cancel
            </button>
            <button type="submit" style={styles.saveButton}>
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: 'fixed',
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
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
    padding: '2rem',
    width: '100%',
    maxWidth: '480px',
    maxHeight: '90vh',
    overflowY: 'auto' as const,
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: 700,
    color: '#111827',
    marginBottom: '1.5rem',
    margin: '0 0 1.5rem 0',
  },
  formGroup: {
    marginBottom: '1rem',
  },
  label: {
    display: 'block',
    fontSize: '0.875rem',
    fontWeight: 600,
    color: '#374151',
    marginBottom: '4px',
  },
  required: {
    color: '#dc2626',
    marginLeft: '2px',
  },
  input: {
    width: '100%',
    padding: '8px 12px',
    fontSize: '1rem',
    color: '#1f2937',
    backgroundColor: '#ffffff',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    outline: 'none',
    transition: 'border-color 150ms ease, box-shadow 150ms ease',
    boxSizing: 'border-box' as const,
  },
  inputError: {
    borderColor: '#dc2626',
  },
  inputDisabled: {
    backgroundColor: '#f3f4f6',
    color: '#9ca3af',
    cursor: 'not-allowed',
  },
  errorText: {
    fontSize: '0.875rem',
    color: '#dc2626',
    marginTop: '4px',
    margin: '4px 0 0 0',
  },
  actions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'flex-end',
    marginTop: '1.5rem',
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
  saveButton: {
    padding: '8px 24px',
    fontSize: '1rem',
    fontWeight: 600,
    backgroundColor: '#2563eb',
    color: '#ffffff',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'background-color 150ms ease',
  },
};

export default EditModal;
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DEPARTMENTS } from '../types';
import type { Department, FormErrors } from '../types';
import { validateName, validateEmail, validateMobile, validateDepartment } from '../utils/validators';
import { addSubmission, isEmailDuplicate } from '../utils/storage';

const InterestForm: React.FC = () => {
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [mobile, setMobile] = useState<string>('');
  const [department, setDepartment] = useState<string>('');
  const [errors, setErrors] = useState<FormErrors>({
    fullName: '',
    email: '',
    mobile: '',
    department: '',
  });
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [duplicateError, setDuplicateError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setSuccessMessage('');
    setDuplicateError('');

    const fullNameError = validateName(fullName);
    const emailError = validateEmail(email);
    const mobileError = validateMobile(mobile);
    const departmentError = validateDepartment(department);

    const newErrors: FormErrors = {
      fullName: fullNameError,
      email: emailError,
      mobile: mobileError,
      department: departmentError,
    };

    setErrors(newErrors);

    if (fullNameError || emailError || mobileError || departmentError) {
      return;
    }

    if (isEmailDuplicate(email.trim())) {
      setDuplicateError('This email address has already been submitted.');
      return;
    }

    const submission = {
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      email: email.trim(),
      mobile: mobile.trim(),
      department: department as Department,
      submittedOn: new Date().toISOString(),
    };

    addSubmission(submission);

    setFullName('');
    setEmail('');
    setMobile('');
    setDepartment('');
    setErrors({ fullName: '', email: '', mobile: '', department: '' });

    setSuccessMessage('Your interest form has been submitted successfully!');
    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="form-page">
      <div className="form-card">
        <h2>Onboarding Interest Form</h2>
        <p className="form-subtitle">
          Fill out the form below to express your interest in joining HireHub.
        </p>

        {successMessage && (
          <div className="form-success">{successMessage}</div>
        )}

        {duplicateError && (
          <div className="form-error-banner">{duplicateError}</div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">
              Full Name <span className="required">*</span>
            </label>
            <input
              id="fullName"
              type="text"
              className={`form-input${errors.fullName ? ' error' : ''}`}
              value={fullName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setFullName(e.target.value)
              }
              placeholder="Enter your full name"
              autoComplete="name"
            />
            {errors.fullName && (
              <p className="form-error">{errors.fullName}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              className={`form-input${errors.email ? ' error' : ''}`}
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email address"
              autoComplete="email"
            />
            {errors.email && (
              <p className="form-error">{errors.email}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="mobile" className="form-label">
              Mobile Number <span className="required">*</span>
            </label>
            <input
              id="mobile"
              type="tel"
              className={`form-input${errors.mobile ? ' error' : ''}`}
              value={mobile}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMobile(e.target.value)
              }
              placeholder="Enter your 10-digit mobile number"
              autoComplete="tel"
            />
            {errors.mobile && (
              <p className="form-error">{errors.mobile}</p>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="department" className="form-label">
              Department of Interest <span className="required">*</span>
            </label>
            <select
              id="department"
              className={`form-select${errors.department ? ' error' : ''}`}
              value={department}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                setDepartment(e.target.value)
              }
            >
              <option value="">Select a department</option>
              {DEPARTMENTS.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.department && (
              <p className="form-error">{errors.department}</p>
            )}
          </div>

          <button type="submit" className="form-submit-btn">
            Submit
          </button>
        </form>

        <div className="text-center mt-md">
          <Link to="/" className="header-nav-link" style={{ color: 'var(--color-primary)' }}>
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default InterestForm;
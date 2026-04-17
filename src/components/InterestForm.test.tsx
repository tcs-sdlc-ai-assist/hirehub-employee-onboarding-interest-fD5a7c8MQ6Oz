import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import InterestForm from './InterestForm';
import * as storage from '../utils/storage';
import * as validators from '../utils/validators';

vi.mock('../utils/storage', () => ({
  addSubmission: vi.fn(),
  isEmailDuplicate: vi.fn().mockReturnValue(false),
}));

function renderInterestForm() {
  return render(
    <BrowserRouter>
      <InterestForm />
    </BrowserRouter>
  );
}

describe('InterestForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (storage.isEmailDuplicate as ReturnType<typeof vi.fn>).mockReturnValue(false);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Rendering', () => {
    it('renders the form title', () => {
      renderInterestForm();
      expect(screen.getByText('Onboarding Interest Form')).toBeInTheDocument();
    });

    it('renders the form subtitle', () => {
      renderInterestForm();
      expect(
        screen.getByText('Fill out the form below to express your interest in joining HireHub.')
      ).toBeInTheDocument();
    });

    it('renders the full name input', () => {
      renderInterestForm();
      expect(screen.getByLabelText(/full name/i)).toBeInTheDocument();
    });

    it('renders the email input', () => {
      renderInterestForm();
      expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    });

    it('renders the mobile number input', () => {
      renderInterestForm();
      expect(screen.getByLabelText(/mobile number/i)).toBeInTheDocument();
    });

    it('renders the department select', () => {
      renderInterestForm();
      expect(screen.getByLabelText(/department of interest/i)).toBeInTheDocument();
    });

    it('renders the submit button', () => {
      renderInterestForm();
      expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
    });

    it('renders all department options', () => {
      renderInterestForm();
      const select = screen.getByLabelText(/department of interest/i);
      expect(select).toBeInTheDocument();
      expect(screen.getByText('Engineering')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();
      expect(screen.getByText('Marketing')).toBeInTheDocument();
      expect(screen.getByText('Sales')).toBeInTheDocument();
      expect(screen.getByText('HR')).toBeInTheDocument();
      expect(screen.getByText('Finance')).toBeInTheDocument();
    });

    it('renders the Back to Home link', () => {
      renderInterestForm();
      const link = screen.getByText(/back to home/i);
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', '/');
    });
  });

  describe('Validation errors', () => {
    it('shows full name required error when submitting empty form', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText('Full name is required')).toBeInTheDocument();
    });

    it('shows email required error when submitting empty form', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText('Email is required')).toBeInTheDocument();
    });

    it('shows mobile required error when submitting empty form', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText('Mobile number is required')).toBeInTheDocument();
    });

    it('shows department required error when submitting empty form', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText('Department is required')).toBeInTheDocument();
    });

    it('shows invalid email error for malformed email', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'notanemail');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText('Please enter a valid email address')).toBeInTheDocument();
    });

    it('shows invalid mobile error for non-10-digit number', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '12345');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText('Mobile number must be exactly 10 digits')).toBeInTheDocument();
    });

    it('shows name validation error for name with numbers', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'John123');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(screen.getByText('Full name must contain only alphabets and spaces')).toBeInTheDocument();
    });

    it('does not call addSubmission when validation fails', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(storage.addSubmission).not.toHaveBeenCalled();
    });
  });

  describe('Successful submission', () => {
    it('calls addSubmission with correct data on valid submission', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(storage.addSubmission).toHaveBeenCalledTimes(1);
      const call = (storage.addSubmission as ReturnType<typeof vi.fn>).mock.calls[0][0];
      expect(call.fullName).toBe('John Doe');
      expect(call.email).toBe('john@example.com');
      expect(call.mobile).toBe('1234567890');
      expect(call.department).toBe('Engineering');
      expect(call.id).toBeDefined();
      expect(call.submittedOn).toBeDefined();
    });

    it('displays success message after valid submission', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(
        screen.getByText('Your interest form has been submitted successfully!')
      ).toBeInTheDocument();
    });

    it('clears form fields after successful submission', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      const emailInput = screen.getByLabelText(/email address/i) as HTMLInputElement;
      const mobileInput = screen.getByLabelText(/mobile number/i) as HTMLInputElement;
      const departmentSelect = screen.getByLabelText(/department of interest/i) as HTMLSelectElement;

      await user.type(nameInput, 'John Doe');
      await user.type(emailInput, 'john@example.com');
      await user.type(mobileInput, '1234567890');
      await user.selectOptions(departmentSelect, 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(nameInput.value).toBe('');
      expect(emailInput.value).toBe('');
      expect(mobileInput.value).toBe('');
      expect(departmentSelect.value).toBe('');
    });

    it('auto-dismisses success message after timeout', async () => {
      vi.useFakeTimers();
      const user = userEvent.setup({ advanceTimers: vi.advanceTimersByTime });
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(
        screen.getByText('Your interest form has been submitted successfully!')
      ).toBeInTheDocument();

      vi.advanceTimersByTime(4000);

      await waitFor(() => {
        expect(
          screen.queryByText('Your interest form has been submitted successfully!')
        ).not.toBeInTheDocument();
      });

      vi.useRealTimers();
    });
  });

  describe('Duplicate email', () => {
    it('shows duplicate email error when email already exists', async () => {
      (storage.isEmailDuplicate as ReturnType<typeof vi.fn>).mockReturnValue(true);
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(
        screen.getByText('This email address has already been submitted.')
      ).toBeInTheDocument();
    });

    it('does not call addSubmission when email is duplicate', async () => {
      (storage.isEmailDuplicate as ReturnType<typeof vi.fn>).mockReturnValue(true);
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), 'john@example.com');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(storage.addSubmission).not.toHaveBeenCalled();
    });

    it('calls isEmailDuplicate with trimmed email', async () => {
      const user = userEvent.setup();
      renderInterestForm();

      await user.type(screen.getByLabelText(/full name/i), 'John Doe');
      await user.type(screen.getByLabelText(/email address/i), '  john@example.com  ');
      await user.type(screen.getByLabelText(/mobile number/i), '1234567890');
      await user.selectOptions(screen.getByLabelText(/department of interest/i), 'Engineering');

      await user.click(screen.getByRole('button', { name: /submit/i }));

      expect(storage.isEmailDuplicate).toHaveBeenCalledWith('john@example.com');
    });
  });

  describe('Back to Home link', () => {
    it('renders a link that navigates to home page', () => {
      renderInterestForm();
      const link = screen.getByText(/back to home/i);
      expect(link).toBeInTheDocument();
      expect(link.closest('a')).toHaveAttribute('href', '/');
    });
  });
});
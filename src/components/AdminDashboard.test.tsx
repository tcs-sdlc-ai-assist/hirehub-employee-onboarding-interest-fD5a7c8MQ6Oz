import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AdminDashboard from './AdminDashboard';
import type { Submission } from '../types';

vi.mock('../utils/storage', () => ({
  getSubmissions: vi.fn(),
  deleteSubmission: vi.fn(),
  updateSubmission: vi.fn(),
}));

import * as storage from '../utils/storage';

function createMockSubmission(overrides: Partial<Submission> = {}): Submission {
  return {
    id: 'test-id-1',
    fullName: 'John Doe',
    email: 'john@example.com',
    mobile: '1234567890',
    department: 'Engineering',
    submittedOn: '2024-01-15T10:00:00.000Z',
    ...overrides,
  };
}

const mockGetSubmissions = storage.getSubmissions as ReturnType<typeof vi.fn>;
const mockDeleteSubmission = storage.deleteSubmission as ReturnType<typeof vi.fn>;
const mockUpdateSubmission = storage.updateSubmission as ReturnType<typeof vi.fn>;

describe('AdminDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockGetSubmissions.mockReturnValue([]);
  });

  describe('Rendering', () => {
    it('renders the dashboard title', () => {
      render(<AdminDashboard />);
      expect(screen.getByText('Admin Dashboard')).toBeInTheDocument();
    });

    it('renders the dashboard subtitle', () => {
      render(<AdminDashboard />);
      expect(
        screen.getByText('Manage all onboarding interest submissions.')
      ).toBeInTheDocument();
    });

    it('renders the submissions table header', () => {
      render(<AdminDashboard />);
      expect(screen.getByText('Submissions')).toBeInTheDocument();
    });

    it('renders the search input', () => {
      render(<AdminDashboard />);
      expect(
        screen.getByPlaceholderText('Search by name, email, mobile, or department...')
      ).toBeInTheDocument();
    });
  });

  describe('Stat cards', () => {
    it('displays total submissions count as 0 when no submissions', () => {
      mockGetSubmissions.mockReturnValue([]);
      render(<AdminDashboard />);
      expect(screen.getByText('Total Submissions')).toBeInTheDocument();
      expect(screen.getByText('0')).toBeInTheDocument();
    });

    it('displays correct total submissions count', () => {
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1' }),
        createMockSubmission({ id: '2', email: 'jane@example.com' }),
        createMockSubmission({ id: '3', email: 'bob@example.com' }),
      ]);
      render(<AdminDashboard />);
      expect(screen.getByText('3')).toBeInTheDocument();
    });

    it('displays correct unique departments count', () => {
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1', department: 'Engineering' }),
        createMockSubmission({ id: '2', department: 'Design', email: 'jane@example.com' }),
        createMockSubmission({ id: '3', department: 'Engineering', email: 'bob@example.com' }),
      ]);
      render(<AdminDashboard />);
      expect(screen.getByText('Unique Departments')).toBeInTheDocument();
      expect(screen.getByText('2')).toBeInTheDocument();
    });

    it('displays N/A for latest submission when no submissions exist', () => {
      mockGetSubmissions.mockReturnValue([]);
      render(<AdminDashboard />);
      expect(screen.getByText('Latest Submission')).toBeInTheDocument();
      expect(screen.getByText('N/A')).toBeInTheDocument();
    });

    it('displays latest submission date when submissions exist', () => {
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1', submittedOn: '2024-01-10T10:00:00.000Z' }),
        createMockSubmission({ id: '2', submittedOn: '2024-06-20T14:30:00.000Z', email: 'jane@example.com' }),
        createMockSubmission({ id: '3', submittedOn: '2024-03-05T08:00:00.000Z', email: 'bob@example.com' }),
      ]);
      render(<AdminDashboard />);
      expect(screen.getByText('Latest Submission')).toBeInTheDocument();
    });
  });

  describe('Submission table display', () => {
    it('shows empty message when no submissions exist', () => {
      mockGetSubmissions.mockReturnValue([]);
      render(<AdminDashboard />);
      expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
    });

    it('displays submission data in the table', () => {
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({
          id: '1',
          fullName: 'Alice Smith',
          email: 'alice@example.com',
          mobile: '9876543210',
          department: 'Design',
        }),
      ]);
      render(<AdminDashboard />);
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('alice@example.com')).toBeInTheDocument();
      expect(screen.getByText('9876543210')).toBeInTheDocument();
      expect(screen.getByText('Design')).toBeInTheDocument();
    });

    it('displays multiple submissions', () => {
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1', fullName: 'Alice Smith', email: 'alice@example.com' }),
        createMockSubmission({ id: '2', fullName: 'Bob Jones', email: 'bob@example.com' }),
      ]);
      render(<AdminDashboard />);
      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    });

    it('renders edit and delete buttons for each submission', () => {
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1' }),
      ]);
      render(<AdminDashboard />);
      expect(screen.getByText('Edit')).toBeInTheDocument();
      expect(screen.getByText('Delete')).toBeInTheDocument();
    });
  });

  describe('Search and filter', () => {
    it('filters submissions by name', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1', fullName: 'Alice Smith', email: 'alice@example.com' }),
        createMockSubmission({ id: '2', fullName: 'Bob Jones', email: 'bob@example.com' }),
      ]);
      render(<AdminDashboard />);

      const searchInput = screen.getByPlaceholderText('Search by name, email, mobile, or department...');
      await user.type(searchInput, 'Alice');

      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
      expect(screen.queryByText('Bob Jones')).not.toBeInTheDocument();
    });

    it('filters submissions by email', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1', fullName: 'Alice Smith', email: 'alice@example.com' }),
        createMockSubmission({ id: '2', fullName: 'Bob Jones', email: 'bob@example.com' }),
      ]);
      render(<AdminDashboard />);

      const searchInput = screen.getByPlaceholderText('Search by name, email, mobile, or department...');
      await user.type(searchInput, 'bob@');

      expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    });

    it('filters submissions by department', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1', fullName: 'Alice Smith', email: 'alice@example.com', department: 'Engineering' }),
        createMockSubmission({ id: '2', fullName: 'Bob Jones', email: 'bob@example.com', department: 'Design' }),
      ]);
      render(<AdminDashboard />);

      const searchInput = screen.getByPlaceholderText('Search by name, email, mobile, or department...');
      await user.type(searchInput, 'Design');

      expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    });

    it('filters submissions by mobile', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1', fullName: 'Alice Smith', email: 'alice@example.com', mobile: '1111111111' }),
        createMockSubmission({ id: '2', fullName: 'Bob Jones', email: 'bob@example.com', mobile: '2222222222' }),
      ]);
      render(<AdminDashboard />);

      const searchInput = screen.getByPlaceholderText('Search by name, email, mobile, or department...');
      await user.type(searchInput, '2222');

      expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
      expect(screen.getByText('Bob Jones')).toBeInTheDocument();
    });

    it('shows empty state when search matches nothing', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1', fullName: 'Alice Smith', email: 'alice@example.com' }),
      ]);
      render(<AdminDashboard />);

      const searchInput = screen.getByPlaceholderText('Search by name, email, mobile, or department...');
      await user.type(searchInput, 'zzzzzzz');

      expect(screen.queryByText('Alice Smith')).not.toBeInTheDocument();
      expect(screen.getByText('No submissions yet.')).toBeInTheDocument();
    });

    it('search is case-insensitive', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1', fullName: 'Alice Smith', email: 'alice@example.com' }),
      ]);
      render(<AdminDashboard />);

      const searchInput = screen.getByPlaceholderText('Search by name, email, mobile, or department...');
      await user.type(searchInput, 'alice');

      expect(screen.getByText('Alice Smith')).toBeInTheDocument();
    });
  });

  describe('Edit modal', () => {
    it('opens edit modal when edit button is clicked', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1', fullName: 'John Doe', email: 'john@example.com' }),
      ]);
      render(<AdminDashboard />);

      await user.click(screen.getByText('Edit'));

      expect(screen.getByText('Edit Submission')).toBeInTheDocument();
    });

    it('pre-fills edit modal with submission data', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({
          id: '1',
          fullName: 'John Doe',
          email: 'john@example.com',
          mobile: '1234567890',
          department: 'Engineering',
        }),
      ]);
      render(<AdminDashboard />);

      await user.click(screen.getByText('Edit'));

      const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      expect(nameInput.value).toBe('John Doe');

      const mobileInput = screen.getByLabelText(/mobile number/i) as HTMLInputElement;
      expect(mobileInput.value).toBe('1234567890');

      const departmentSelect = screen.getByLabelText(/department/i) as HTMLSelectElement;
      expect(departmentSelect.value).toBe('Engineering');
    });

    it('displays email as disabled in edit modal', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1', email: 'john@example.com' }),
      ]);
      render(<AdminDashboard />);

      await user.click(screen.getByText('Edit'));

      const emailInput = screen.getByDisplayValue('john@example.com') as HTMLInputElement;
      expect(emailInput).toBeDisabled();
    });

    it('closes edit modal when cancel is clicked', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1' }),
      ]);
      render(<AdminDashboard />);

      await user.click(screen.getByText('Edit'));
      expect(screen.getByText('Edit Submission')).toBeInTheDocument();

      await user.click(screen.getByText('Cancel'));
      expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
    });

    it('calls updateSubmission and refreshes data on save', async () => {
      const user = userEvent.setup();
      const originalSubmission = createMockSubmission({
        id: '1',
        fullName: 'John Doe',
        email: 'john@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });
      const updatedSubmission = createMockSubmission({
        id: '1',
        fullName: 'Jane Smith',
        email: 'john@example.com',
        mobile: '1234567890',
        department: 'Engineering',
      });

      mockGetSubmissions
        .mockReturnValueOnce([originalSubmission])
        .mockReturnValueOnce([originalSubmission])
        .mockReturnValue([updatedSubmission]);

      render(<AdminDashboard />);

      await user.click(screen.getByText('Edit'));

      const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      await user.clear(nameInput);
      await user.type(nameInput, 'Jane Smith');

      await user.click(screen.getByText('Save Changes'));

      expect(mockUpdateSubmission).toHaveBeenCalledTimes(1);
      expect(mockUpdateSubmission).toHaveBeenCalledWith('1', {
        fullName: 'Jane Smith',
        mobile: '1234567890',
        department: 'Engineering',
      });

      expect(screen.queryByText('Edit Submission')).not.toBeInTheDocument();
    });
  });

  describe('Delete confirmation', () => {
    it('opens delete confirmation dialog when delete button is clicked', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1' }),
      ]);
      render(<AdminDashboard />);

      await user.click(screen.getByText('Delete'));

      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();
      expect(
        screen.getByText('Are you sure you want to delete this submission? This action cannot be undone.')
      ).toBeInTheDocument();
    });

    it('closes delete confirmation when cancel is clicked', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1' }),
      ]);
      render(<AdminDashboard />);

      await user.click(screen.getByText('Delete'));
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();

      const confirmDialog = screen.getByText('Confirm Deletion').closest('div')!;
      const cancelButton = within(confirmDialog.parentElement!).getByText('Cancel');
      await user.click(cancelButton);

      expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
    });

    it('calls deleteSubmission and refreshes data on confirm', async () => {
      const user = userEvent.setup();
      const submission = createMockSubmission({ id: 'delete-me' });

      mockGetSubmissions
        .mockReturnValueOnce([submission])
        .mockReturnValueOnce([submission])
        .mockReturnValue([]);

      render(<AdminDashboard />);

      await user.click(screen.getByText('Delete'));
      expect(screen.getByText('Confirm Deletion')).toBeInTheDocument();

      const confirmDialog = screen.getByText('Confirm Deletion').closest('div')!;
      const deleteButton = within(confirmDialog.parentElement!).getByRole('button', { name: 'Delete' });
      await user.click(deleteButton);

      expect(mockDeleteSubmission).toHaveBeenCalledTimes(1);
      expect(mockDeleteSubmission).toHaveBeenCalledWith('delete-me');

      expect(screen.queryByText('Confirm Deletion')).not.toBeInTheDocument();
    });

    it('does not call deleteSubmission when cancel is clicked', async () => {
      const user = userEvent.setup();
      mockGetSubmissions.mockReturnValue([
        createMockSubmission({ id: '1' }),
      ]);
      render(<AdminDashboard />);

      await user.click(screen.getByText('Delete'));

      const confirmDialog = screen.getByText('Confirm Deletion').closest('div')!;
      const cancelButton = within(confirmDialog.parentElement!).getByText('Cancel');
      await user.click(cancelButton);

      expect(mockDeleteSubmission).not.toHaveBeenCalled();
    });
  });

  describe('Data refresh after CRUD operations', () => {
    it('calls getSubmissions on initial render', () => {
      render(<AdminDashboard />);
      expect(mockGetSubmissions).toHaveBeenCalled();
    });

    it('refreshes submissions after delete', async () => {
      const user = userEvent.setup();
      const sub1 = createMockSubmission({ id: '1', fullName: 'Alice', email: 'alice@example.com' });
      const sub2 = createMockSubmission({ id: '2', fullName: 'Bob', email: 'bob@example.com' });

      mockGetSubmissions
        .mockReturnValueOnce([sub1, sub2])
        .mockReturnValueOnce([sub1, sub2])
        .mockReturnValue([sub2]);

      render(<AdminDashboard />);

      expect(screen.getByText('Alice')).toBeInTheDocument();
      expect(screen.getByText('Bob')).toBeInTheDocument();

      const deleteButtons = screen.getAllByText('Delete');
      await user.click(deleteButtons[0]);

      const confirmDialog = screen.getByText('Confirm Deletion').closest('div')!;
      const confirmDeleteButton = within(confirmDialog.parentElement!).getByRole('button', { name: 'Delete' });
      await user.click(confirmDeleteButton);

      expect(mockGetSubmissions).toHaveBeenCalledTimes(3);
    });

    it('refreshes submissions after edit save', async () => {
      const user = userEvent.setup();
      const submission = createMockSubmission({
        id: '1',
        fullName: 'John Doe',
        mobile: '1234567890',
        department: 'Engineering',
      });

      mockGetSubmissions
        .mockReturnValueOnce([submission])
        .mockReturnValueOnce([submission])
        .mockReturnValue([{ ...submission, fullName: 'Updated Name' }]);

      render(<AdminDashboard />);

      await user.click(screen.getByText('Edit'));

      const nameInput = screen.getByLabelText(/full name/i) as HTMLInputElement;
      await user.clear(nameInput);
      await user.type(nameInput, 'Updated Name');

      await user.click(screen.getByText('Save Changes'));

      expect(mockGetSubmissions).toHaveBeenCalledTimes(3);
    });
  });
});
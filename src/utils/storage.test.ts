import { describe, it, expect, beforeEach, vi } from 'vitest';
import {
  getSubmissions,
  saveSubmissions,
  addSubmission,
  updateSubmission,
  deleteSubmission,
  isEmailDuplicate,
} from './storage';
import type { Submission } from '../types';

const STORAGE_KEY = 'hirehub_submissions';

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

describe('storage.ts', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getSubmissions', () => {
    it('returns an empty array when localStorage has no data', () => {
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns an empty array when localStorage value is null', () => {
      vi.spyOn(Storage.prototype, 'getItem').mockReturnValue(null);
      const result = getSubmissions();
      expect(result).toEqual([]);
    });

    it('returns parsed submissions when localStorage has valid data', () => {
      const submissions: Submission[] = [
        createMockSubmission(),
        createMockSubmission({ id: 'test-id-2', fullName: 'Jane Doe', email: 'jane@example.com' }),
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));

      const result = getSubmissions();
      expect(result).toHaveLength(2);
      expect(result[0].fullName).toBe('John Doe');
      expect(result[1].fullName).toBe('Jane Doe');
    });

    it('returns empty array and resets localStorage when data is corrupted JSON', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem(STORAGE_KEY, '{not valid json!!!');

      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns empty array and resets localStorage when data is not an array', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ foo: 'bar' }));

      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns empty array and resets localStorage when data is a string', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem(STORAGE_KEY, JSON.stringify('just a string'));

      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
      expect(consoleSpy).toHaveBeenCalled();
    });

    it('returns empty array and resets localStorage when data is a number', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      localStorage.setItem(STORAGE_KEY, JSON.stringify(42));

      const result = getSubmissions();
      expect(result).toEqual([]);
      expect(localStorage.getItem(STORAGE_KEY)).toBe('[]');
      expect(consoleSpy).toHaveBeenCalled();
    });
  });

  describe('saveSubmissions', () => {
    it('saves submissions array to localStorage', () => {
      const submissions: Submission[] = [createMockSubmission()];
      saveSubmissions(submissions);

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).not.toBeNull();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].fullName).toBe('John Doe');
    });

    it('saves an empty array to localStorage', () => {
      saveSubmissions([]);

      const stored = localStorage.getItem(STORAGE_KEY);
      expect(stored).toBe('[]');
    });

    it('overwrites existing data in localStorage', () => {
      const first: Submission[] = [createMockSubmission()];
      saveSubmissions(first);

      const second: Submission[] = [
        createMockSubmission({ id: 'new-id', fullName: 'New Person' }),
      ];
      saveSubmissions(second);

      const stored = localStorage.getItem(STORAGE_KEY);
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].fullName).toBe('New Person');
    });

    it('logs error when localStorage.setItem throws', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('QuotaExceededError');
      });

      saveSubmissions([createMockSubmission()]);
      expect(consoleSpy).toHaveBeenCalledWith(
        'Failed to save submissions to localStorage.',
        expect.any(Error)
      );
    });
  });

  describe('addSubmission', () => {
    it('adds a submission to an empty localStorage', () => {
      const submission = createMockSubmission();
      addSubmission(submission);

      const result = getSubmissions();
      expect(result).toHaveLength(1);
      expect(result[0]).toEqual(submission);
    });

    it('appends a submission to existing submissions', () => {
      const first = createMockSubmission();
      addSubmission(first);

      const second = createMockSubmission({
        id: 'test-id-2',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
      });
      addSubmission(second);

      const result = getSubmissions();
      expect(result).toHaveLength(2);
      expect(result[0].id).toBe('test-id-1');
      expect(result[1].id).toBe('test-id-2');
    });

    it('preserves existing submissions when adding a new one', () => {
      const existing: Submission[] = [
        createMockSubmission(),
        createMockSubmission({ id: 'test-id-2', email: 'second@example.com' }),
      ];
      saveSubmissions(existing);

      const newSubmission = createMockSubmission({
        id: 'test-id-3',
        email: 'third@example.com',
      });
      addSubmission(newSubmission);

      const result = getSubmissions();
      expect(result).toHaveLength(3);
      expect(result[2].id).toBe('test-id-3');
    });
  });

  describe('updateSubmission', () => {
    it('updates the fullName of an existing submission', () => {
      const submission = createMockSubmission();
      addSubmission(submission);

      updateSubmission('test-id-1', { fullName: 'Updated Name' });

      const result = getSubmissions();
      expect(result[0].fullName).toBe('Updated Name');
    });

    it('updates the mobile of an existing submission', () => {
      const submission = createMockSubmission();
      addSubmission(submission);

      updateSubmission('test-id-1', { mobile: '9876543210' });

      const result = getSubmissions();
      expect(result[0].mobile).toBe('9876543210');
    });

    it('updates the department of an existing submission', () => {
      const submission = createMockSubmission();
      addSubmission(submission);

      updateSubmission('test-id-1', { department: 'Design' });

      const result = getSubmissions();
      expect(result[0].department).toBe('Design');
    });

    it('updates multiple fields at once', () => {
      const submission = createMockSubmission();
      addSubmission(submission);

      updateSubmission('test-id-1', {
        fullName: 'New Name',
        mobile: '5555555555',
        department: 'HR',
      });

      const result = getSubmissions();
      expect(result[0].fullName).toBe('New Name');
      expect(result[0].mobile).toBe('5555555555');
      expect(result[0].department).toBe('HR');
    });

    it('does not modify the email field', () => {
      const submission = createMockSubmission();
      addSubmission(submission);

      updateSubmission('test-id-1', { fullName: 'Updated' });

      const result = getSubmissions();
      expect(result[0].email).toBe('john@example.com');
    });

    it('does not modify the id field', () => {
      const submission = createMockSubmission();
      addSubmission(submission);

      updateSubmission('test-id-1', { fullName: 'Updated' });

      const result = getSubmissions();
      expect(result[0].id).toBe('test-id-1');
    });

    it('does not modify other submissions', () => {
      const sub1 = createMockSubmission();
      const sub2 = createMockSubmission({
        id: 'test-id-2',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
      });
      saveSubmissions([sub1, sub2]);

      updateSubmission('test-id-1', { fullName: 'Updated John' });

      const result = getSubmissions();
      expect(result[0].fullName).toBe('Updated John');
      expect(result[1].fullName).toBe('Jane Doe');
    });

    it('logs error when submission id is not found', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      const submission = createMockSubmission();
      addSubmission(submission);

      updateSubmission('nonexistent-id', { fullName: 'Ghost' });

      expect(consoleSpy).toHaveBeenCalledWith(
        'Submission with id "nonexistent-id" not found.'
      );

      const result = getSubmissions();
      expect(result[0].fullName).toBe('John Doe');
    });
  });

  describe('deleteSubmission', () => {
    it('deletes a submission by id', () => {
      const submission = createMockSubmission();
      addSubmission(submission);

      deleteSubmission('test-id-1');

      const result = getSubmissions();
      expect(result).toHaveLength(0);
    });

    it('only deletes the targeted submission', () => {
      const sub1 = createMockSubmission();
      const sub2 = createMockSubmission({
        id: 'test-id-2',
        fullName: 'Jane Doe',
        email: 'jane@example.com',
      });
      const sub3 = createMockSubmission({
        id: 'test-id-3',
        fullName: 'Bob Smith',
        email: 'bob@example.com',
      });
      saveSubmissions([sub1, sub2, sub3]);

      deleteSubmission('test-id-2');

      const result = getSubmissions();
      expect(result).toHaveLength(2);
      expect(result.find((s) => s.id === 'test-id-2')).toBeUndefined();
      expect(result[0].id).toBe('test-id-1');
      expect(result[1].id).toBe('test-id-3');
    });

    it('does nothing when id does not exist', () => {
      const submission = createMockSubmission();
      addSubmission(submission);

      deleteSubmission('nonexistent-id');

      const result = getSubmissions();
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('test-id-1');
    });

    it('handles deleting from an empty list', () => {
      deleteSubmission('any-id');

      const result = getSubmissions();
      expect(result).toHaveLength(0);
    });
  });

  describe('isEmailDuplicate', () => {
    it('returns false when no submissions exist', () => {
      expect(isEmailDuplicate('test@example.com')).toBe(false);
    });

    it('returns true when email exists in submissions', () => {
      addSubmission(createMockSubmission({ email: 'john@example.com' }));

      expect(isEmailDuplicate('john@example.com')).toBe(true);
    });

    it('returns false when email does not exist in submissions', () => {
      addSubmission(createMockSubmission({ email: 'john@example.com' }));

      expect(isEmailDuplicate('other@example.com')).toBe(false);
    });

    it('performs case-insensitive comparison', () => {
      addSubmission(createMockSubmission({ email: 'John@Example.COM' }));

      expect(isEmailDuplicate('john@example.com')).toBe(true);
      expect(isEmailDuplicate('JOHN@EXAMPLE.COM')).toBe(true);
      expect(isEmailDuplicate('John@Example.COM')).toBe(true);
    });

    it('returns true for duplicate among multiple submissions', () => {
      addSubmission(createMockSubmission({ id: '1', email: 'alice@example.com' }));
      addSubmission(createMockSubmission({ id: '2', email: 'bob@example.com' }));
      addSubmission(createMockSubmission({ id: '3', email: 'charlie@example.com' }));

      expect(isEmailDuplicate('bob@example.com')).toBe(true);
      expect(isEmailDuplicate('dave@example.com')).toBe(false);
    });
  });
});
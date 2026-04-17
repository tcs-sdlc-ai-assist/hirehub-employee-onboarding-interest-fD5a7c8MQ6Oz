import type { Submission } from '../types/index';

const STORAGE_KEY = 'hirehub_submissions';

export function getSubmissions(): Submission[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      return [];
    }
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) {
      console.error('Corrupted submissions data: expected array, resetting.');
      localStorage.setItem(STORAGE_KEY, '[]');
      return [];
    }
    return parsed as Submission[];
  } catch (error) {
    console.error('Failed to parse submissions from localStorage, resetting.', error);
    localStorage.setItem(STORAGE_KEY, '[]');
    return [];
  }
}

export function saveSubmissions(data: Submission[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save submissions to localStorage.', error);
  }
}

export function addSubmission(submission: Submission): void {
  const submissions = getSubmissions();
  submissions.push(submission);
  saveSubmissions(submissions);
}

export function updateSubmission(
  id: string,
  updates: Partial<Omit<Submission, 'id' | 'email'>>
): void {
  const submissions = getSubmissions();
  const index = submissions.findIndex((s) => s.id === id);
  if (index === -1) {
    console.error(`Submission with id "${id}" not found.`);
    return;
  }
  submissions[index] = { ...submissions[index], ...updates };
  saveSubmissions(submissions);
}

export function deleteSubmission(id: string): void {
  const submissions = getSubmissions();
  const filtered = submissions.filter((s) => s.id !== id);
  saveSubmissions(filtered);
}

export function isEmailDuplicate(email: string): boolean {
  const submissions = getSubmissions();
  return submissions.some(
    (s) => s.email.toLowerCase() === email.toLowerCase()
  );
}
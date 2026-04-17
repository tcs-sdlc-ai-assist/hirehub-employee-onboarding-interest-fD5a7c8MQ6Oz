import { describe, it, expect } from 'vitest';
import {
  validateName,
  validateEmail,
  validateMobile,
  validateDepartment,
} from './validators';

describe('validateName', () => {
  it('returns empty string for a valid name', () => {
    expect(validateName('John Doe')).toBe('');
  });

  it('returns empty string for a valid single name with two characters', () => {
    expect(validateName('Jo')).toBe('');
  });

  it('returns empty string for a name with leading/trailing spaces (trimmed valid)', () => {
    expect(validateName('  Alice Smith  ')).toBe('');
  });

  it('returns error when name is empty', () => {
    expect(validateName('')).toBe('Full name is required');
  });

  it('returns error when name is only whitespace', () => {
    expect(validateName('   ')).toBe('Full name is required');
  });

  it('returns error when name contains numbers', () => {
    expect(validateName('John123')).toBe('Full name must contain only alphabets and spaces');
  });

  it('returns error when name contains special characters', () => {
    expect(validateName('John@Doe')).toBe('Full name must contain only alphabets and spaces');
  });

  it('returns error when name contains hyphens', () => {
    expect(validateName('Mary-Jane')).toBe('Full name must contain only alphabets and spaces');
  });

  it('returns error when name is only one character', () => {
    expect(validateName('A')).toBe('Full name must be at least 2 characters');
  });

  it('returns empty string for a long valid name', () => {
    expect(validateName('Alexander Benjamin Christopher')).toBe('');
  });
});

describe('validateEmail', () => {
  it('returns empty string for a valid email', () => {
    expect(validateEmail('user@example.com')).toBe('');
  });

  it('returns empty string for a valid email with subdomain', () => {
    expect(validateEmail('user@mail.example.com')).toBe('');
  });

  it('returns empty string for a valid email with plus addressing', () => {
    expect(validateEmail('user+tag@example.com')).toBe('');
  });

  it('returns error when email is empty', () => {
    expect(validateEmail('')).toBe('Email is required');
  });

  it('returns error when email is only whitespace', () => {
    expect(validateEmail('   ')).toBe('Email is required');
  });

  it('returns error when email has no @ symbol', () => {
    expect(validateEmail('userexample.com')).toBe('Please enter a valid email address');
  });

  it('returns error when email has no domain', () => {
    expect(validateEmail('user@')).toBe('Please enter a valid email address');
  });

  it('returns error when email has no local part', () => {
    expect(validateEmail('@example.com')).toBe('Please enter a valid email address');
  });

  it('returns error when email has no TLD', () => {
    expect(validateEmail('user@example')).toBe('Please enter a valid email address');
  });

  it('returns error when email has spaces', () => {
    expect(validateEmail('user @example.com')).toBe('Please enter a valid email address');
  });

  it('returns empty string for email with leading/trailing spaces (trimmed valid)', () => {
    expect(validateEmail('  user@example.com  ')).toBe('');
  });
});

describe('validateMobile', () => {
  it('returns empty string for a valid 10-digit mobile number', () => {
    expect(validateMobile('1234567890')).toBe('');
  });

  it('returns error when mobile is empty', () => {
    expect(validateMobile('')).toBe('Mobile number is required');
  });

  it('returns error when mobile is only whitespace', () => {
    expect(validateMobile('   ')).toBe('Mobile number is required');
  });

  it('returns error when mobile is too short (less than 10 digits)', () => {
    expect(validateMobile('12345')).toBe('Mobile number must be exactly 10 digits');
  });

  it('returns error when mobile is too long (more than 10 digits)', () => {
    expect(validateMobile('12345678901')).toBe('Mobile number must be exactly 10 digits');
  });

  it('returns error when mobile contains non-numeric characters', () => {
    expect(validateMobile('12345abcde')).toBe('Mobile number must be exactly 10 digits');
  });

  it('returns error when mobile contains special characters', () => {
    expect(validateMobile('123-456-78')).toBe('Mobile number must be exactly 10 digits');
  });

  it('returns error when mobile contains spaces', () => {
    expect(validateMobile('123 456 78')).toBe('Mobile number must be exactly 10 digits');
  });

  it('returns empty string for mobile with leading/trailing spaces (trimmed valid)', () => {
    expect(validateMobile('  1234567890  ')).toBe('');
  });
});

describe('validateDepartment', () => {
  it('returns empty string for Engineering', () => {
    expect(validateDepartment('Engineering')).toBe('');
  });

  it('returns empty string for Design', () => {
    expect(validateDepartment('Design')).toBe('');
  });

  it('returns empty string for Marketing', () => {
    expect(validateDepartment('Marketing')).toBe('');
  });

  it('returns empty string for Sales', () => {
    expect(validateDepartment('Sales')).toBe('');
  });

  it('returns empty string for HR', () => {
    expect(validateDepartment('HR')).toBe('');
  });

  it('returns empty string for Finance', () => {
    expect(validateDepartment('Finance')).toBe('');
  });

  it('returns error when department is empty string', () => {
    expect(validateDepartment('')).toBe('Department is required');
  });

  it('returns error when department is an invalid value', () => {
    expect(validateDepartment('Legal')).toBe('Please select a valid department');
  });

  it('returns error when department has wrong casing', () => {
    expect(validateDepartment('engineering')).toBe('Please select a valid department');
  });

  it('returns error when department has extra spaces', () => {
    expect(validateDepartment(' Engineering ')).toBe('Please select a valid department');
  });
});
import { DEPARTMENTS } from '../types/index';
import type { Department } from '../types/index';

export function validateName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) {
    return 'Full name is required';
  }
  if (!/^[A-Za-z\s]+$/.test(trimmed)) {
    return 'Full name must contain only alphabets and spaces';
  }
  if (trimmed.length < 2) {
    return 'Full name must be at least 2 characters';
  }
  return '';
}

export function validateEmail(email: string): string {
  const trimmed = email.trim();
  if (!trimmed) {
    return 'Email is required';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(trimmed)) {
    return 'Please enter a valid email address';
  }
  return '';
}

export function validateMobile(mobile: string): string {
  const trimmed = mobile.trim();
  if (!trimmed) {
    return 'Mobile number is required';
  }
  if (!/^\d{10}$/.test(trimmed)) {
    return 'Mobile number must be exactly 10 digits';
  }
  return '';
}

export function validateDepartment(department: string): string {
  if (!department) {
    return 'Department is required';
  }
  if (!DEPARTMENTS.includes(department as Department)) {
    return 'Please select a valid department';
  }
  return '';
}
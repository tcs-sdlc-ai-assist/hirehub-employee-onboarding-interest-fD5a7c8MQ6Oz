export type Department =
  | 'Engineering'
  | 'Design'
  | 'Marketing'
  | 'Sales'
  | 'HR'
  | 'Finance';

export const DEPARTMENTS: Department[] = [
  'Engineering',
  'Design',
  'Marketing',
  'Sales',
  'HR',
  'Finance',
];

export interface Submission {
  id: string;
  fullName: string;
  email: string;
  mobile: string;
  department: Department;
  submittedOn: string;
}

export interface FormErrors {
  fullName: string;
  email: string;
  mobile: string;
  department: string;
}

export interface EditFormData {
  fullName: string;
  mobile: string;
  department: Department;
}
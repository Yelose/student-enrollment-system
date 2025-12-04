// core/models/enrollment/enrollment-status.constant.ts
import { EnrollmentStatus } from './enrollment-status.type';

export interface EnrollmentStatusOption {
  value: EnrollmentStatus;
  label: string;
}

export const ENROLLMENT_STATUS_OPTIONS: EnrollmentStatusOption[] = [
  { value: 'pending',     label: 'Pendiente' },
  { value: 'in_progress', label: 'En curso' },
  { value: 'completed',   label: 'Completada' },
  { value: 'cancelled',   label: 'Cancelada' },
];

import { EmploymentStatus } from "./student-status.type";

export const EMPLOYMENT_STATUS_OPTIONS: { value: EmploymentStatus; label: string }[] = [
    { value: 'unemployed', label: 'Desempleado/a' },
    { value: 'employed',   label: 'Trabajando' },
    { value: 'student',    label: 'Estudiante' },
    { value: 'other',      label: 'Otro' },
  ];
  
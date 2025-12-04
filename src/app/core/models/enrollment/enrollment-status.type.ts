// core/models/enrollment/enrollment-status.type.ts

/** Possible enrollment states inside the system. */
export type EnrollmentStatus =
  | 'pending'      // creada, pero aún sin empezar
  | 'in_progress'  // el alumno está cursando
  | 'completed'    // curso finalizado
  | 'cancelled';   // cancelada por cualquier motivo

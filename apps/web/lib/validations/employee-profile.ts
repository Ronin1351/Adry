import { z } from 'zod';

export const employeeProfileSchema = z.object({
  civilStatus: z.string(),
  location: z.string(),
  phone: z.string(),
  skills: z.array(z.string()),
  experienceText: z.string(),
  salaryMin: z.number(),
  salaryMax: z.number(),
  liveIn: z.boolean(),
  visibility: z.boolean(),
});

export type EmployeeProfileInput = z.infer<typeof employeeProfileSchema>;

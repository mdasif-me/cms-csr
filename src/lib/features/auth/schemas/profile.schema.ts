import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email address').optional(),
  phone: z
    .string()
    .regex(/^\+?[\d\s\-\(\)]+$/, 'Invalid phone number')
    .optional(),
  avatar: z.string().url('Invalid URL').optional(),
});

export type UpdateProfileForm = z.infer<typeof updateProfileSchema>;

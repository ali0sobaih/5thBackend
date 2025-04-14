import { z } from 'zod';

export const assignRoleSchema = z.object({
    role: z.string({ required_error: 'Role name is required' })
});



export type assignRole = z.infer<typeof assignRoleSchema>;
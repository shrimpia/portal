import { z } from 'zod';

export const basicInputFormSchema = z.object({
  name: z.string().min(1).max(32).regex(/^[a-z0-9_]+$/),
  hasText: z.boolean(),
  hasAnimation: z.boolean(),
}).required();
export type BasicInputFormSchema = z.infer<typeof basicInputFormSchema>;

import { z } from 'zod';

export const uploadFormSchema = z.object({
  isReadableInDark: z.literal(true),
  isNotHiddenInDark: z.literal(true),
  isReadableInLight: z.literal(true),
  isNotHiddenInLight: z.literal(true),
}).required();

export type UploadFormSchema = z.infer<typeof uploadFormSchema>;

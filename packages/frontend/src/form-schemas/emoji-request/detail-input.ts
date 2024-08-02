import { z } from 'zod';

export const detailInputFormSchema = z.object({
  authorInfo: z.string().nullable(),
  comment: z.string().max(500).nullable(),
}).required();
export type DetailInputFormSchema = z.infer<typeof detailInputFormSchema>;

export const detailInputAnimatedFormSchema = z.object({
  doesNotContainExcessiveFlashing: z.literal(true),
}).required();
export type DetailInputAnimatedFormSchema = z.infer<typeof detailInputAnimatedFormSchema>;
  
export const detailInputIncludingTextFormSchema = z.object({
  usingFont: z.boolean(),
  fontName: z.string().max(64).nullable(),
  fontSource: z.string().max(64).nullable(),
  yomigana: z.string().max(64).nullable(),
}).required();
export type DetailInputIncludingTextFormSchema = z.infer<typeof detailInputIncludingTextFormSchema>;

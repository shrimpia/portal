import { z } from 'zod';

export const detailInputFormSchema = z.object({
  authorInfo: z.string().nullable(),
  comment: z.string().max(500).nullable(),
  agreeToGuideline: z.literal(true),
}).required();
export type DetailInputFormSchema = z.infer<typeof detailInputFormSchema>;

export const detailInputAnimatedFormSchema = z.object({
  doesNotContainExcessiveFlashing: z.literal(true),
}).required();
export type DetailInputAnimatedFormSchema = z.infer<typeof detailInputAnimatedFormSchema>;
  
export const detailInputIncludingTextFormSchema = z.object({
  fontUsage: z.enum(['handwritten', 'font']).nullable(),
  fontName: z.string().max(64).nullable(),
  fontSource: z.string().max(64).nullable(),
  yomigana: z.string().max(64).nullable(),
}).required().superRefine((data, ctx) => {
  if (data.fontUsage !== 'font') return;

  if (!data.fontName) {
    ctx.addIssue({
      path: ['fontName'],
      code: z.ZodIssueCode.custom,
      message: 'フォント名は必須です。',
    });
  }
  if (!data.fontSource) {
    ctx.addIssue({
      path: ['fontSource'],
      code: z.ZodIssueCode.custom,
      message: 'フォントの入手元は必須です。',
    });
  }
});
export type DetailInputIncludingTextFormSchema = z.infer<typeof detailInputIncludingTextFormSchema>;

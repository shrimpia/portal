import type { ComponentPropsWithRef, ReactNode } from 'react';

import { classNames } from '@/util/class-names';

export type TextareaProps = Omit<ComponentPropsWithRef<'textarea'>, 'title'> & {
  title?: ReactNode;
  caption?: ReactNode;
  invalid?: boolean;
};

/**
 * デザインシステムの Textarea (`lu-textarea`)。`className` は外枠の `<label>` に付く。
 */
export const Textarea: React.FC<TextareaProps> = ({ title, caption, invalid, className, ...rest }) => (
  <label className={classNames('lu-textarea', className)}>
    {title && <span className="lu-textarea__title">{title}</span>}
    <textarea aria-invalid={invalid || undefined} {...rest} />
    {caption && <span className="lu-textarea__caption">{caption}</span>}
  </label>
);

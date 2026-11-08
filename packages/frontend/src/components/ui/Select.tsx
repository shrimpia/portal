import type { ComponentPropsWithRef, ReactNode } from 'react';

import { classNames } from '@/util/class-names';

export type SelectProps = Omit<ComponentPropsWithRef<'select'>, 'title'> & {
  title?: ReactNode;
  caption?: ReactNode;
  invalid?: boolean;
};

/**
 * デザインシステムの Select (`lu-select`)。`className` は外枠の `<label>` に付く。
 */
export const Select: React.FC<SelectProps> = ({ title, caption, invalid, className, ...rest }) => (
  <label className={classNames('lu-select', className)}>
    {title && <span className="lu-select__title">{title}</span>}
    <select aria-invalid={invalid || undefined} {...rest} />
    {caption && <span className="lu-select__caption">{caption}</span>}
  </label>
);

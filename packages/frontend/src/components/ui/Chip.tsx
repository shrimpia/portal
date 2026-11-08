import type { HTMLAttributes } from 'react';

import { classNames } from '@/util/class-names';

export type ChipVariant = 'primary' | 'success' | 'warning' | 'danger' | 'dimmed';

export type ChipProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: ChipVariant;
};

/**
 * デザインシステムの Chip (`lu-chip`)。状態やカテゴリを示す小さなラベル。
 */
export const Chip: React.FC<ChipProps> = ({ variant = 'primary', className, ...rest }) => (
  <span className={classNames('lu-chip', `lu-chip--${variant}`, className)} {...rest} />
);

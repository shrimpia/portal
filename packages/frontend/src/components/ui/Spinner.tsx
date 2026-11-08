import type { HTMLAttributes } from 'react';

import { classNames } from '@/util/class-names';

export type SpinnerProps = HTMLAttributes<HTMLSpanElement> & {
  size?: 'md' | 'sm';
  /** 色を周りの文字から受け取る。`primary` の色では見えない場所で使う */
  inherit?: boolean;
};

/**
 * デザインシステムの Spinner (`lu-spinner`)。読み込み中を示す回る輪。
 */
export const Spinner: React.FC<SpinnerProps> = ({ size = 'md', inherit, className, ...rest }) => (
  <span
    role="status"
    aria-label="読み込み中"
    className={classNames('lu-spinner', size === 'sm' && 'lu-spinner--sm', inherit && 'lu-spinner--inherit', className)}
    {...rest}
  />
);

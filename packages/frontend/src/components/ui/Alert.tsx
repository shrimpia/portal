import { css } from '@linaria/core';

import type { HTMLAttributes, ReactNode } from 'react';

import { classNames } from '@/util/class-names';

export type AlertVariant = 'primary' | 'success' | 'warning' | 'danger' | 'info';

export type AlertProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  variant?: AlertVariant;
  /** 太字の見出し */
  title?: ReactNode;
  /** アイコンの class (bootstrap-icons の `bi-info-circle` など) */
  icon?: string;
};

// lu-alert は grid なので、本文は 1 つの要素にまとめて 1 セルに収める
const bodyStyle = css`
  > p {
    margin: 0 0 var(--space-2);
  }
  > :last-child {
    margin-bottom: 0;
  }
`;

/**
 * デザインシステムの Alert (`lu-alert`)。
 */
export const Alert: React.FC<AlertProps> = ({
  variant = 'primary',
  title,
  icon,
  className,
  children,
  ...rest
}) => (
  <div
    className={classNames('lu-alert', variant !== 'primary' && `lu-alert--${variant}`, className)}
    {...rest}
  >
    {icon && (
      <span className="lu-alert__icon" aria-hidden="true">
        <i className={`bi ${icon}`} />
      </span>
    )}
    {title && <strong className="lu-alert__title">{title}</strong>}
    <div className={classNames('lu-alert__body', bodyStyle)}>{children}</div>
  </div>
);

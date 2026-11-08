import type { ComponentPropsWithRef, ElementType } from 'react';

import { classNames } from '@/util/class-names';

export type ButtonVariant = 'default' | 'primary' | 'danger' | 'ghost';

type ButtonOwnProps<T extends ElementType> = {
  /** 描画する要素。リンクにしたいときは `a` や react-router の `Link` を渡す */
  as?: T;
  /** `primary`: 画面の主操作 / `danger`: 取り消せない操作 / `ghost`: 補助的なリンク的操作 */
  variant?: ButtonVariant;
  size?: 'md' | 'sm';
  /** 横幅いっぱいに広げる */
  block?: boolean;
};

export type ButtonProps<T extends ElementType = 'button'> = ButtonOwnProps<T> &
  Omit<ComponentPropsWithRef<T>, keyof ButtonOwnProps<T>>;

/**
 * デザインシステムの Button (`lu-button`)。
 */
export const Button = <T extends ElementType = 'button'>({
  as,
  variant = 'default',
  size = 'md',
  block,
  className,
  ...rest
}: ButtonProps<T>) => {
  const Component: ElementType = as ?? 'button';
  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      {...rest}
      className={classNames(
        'lu-button',
        variant !== 'default' && `lu-button--${variant}`,
        size === 'sm' && 'lu-button--sm',
        block && 'lu-button--block',
        className,
      )}
    />
  );
};

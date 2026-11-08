import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { classNames } from '@/util/class-names';

type ContainerOwnProps<T extends ElementType> = {
  /** 描画する要素 */
  as?: T;
  /** 幅を 1280px まで広げる */
  wide?: boolean;
};

export type ContainerProps<T extends ElementType = 'div'> = ContainerOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ContainerOwnProps<T>>;

/**
 * デザインシステムの Container (`lu-container`)。ページの本文を中央に寄せる列。
 */
export const Container = <T extends ElementType = 'div'>({ as, wide, className, ...rest }: ContainerProps<T>) => {
  const Component: ElementType = as ?? 'div';
  return <Component {...rest} className={classNames('lu-container', wide && 'lu-container--wide', className)} />;
};

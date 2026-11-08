import type { ComponentPropsWithoutRef, ElementType } from 'react';

import { classNames } from '@/util/class-names';

type StackOwnProps<T extends ElementType> = {
  /** 描画する要素 */
  as?: T;
  /** 並べる向き。既定は縦 */
  direction?: 'vertical' | 'horizontal';
  /** 子の間隔。数字は `space-*` トークンの番号 */
  gap?: 1 | 2 | 3 | 4 | 6 | 8 | 12;
  /** 並びと直角の向きの揃え */
  align?: 'start' | 'center' | 'end';
  /** 並びの向きの寄せ */
  justify?: 'center' | 'end' | 'between';
  /** 入りきらなければ折り返す */
  wrap?: boolean;
  /** 行の中に置く(`inline-flex`) */
  inline?: boolean;
};

export type StackProps<T extends ElementType = 'div'> = StackOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof StackOwnProps<T>>;

/**
 * デザインシステムの Stack (`lu-stack`)。子を縦または横に、トークンの間隔で並べる。
 */
export const Stack = <T extends ElementType = 'div'>({
  as,
  direction = 'vertical',
  gap,
  align,
  justify,
  wrap,
  inline,
  className,
  ...rest
}: StackProps<T>) => {
  const Component: ElementType = as ?? 'div';
  return (
    <Component
      {...rest}
      className={classNames(
        'lu-stack',
        direction === 'horizontal' && 'lu-stack--horizontal',
        gap && `lu-stack--gap-${gap}`,
        align && `lu-stack--align-${align}`,
        justify && `lu-stack--justify-${justify}`,
        wrap && 'lu-stack--wrap',
        inline && 'lu-stack--inline',
        className,
      )}
    />
  );
};

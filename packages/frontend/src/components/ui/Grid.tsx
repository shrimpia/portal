import type { HTMLAttributes } from 'react';

import { classNames } from '@/util/class-names';

export type GridProps = HTMLAttributes<HTMLDivElement> & {
  /** 画面が広いときに固定の 2 列にする。指定しなければ、入るだけ列を作る */
  halves?: boolean;
};

/**
 * デザインシステムの Grid (`lu-grid`)。カードやパネルを横に並べる。
 */
export const Grid: React.FC<GridProps> = ({ halves, className, ...rest }) => (
  <div className={classNames('lu-grid', halves && 'lu-grid--halves', className)} {...rest} />
);

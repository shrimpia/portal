import type { ComponentPropsWithRef, HTMLAttributes, ReactNode } from 'react';

import { classNames } from '@/util/class-names';

export type ControlProps = Omit<HTMLAttributes<HTMLDivElement>, 'title'> & {
  /** 外枠の上に出る小さな見出し */
  title?: ReactNode;
  /** 外枠の下に出る説明文。エラーの内容もここに書く */
  caption?: ReactNode;
};

/**
 * デザインシステムの Control (`lu-control`)。凹み(`Well`)を横に並べるための外枠。
 * `title` や `aria-label` で、まとまりの名前を伝える。
 */
export const Control = ({ title, caption, className, children, ...rest }: ControlProps) => (
  <div role="group" className={classNames('lu-control', className)} {...rest}>
    {title && <span className="lu-control__title">{title}</span>}
    <div className="lu-control__body">{children}</div>
    {caption && <span className="lu-control__caption">{caption}</span>}
  </div>
);

/** 凹みの間に置く区切りの文字(`～` など) */
const Separator: React.FC<HTMLAttributes<HTMLSpanElement>> = ({ className, ...rest }) => (
  <span aria-hidden="true" className={classNames('lu-control__sep', className)} {...rest} />
);

Control.Separator = Separator;

export type WellProps = ComponentPropsWithRef<'input'> & {
  /** エラー状態にする */
  invalid?: boolean;
};

/**
 * デザインシステムの Well (`lu-well`)。Textfield の凹みだけ。`Control` の中に並べる。
 */
export const Well: React.FC<WellProps> = ({ invalid, className, ...rest }) => (
  <input aria-invalid={invalid || undefined} className={classNames('lu-well', className)} {...rest} />
);

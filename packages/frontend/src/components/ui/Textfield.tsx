import type { ComponentPropsWithRef, ReactNode } from 'react';

import { classNames } from '@/util/class-names';

export type TextfieldProps = Omit<ComponentPropsWithRef<'input'>, 'title'> & {
  /** 入力欄の上に出る小さな見出し */
  title?: ReactNode;
  /** 入力欄の下に出る説明文。エラー内容もここに書く */
  caption?: ReactNode;
  /** エラー状態にする。タイトル・説明文・文字が `danger` になる */
  invalid?: boolean;
};

/**
 * デザインシステムの Textfield (`lu-textfield`)。`className` は外枠の `<label>` に付く。
 */
export const Textfield: React.FC<TextfieldProps> = ({ title, caption, invalid, className, ...rest }) => (
  <label className={classNames('lu-textfield', className)}>
    {title && <span className="lu-textfield__title">{title}</span>}
    <input aria-invalid={invalid || undefined} {...rest} />
    {caption && <span className="lu-textfield__caption">{caption}</span>}
  </label>
);

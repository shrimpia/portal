import { css } from '@linaria/core';

import type { HTMLAttributes } from 'react';

import { classNames } from '@/util/class-names';

const titleStyle = css`
  margin-bottom: var(--space-1);
  font-size: var(--text-small);
  font-weight: 600;
  line-height: 1.5;
`;

const captionStyle = css`
  margin: 0 0 var(--space-2);
  color: var(--dimmed);
  font-size: var(--text-small);
  line-height: 1.5;
`;

/**
 * 入力欄のまとまり(複数の入力欄やタブ)に付ける小さな見出し。
 * Textfield などが持つ `title` と同じ大きさ・太さ。
 */
export const FieldTitle: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={classNames(titleStyle, className)} {...rest} />
);

/** 入力欄のまとまりに付ける説明文。Textfield などの `caption` と同じ見た目。 */
export const FieldCaption: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({ className, ...rest }) => (
  <p className={classNames(captionStyle, className)} {...rest} />
);

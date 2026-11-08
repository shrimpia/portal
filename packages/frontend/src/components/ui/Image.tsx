import { css } from '@linaria/core';

import type { ComponentPropsWithRef } from 'react';

import { classNames } from '@/util/class-names';

export type ImageProps = ComponentPropsWithRef<'img'> & {
  /** 親の幅を超えないように縮める */
  fluid?: boolean;
  /** 角を丸める */
  rounded?: boolean;
  /** 円形に切り抜く */
  roundedCircle?: boolean;
  /** 暗い地の上に載せる。絵文字など透過画像を、テーマに関わらず同じ背景で確認させたいときに使う */
  backdrop?: boolean;
};

const fluidStyle = css`
  max-width: 100%;
  height: auto;
`;
const roundedStyle = css`
  border-radius: var(--radius-md);
`;
const circleStyle = css`
  border-radius: 50%;
`;
const backdropStyle = css`
  padding: var(--space-2);
  border-radius: var(--radius-md);
  background: #212529;
`;

/**
 * 画像。デザインシステムには含まれないので、portal 側の薄いラッパー。
 */
export const Image: React.FC<ImageProps> = ({ fluid, rounded, roundedCircle, backdrop, className, alt, ...rest }) => (
  <img
    alt={alt}
    className={classNames(fluid && fluidStyle, rounded && roundedStyle, roundedCircle && circleStyle, backdrop && backdropStyle, className)}
    {...rest}
  />
);

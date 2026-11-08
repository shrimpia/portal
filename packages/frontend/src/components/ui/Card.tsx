import { css } from '@linaria/core';

import type { ComponentPropsWithoutRef, ElementType, HTMLAttributes } from 'react';

import { classNames } from '@/util/class-names';

type CardOwnProps<T extends ElementType> = {
  /** 描画する要素。リンクにしたいときは `a` や react-router の `Link` を渡す */
  as?: T;
  /** カード全体がリンク・ボタンのとき。ホバーで浮き上がる */
  link?: boolean;
  /** 記事本文。余白が広がる。`lu-prose` と併用する */
  article?: boolean;
};

export type CardProps<T extends ElementType = 'div'> = CardOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof CardOwnProps<T>>;

const titleStyle = css`
  margin-bottom: var(--space-2);
`;

const textStyle = css`
  margin: 0 0 var(--space-2);
  &:last-child {
    margin-bottom: 0;
  }
`;

const CardRoot = <T extends ElementType = 'div'>({
  as,
  link,
  article,
  className,
  ...rest
}: CardProps<T>) => {
  const Component: ElementType = as ?? 'div';
  return (
    <Component
      {...rest}
      className={classNames('lu-card', link && 'lu-card--link', article && 'lu-card--article', className)}
    />
  );
};

const Title: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ className, ...rest }) => (
  <h5 className={classNames(titleStyle, className)} {...rest} />
);

const Subtitle: React.FC<HTMLAttributes<HTMLHeadingElement>> = ({ className, ...rest }) => (
  <h6 className={classNames(titleStyle, className)} {...rest} />
);

const Text: React.FC<HTMLAttributes<HTMLParagraphElement>> = ({ className, ...rest }) => (
  <p className={classNames(textStyle, className)} {...rest} />
);

/**
 * デザインシステムの Card (`lu-card`)。余白はカード自身が持つので、中身を直接置く。
 */
export const Card = Object.assign(CardRoot, { Title, Subtitle, Text });

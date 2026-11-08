import { css } from '@linaria/core';

/** react-masonry-css の `className`(カラムを横に並べる) */
export const masonryStyle = css`
  display: flex;
  gap: var(--space-4);
`;

/** react-masonry-css の `columnClassName`(カラムの中でカードを縦に並べる) */
export const masonryColumnStyle = css`
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
`;

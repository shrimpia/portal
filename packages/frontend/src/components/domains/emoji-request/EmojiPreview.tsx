import React from 'react';
import { Stack } from 'react-bootstrap';

import type { PropsWithChildren } from 'react';

import './EmojiPreview.scss';

export type EmojiPreviewProps = PropsWithChildren<{
    src: string;
    className?: string;
}>;

export const EmojiPreview: React.FC<EmojiPreviewProps> = ({ src, children, className }) => {
  return (
    <Stack className={`flex-wrap ${className}`} direction="horizontal" gap={2}>
      <div className="sh-preview-container rounded">
        <img src={src} />
      </div>
      <div className="sh-preview-container rounded dark">
        <img src={src} />
      </div>
      {children}
    </Stack>
  );
};

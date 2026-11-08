import React from 'react';

import type { PropsWithChildren } from 'react';

import './EmojiPreview.scss';

import { Stack } from '@/components/ui/Stack';

export type EmojiPreviewProps = PropsWithChildren<{
    src: string;
    className?: string;
}>;

export const EmojiPreview: React.FC<EmojiPreviewProps> = ({ src, children, className }) => {
  return (
    <Stack className={className} direction="horizontal" wrap gap={2}>
      <div className="sh-preview-container">
        <img src={src} />
      </div>
      <div className="sh-preview-container dark">
        <img src={src} />
      </div>
      {children}
    </Stack>
  );
};

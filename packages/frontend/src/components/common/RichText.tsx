import React, { useMemo } from 'react';

import type { HTMLProps } from 'react';

export type RichTextProps = Omit<HTMLProps<HTMLDivElement>, 'className'> & {
    className?: string;
    children: string;
};

export const RichText: React.FC<RichTextProps> = (p) => {
  const inner = useMemo(() => p.children.split('\n').map((line, i) => <div key={i}>{line}</div>), [p.children]);
  return (
    <div {...p}>
      {inner}
    </div>
  );
};

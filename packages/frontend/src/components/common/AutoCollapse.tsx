import { useLayoutEffect, useState } from 'react';
import React from 'react';
import { Button } from 'react-bootstrap';

import type { PropsWithChildren } from 'react';

import './AutoCollapse.scss';

export type AutoCollapseProp = PropsWithChildren<{
    height?: number;
}>;

/**
 * 子要素が指定した高さを超えたら自動的に折り畳むコンポーネント
 */
export const AutoCollapse: React.FC<AutoCollapseProp> = ({ children, height = 112 }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const ref = React.useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (ref.current) {
      setIsCollapsed(ref.current.scrollHeight > height);
    }
  }, [height]);

  return (
    <>
      <div ref={ref} style={{ height: isCollapsed ? height : 'auto', overflow: 'hidden' }} className={isCollapsed ? 'sh-auto-collapse-gradient' : ''}>
        {children}
      </div>
  
      {isCollapsed && (
        <Button variant="secondary" size="sm" onClick={() => setIsCollapsed(!isCollapsed)}>
          もっと見る
        </Button>
      )}
    </>
  );
};

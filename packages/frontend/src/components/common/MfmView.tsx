import { parse, parseSimple } from 'mfm-js';
import { Suspense, useMemo } from 'react';

import { MfmNodeView } from '@/components/common/MfmNodeView';


export type MfmProp = {
    children: string;
    plain?: boolean;
}

export const MfmView = (p: MfmProp) => {
  const forest = useMemo(() => p.plain ? parseSimple(p.children) : parse(p.children), [p.children, p.plain]);

  return (
    <Suspense fallback={<span>...</span>}>
      {forest.map((node, i) => <MfmNodeView node={node} key={i} />)}
    </Suspense>
  );
};

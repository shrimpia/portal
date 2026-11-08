
import type { PropsWithChildren } from 'react';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { URL_SHRIMPIA_PLUS } from '@/consts';

export const OnlyShrimpiaPlus: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Alert className="lu-mb-4" title={<>{children}は、<b>Shrimpia+</b>限定機能です！</>}>
      <p>
        絵文字申請や検索の解禁など、シュリンピアでの生活が豊かになる特典が目白押し！
      </p>
      <p>
        シュリンピアを直接ご支援いただける Shrimpia+ に、よければご参加ください！
      </p>
      <Button as="a" variant="primary" href={URL_SHRIMPIA_PLUS} target="_blank" rel="noreferrer noopener">Shrimpia+ に参加する</Button>
    </Alert>
  );
};

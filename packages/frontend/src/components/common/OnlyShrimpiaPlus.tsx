import { Alert, Button } from 'react-bootstrap';

import type { PropsWithChildren } from 'react';

import { URL_SHRIMPIA_PLUS } from '@/consts';

export const OnlyShrimpiaPlus: React.FC<PropsWithChildren> = ({ children }) => {
  return (
    <Alert>
      <Alert.Heading>{children}は、<b>Shrimpia+</b>限定機能です！</Alert.Heading>
      <p>
        絵文字申請や検索の解禁など、帝国での生活が豊かになる特典が目白押し！
      </p>
      <p>
        シュリンピアを直接ご支援いただける Shrimpia+ に、よければご参加ください！
      </p>
      <Button as="a" variant="warning" href={URL_SHRIMPIA_PLUS} target="_blank" rel="noreferrer noopener">Shrimpia+ に参加する</Button>
    </Alert>
  );
};

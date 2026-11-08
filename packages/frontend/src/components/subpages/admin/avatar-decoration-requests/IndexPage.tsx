import { useAtom } from 'jotai';

import { RequestCard } from '@/components/domains/avatar-decoration-request/admin/RequestCard';
import { Alert } from '@/components/ui/Alert';
import { Switch } from '@/components/ui/Choice';
import { Grid } from '@/components/ui/Grid';
import { adminAvatarDecorationRequestIsShowingTemplateAtom, adminPendingAvatarDecorationRequestsAtom } from '@/states/avatar-decoration-request';
import { URL_AVATAR_DECORATION_REQUEST_GUIDELINES } from '@/consts';
import { useState } from 'react';

export const IndexPage = () => {
  const [{data: pendingList}] = useAtom(adminPendingAvatarDecorationRequestsAtom);

  const [isShowingTemplate, setIsShowingTemplate] = useAtom(adminAvatarDecorationRequestIsShowingTemplateAtom);
  
  return (
    <div>
      <header className="lu-mb-12">
        <h1>アバターデコレーション申請の管理</h1>
        <a href={URL_AVATAR_DECORATION_REQUEST_GUIDELINES} target="_blank" rel="noopener noreferrer">
          <b>アバターデコレーション申請ガイドライン</b>
        </a>
      </header>
      <Switch className="lu-mb-4"
        checked={isShowingTemplate}
        onChange={e => setIsShowingTemplate(e.target.checked)}
      >
        プレビュー画像にテンプレートを表示
      </Switch>
      <Grid>
        {pendingList.map(r => (
          <RequestCard key={r.id} request={r} showPreview={isShowingTemplate} />
        ))}
        {pendingList.length === 0 && (
          <Alert variant="info" icon="bi-info-circle" style={{ gridColumn: '1 / -1' }}>
            処理待ちのアバターデコレーション申請はありません。
          </Alert>
        )}
      </Grid>
    </div>
  );
};
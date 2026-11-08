import { useAtom } from 'jotai';

import { RequestCard } from '@/components/domains/emoji-request/admin/RequestCard';
import { Alert } from '@/components/ui/Alert';
import { Grid } from '@/components/ui/Grid';
import { URL_EMOJI_REQUEST_GUIDELINES } from '@/consts';
import { adminPendingEmojiRequestsAtom } from '@/states/emoji-request';

export const IndexPage = () => {
  const [{data: pendingList}] = useAtom(adminPendingEmojiRequestsAtom);
  return (
    <div>
      <header className="lu-mb-12">
        <h1>絵文字申請の管理</h1>
        <a href={URL_EMOJI_REQUEST_GUIDELINES} target="_blank" rel="noopener noreferrer">
          <b>絵文字申請ガイドライン</b>
        </a>
      </header>
      <Grid>
        {pendingList.map(r => (
          <RequestCard key={r.id} request={r} />
        ))}
        {pendingList.length === 0 && (
          <Alert variant="info" icon="bi-info-circle" style={{ gridColumn: '1 / -1' }}>
            処理待ちの絵文字申請はありません。
          </Alert>
        )}
      </Grid>
    </div>
  );
};

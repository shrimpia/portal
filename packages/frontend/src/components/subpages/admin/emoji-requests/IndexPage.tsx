import { useAtom } from 'jotai';
import { Alert, Col, Row } from 'react-bootstrap';

import { RequestCard } from '@/components/domains/emoji-request/admin/RequestCard';
import { URL_EMOJI_REQUEST_GUIDELINES } from '@/consts';
import { adminPendingEmojiRequestsAtom } from '@/states/emoji-request';

export const IndexPage = () => {
  const [{data: pendingList}] = useAtom(adminPendingEmojiRequestsAtom);
  return (
    <div>
      <header className="mb-5">
        <h1 className="fs-3">絵文字申請の管理</h1>
        <a href={URL_EMOJI_REQUEST_GUIDELINES} target="_blank" rel="noopener noreferrer">
          <b>絵文字申請ガイドライン</b>
        </a>
      </header>
      <Row>
        {pendingList.map(r => (
          <Col key={r.id} xs={12} md={4} lg={3} xl={3} className="g-2">
            <RequestCard request={r} />
          </Col>
        ))}
        {pendingList.length === 0 && (
          <Alert variant="info">
            <i className="bi bi-info-circle" />{' '}
            処理待ちの絵文字申請はありません。
          </Alert>
        )}
      </Row>
    </div>
  );
};

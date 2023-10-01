import { useAtomValue } from 'jotai';
import { Alert, Col, Row } from 'react-bootstrap';

import { RequestCard } from '@/components/domains/emoji-request/admin/RequestCard';
import { adminPendingEmojiRequestsAtom } from '@/states/emoji-request';

export const IndexPage = () => {
  const pendingList = useAtomValue(adminPendingEmojiRequestsAtom);
  return (
    <div>
      <header className="mb-5">
        <h1 className="fs-3">絵文字申請の管理</h1>
        <a href="https://docs.shrimpia.network/a6fe11f1441f4a51912069a218dbc9e9" target="_blank" rel="noopener noreferrer">
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

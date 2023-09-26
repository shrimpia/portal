import { useAtomValue } from 'jotai';
import { Alert, Col, Row } from 'react-bootstrap';

import { adminPendingEmojiRequestsAtom } from '../../../../states/emoji-request';

import { RequestCard } from './RequestCard';

export const EmojiRequestAdminIndex = () => {
  const pendingList = useAtomValue(adminPendingEmojiRequestsAtom);
  return (
    <div>
      <h1 className="fs-3 mb-5">絵文字申請の管理</h1>
      
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

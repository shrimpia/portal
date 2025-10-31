import { useAtom } from 'jotai';
import { Alert, Col, Row } from 'react-bootstrap';

import { RequestCard } from '@/components/domains/avatar-decoration-request/admin/RequestCard';
import { adminPendingAvatarDecorationRequestsAtom } from '@/states/avatar-decoration-request';
import { URL_AVATAR_DECORATION_REQUEST_GUIDELINES } from '@/consts';

export const IndexPage = () => {
  const [{data: pendingList}] = useAtom(adminPendingAvatarDecorationRequestsAtom);
  
  return (
    <div>
      <header className="mb-5">
        <h1 className="fs-3">アバターデコレーション申請の管理</h1>
        <a href={URL_AVATAR_DECORATION_REQUEST_GUIDELINES} target="_blank" rel="noopener noreferrer">
          <b>アバターデコレーション申請ガイドライン</b>
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
            処理待ちのアバターデコレーション申請はありません。
          </Alert>
        )}
      </Row>
    </div>
  );
};
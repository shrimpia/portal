import { useAtomValue } from 'jotai';
import { Card, Col, Container, Image, Row, Stack } from 'react-bootstrap';


import { emojiRequestsAtom } from '../../../states/emoji-request';
import { RichText } from '../../views/RichText';
import { UserLinkView } from '../../views/UserLinkView';

import { StatusBadge } from './StatusBadge';

import type { PropsWithChildren } from 'react';

export type RequestsListProp = PropsWithChildren;

export const RequestsList: React.FC<RequestsListProp> = ({ children }) => {
  const requests = useAtomValue(emojiRequestsAtom);

  return requests.length > 0 ? (
    <Container>
      <Row>
        {requests.map(r => (
          <Col key={r.id} xs={12} sm={6} md={4} lg={3} className="g-3">
            <Card>
              <Card.Body className="overflow-hidden">
                <Card.Title>:{r.name}:</Card.Title>
                <Stack direction="vertical" className="align-items-start" gap={3}>
                  <StatusBadge status={r.status} />
                  <Image src={r.url} alt={r.name} className="bg-dark rounded p-2" style={{ height: 48 }} />
                  <div>
                    <h2 className="fs-6 fw-bold">申請者</h2>
                    <UserLinkView username={r.username} />
                  </div>
                  <div>
                    <h2 className="fs-6 fw-bold">申請コメント</h2>
                    {r.comment.trim() ? (
                      <RichText className="text-muted border-start px-2 mb-0">{r.comment}</RichText>
                    ) : (
                      <div className="text-muted">なし</div>
                    )}
                  </div>
                  {r.staffComment && (
                    <div>
                      <h2 className="fs-6 fw-bold">スタッフからのコメント</h2>
                      <RichText className="text-muted border-start px-2 mb-0">{r.staffComment}</RichText>
                    </div>
                  )}
                </Stack>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  ) : children;
};

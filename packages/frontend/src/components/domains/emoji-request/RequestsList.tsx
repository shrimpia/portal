import { useAtomValue } from 'jotai';
import groupBy from 'lodash.groupby';
import { useMemo, type PropsWithChildren } from 'react';
import { Card, Col, Container, Image, Row, Stack } from 'react-bootstrap';


import { emojiRequestsAtom } from '../../../states/emoji-request';
import { RichText } from '../../views/RichText';
import { UserLinkView } from '../../views/UserLinkView';

import { StatusBadge } from './StatusBadge';


export type RequestsListProp = PropsWithChildren;

export const RequestsList: React.FC<RequestsListProp> = ({ children }) => {
  const requests = useAtomValue(emojiRequestsAtom);

  const grouped = useMemo(() => groupBy(requests, r => r.createdYear * 100 + r.createdMonth), [requests]);
  const groupKeys = useMemo(() => Object.keys(grouped).sort((a, b) => Number(b) - Number(a)), [grouped]);

  return groupKeys.length > 0 ? (
    <Container>
      {groupKeys.map(key => (
        <>
          <Row className="mb-5" key={key}>
            <h3>{grouped[key][0].createdYear}年{grouped[key][0].createdMonth}月</h3>
            <p className="text-muted">{grouped[key].length}件の申請</p>
            {grouped[key].map(r => (
              <Col key={r.id} xs={12} sm={6} md={4} lg={4} xl={3} className="g-3">
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
        </>
      ))}
    </Container>
  ) : children;
};

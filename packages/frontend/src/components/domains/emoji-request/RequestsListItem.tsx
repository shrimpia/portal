import { Card, Image, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { StatusBadge } from './StatusBadge';

import type { EmojiRequest } from '@/types/emoji-request';

import { MfmView } from '@/components/common/MfmView';
import { UserLinkView } from '@/components/common/UserLinkView';

export type RequestsListItemProps = {
    request: EmojiRequest;
};

const lineClampStyle: React.CSSProperties = {
  display: '-webkit-box',
  WebkitLineClamp: 3,
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
};

export const RequestsListItem: React.FC<RequestsListItemProps> = ({ request }) => {
  return (
    <Card as={Link} to={`/emoji-request/${request.id}`} className="text-decoration-none text-body">
      <Card.Body className="overflow-hidden">
        <Card.Title>:{request.name}:</Card.Title>
        <Stack direction="vertical" className="align-items-start position-relative" gap={3}>
          <StatusBadge status={request.status} />
          <Image src={request.url} alt={request.name} className="bg-dark rounded p-2" style={{ height: 48 }} />
          <div>
            <h2 className="fs-6 fw-bold">申請者</h2>
            <UserLinkView username={request.username} />
          </div>
          <div>
            <h2 className="fs-6 fw-bold">申請コメント</h2>
            {request.comment.trim() ? (
              <div className="text-muted border-start px-2 mb-0" style={lineClampStyle}><MfmView>{request.comment}</MfmView></div>
            ) : (
              <div className="text-muted">なし</div>
            )}
          </div>
          {request.staffComment && (
            <div>
              <h2 className="fs-6 fw-bold">スタッフからのコメント</h2>
              <div className="text-muted border-start px-2 mb-0" style={lineClampStyle}><MfmView>{request.staffComment}</MfmView></div>
            </div>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
};

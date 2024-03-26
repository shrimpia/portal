import { Card, Image, Stack } from 'react-bootstrap';

import { StatusBadge } from './StatusBadge';

import type { EmojiRequest } from '@/types/emoji-request';

import { AutoCollapse } from '@/components/common/AutoCollapse';
import { MfmView } from '@/components/common/MfmView';
import { UserLinkView } from '@/components/common/UserLinkView';

export type RequestsListItemProps = {
    request: EmojiRequest;
};

export const RequestsListItem: React.FC<RequestsListItemProps> = ({ request }) => {
  return (
    <Card>
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
              <AutoCollapse>
                <div className="text-muted border-start px-2 mb-0"><MfmView>{request.comment}</MfmView></div>
              </AutoCollapse>
            ) : (
              <div className="text-muted">なし</div>
            )}
          </div>
          {request.staffComment && (
            <div>
              <h2 className="fs-6 fw-bold">スタッフからのコメント</h2>
              <AutoCollapse>
                <div className="text-muted border-start px-2 mb-0"><MfmView>{request.staffComment}</MfmView></div>
              </AutoCollapse>
            </div>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
};

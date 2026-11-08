import { Link } from 'react-router-dom';

import { StatusBadge } from './StatusBadge';

import type { EmojiRequest } from '@/types/emoji-request';

import { MfmView } from '@/components/common/MfmView';
import { UserLinkView } from '@/components/common/UserLinkView';
import { Card } from '@/components/ui/Card';
import { Image } from '@/components/ui/Image';
import { Stack } from '@/components/ui/Stack';

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
    <Card as={Link} to={`/emoji-request/${request.id}`} link style={{ overflow: "hidden" }}>
      <Card.Title>:{request.name}:</Card.Title>
      <Stack align="start" style={{ position: "relative" }} gap={4}>
        <StatusBadge status={request.status} />
        <Image src={request.url} alt={request.name} backdrop style={{ height: 48 }} />
        <div>
          <h6>申請者</h6>
          <UserLinkView username={request.username} />
        </div>
        <div>
          <h6>申請コメント</h6>
          {request.comment.trim() ? (
            <blockquote className="lu-m-0" style={lineClampStyle}><MfmView>{request.comment}</MfmView></blockquote>
          ) : (
            <div className="lu-text-dimmed">なし</div>
          )}
        </div>
        {request.staffComment && (
          <div>
            <h6>スタッフからのコメント</h6>
            <blockquote className="lu-m-0" style={lineClampStyle}><MfmView>{request.staffComment}</MfmView></blockquote>
          </div>
        )}
      </Stack>
    </Card>
  );
};

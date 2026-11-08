
import { StatusBadge } from './StatusBadge';

import type { AvatarDecorationRequest } from '@/types/avatar-decoration-request';

import { AutoCollapse } from '@/components/common/AutoCollapse';
import { MfmView } from '@/components/common/MfmView';
import { UserLinkView } from '@/components/common/UserLinkView';
import { Card } from '@/components/ui/Card';
import { Image } from '@/components/ui/Image';
import { Stack } from '@/components/ui/Stack';

export type RequestsListItemProps = {
    request: AvatarDecorationRequest;
};

export const RequestsListItem: React.FC<RequestsListItemProps> = ({ request }) => {
  return (
    <Card style={{ overflow: "hidden" }}>
      <Card.Title>{request.name}</Card.Title>
      <Stack align="start" style={{ position: "relative" }} gap={4}>
        <StatusBadge status={request.status} />
        <Image src={request.url} alt={request.name} backdrop style={{ height: 128, width: 128 }} />
        <div>
          <h6>申請者</h6>
          <UserLinkView username={request.username} />
        </div>
        {request.description && (
          <div>
            <h6>説明</h6>
            <AutoCollapse>
              <blockquote className="lu-m-0"><MfmView>{request.description}</MfmView></blockquote>
            </AutoCollapse>
          </div>
        )}
        {request.staffComment && (
          <div>
            <h6>スタッフからのコメント</h6>
            <AutoCollapse>
              <blockquote className="lu-m-0"><MfmView>{request.staffComment}</MfmView></blockquote>
            </AutoCollapse>
          </div>
        )}
      </Stack>
    </Card>
  );
};
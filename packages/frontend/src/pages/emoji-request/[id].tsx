import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { AutoCollapse } from '@/components/common/AutoCollapse';
import { MfmView } from '@/components/common/MfmView';
import { UserLinkView } from '@/components/common/UserLinkView';
import { ParsedCommentView } from '@/components/domains/emoji-request/ParsedCommentView';
import { StatusBadge } from '@/components/domains/emoji-request/StatusBadge';
import { Container } from '@/components/ui/Container';
import { Image } from '@/components/ui/Image';
import { Stack } from '@/components/ui/Stack';
import { currentRequestIdAtom, publicCurrentEmojiRequestAtom } from '@/states/emoji-request';

const EmojiRequestDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const setCurrentRequestId = useSetAtom(currentRequestIdAtom);
  const [{ data: request }] = useAtom(publicCurrentEmojiRequestAtom);

  useEffect(() => {
    setCurrentRequestId(id ?? null);
  }, [id, setCurrentRequestId]);

  if (!request) {
    return (
      <Container>
        <p className="lu-text-dimmed">申請が見つかりませんでした。</p>
      </Container>
    );
  }

  return (
    <Container>
      <Stack align="start" gap={4}>
        <Image src={request.url} alt={request.name} backdrop style={{ height: 64 }} />
        <div>
          <ParsedCommentView comment={request.comment} customData={[{
            label: '絵文字コード',
            icon: 'bi-code',
            value: <code>:{request.name}:</code>,
          }, {
            label: 'ステータス',
            icon: 'bi-info-circle',
            value: <StatusBadge status={request.status} />,
          }, {
            icon: 'bi-person-circle',
            label: '申請者',
            value: <UserLinkView username={request.username} />,
          }]} />
        </div>
        {request.staffComment && (
          <div>
            <h6>スタッフからのコメント</h6>
            <AutoCollapse>
              <blockquote className="lu-m-0"><MfmView>{request.staffComment}</MfmView></blockquote>
            </AutoCollapse>
          </div>
        )}
      </Stack>
    </Container>
  );
};

export default EmojiRequestDetailPage;

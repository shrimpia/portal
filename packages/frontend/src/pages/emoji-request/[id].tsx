import { useAtom, useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { Container, Image, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { AutoCollapse } from '@/components/common/AutoCollapse';
import { MfmView } from '@/components/common/MfmView';
import { UserLinkView } from '@/components/common/UserLinkView';
import { ParsedCommentView } from '@/components/domains/emoji-request/ParsedCommentView';
import { StatusBadge } from '@/components/domains/emoji-request/StatusBadge';
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
        <p className="text-muted">申請が見つかりませんでした。</p>
      </Container>
    );
  }

  return (
    <Container>
      <Stack direction="vertical" className="align-items-start" gap={3}>
        <Image src={request.url} alt={request.name} className="bg-dark rounded p-2" style={{ height: 64 }} />
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
            <h2 className="fs-6 fw-bold">スタッフからのコメント</h2>
            <AutoCollapse>
              <div className="text-muted border-start px-2"><MfmView>{request.staffComment}</MfmView></div>
            </AutoCollapse>
          </div>
        )}
      </Stack>
    </Container>
  );
};

export default EmojiRequestDetailPage;

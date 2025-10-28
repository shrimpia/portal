import { useAtom } from 'jotai';
import { Suspense } from 'react';
import { Button, Container, Nav, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { LoadingView } from '@/components/common/LoadingView';
import { OnlyShrimpiaPlus } from '@/components/common/OnlyShrimpiaPlus';
import { AvatarDecorationRequestsList } from '@/components/domains/avatar-decoration-request/RequestsList';
import { useLoginGuard } from '@/hooks/useLoginGuard';
import { filterAtom } from '@/states/avatar-decoration-request';
import { userAtom } from '@/states/user';

const AvatarDecorationRequestPage = () => {
  useLoginGuard();
  const [{data: user}] = useAtom(userAtom);
  const [filter, setFilter] = useAtom(filterAtom);

  const isShrimpiaPlus = user && user.shrimpiaPlus !== 'not-member';

  return (
    <Container>
      <h1 className="fs-3 mb-4">
        アバターデコレーションの申請
      </h1>
      <p>
        シュリンピアで利用できるアバターデコレーションを、あなたも作って申請しましょう！<br/>
        スタッフによる審査がありますが、あなたの作成した画像でアイコンを楽しくデコってみませんか？
      </p>
      <p>
        デコレーションを作成・申請する前に、必ずガイドラインをお読みください！<br/>
        <a href="https://docs.shrimpia.network/avatar-decoration-guideline" target="_blank" rel="noopener noreferrer">
          <b>アバターデコレーション申請ガイドライン</b>
        </a>
      </p>
      {!isShrimpiaPlus && (
        <OnlyShrimpiaPlus>アバターデコレーションの申請</OnlyShrimpiaPlus>
      )}
      <Stack className="mb-3" direction="horizontal" gap={3}>
        {user && isShrimpiaPlus ? (
          <Button as={Link as any} to="/avatar-decoration-request/new" className="fw-bold">
            <i className="bi bi-plus" /> 申請する
          </Button>
        ) : (
          <Button disabled className="fw-bold" variant="secondary">
            <i className="bi bi-plus" /> 申請する
          </Button>
        )}
        {user?.canManageCustomEmojis && (
          <Button as={Link as any} to="/admin/avatar-decoration-requests" variant="outline-primary">
            <i className="bi bi-gear-fill" /> 管理…
          </Button>
        )}
      </Stack>
      <Nav variant="underline" className="mb-3" activeKey={filter} onSelect={key => setFilter(key as 'mine' | 'all')}>
        <Nav.Item>
          <Nav.Link eventKey="mine">
            自分の申請
          </Nav.Link>
        </Nav.Item>
        <Nav.Item>
          <Nav.Link eventKey="all">
            みんなの申請
          </Nav.Link>
        </Nav.Item>
      </Nav>
      <Suspense fallback={<LoadingView />}>
        <AvatarDecorationRequestsList>
          まだアバターデコレーションを申請していません。
        </AvatarDecorationRequestsList>
      </Suspense>
    </Container>
  );
};

export default AvatarDecorationRequestPage;
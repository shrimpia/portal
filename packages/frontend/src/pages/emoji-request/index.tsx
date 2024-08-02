
import { useAtom, useAtomValue } from 'jotai';
import { Suspense } from 'react';
import { Button, Container, Nav, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { LoadingView } from '@/components/common/LoadingView';
import { OnlyShrimpiaPlus } from '@/components/common/OnlyShrimpiaPlus';
import { RequestsList } from '@/components/domains/emoji-request/RequestsList';
import { filterAtom } from '@/states/emoji-request';
import { userAtom } from '@/states/user';

const EmojiRequestPage = () => {
  const user = useAtomValue(userAtom);
  const [filter, setFilter] = useAtom(filterAtom);

  const isShrimpiaPlus = user && user.shrimpiaPlus !== 'not-member';

  return (
    <Container>
      <h1 className="fs-3 mb-4">
        カスタム絵文字のリクエスト
      </h1>
      <p>
        シュリンピア帝国で利用できるカスタム絵文字を、あなたも作って申請しましょう！<br/>
        スタッフによる審査がありますが、好きな言葉や自分の絵をカスタム絵文字として使えるようになるチャンスです！
      </p>
      <p>
        絵文字を作成・申請する前に、必ずガイドラインをお読みください！<br/>
        <a href="https://docs.shrimpia.network/a6fe11f1441f4a51912069a218dbc9e9" target="_blank" rel="noopener noreferrer">
          <b>絵文字申請ガイドライン</b>
        </a>
      </p>
      {!isShrimpiaPlus && (
        <OnlyShrimpiaPlus>カスタム絵文字のリクエスト</OnlyShrimpiaPlus>
      )}
      <Stack className="mb-3" direction="horizontal" gap={3}>
        {user && isShrimpiaPlus ? (
          <Button as={Link as any} to="/emoji-request/new" className="fw-bold">
            <i className="bi bi-plus" /> 申請する
          </Button>
        ) : (
          <Button disabled className="fw-bold" variant="secondary">
            <i className="bi bi-plus" /> 申請する
          </Button>
        )}
        {user?.canManageCustomEmojis && (
          <Button as={Link as any} to="/admin/emoji-requests" variant="outline-primary">
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
        <RequestsList>
          まだ絵文字を申請していません。
        </RequestsList>
      </Suspense>
    </Container>
  );
};

export default EmojiRequestPage;

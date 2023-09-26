
import { useAtom, useAtomValue } from 'jotai';
import { Suspense } from 'react';
import { Button, Container, Nav, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { RequestsList } from '../../components/domains/emoji-request/RequestsList';
import { LoadingView } from '../../components/views/LoadingView';
import { OnlyShrimpiaPlus } from '../../components/views/OnlyShrimpiaPlus';
import { filterAtom } from '../../states/emoji-request';
import { userAtom } from '../../states/user';

const EmojiRequestPage = () => {
  const user = useAtomValue(userAtom);
  const [filter, setFilter] = useAtom(filterAtom);

  const isShrimpiaPlus = user && user.shrimpiaPlus !== 'not-member';

  return (
    <Container>
      <h1 className="fs-3 mb-4">
        カスタム絵文字の追加申請
      </h1>
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
      {!isShrimpiaPlus && (
        <OnlyShrimpiaPlus>絵文字申請機能</OnlyShrimpiaPlus>
      )}
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

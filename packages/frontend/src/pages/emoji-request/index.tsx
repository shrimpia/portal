
import { useAtom } from 'jotai';
import { Alert, Button, Container, Nav, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { OnlyShrimpiaPlus } from '@/components/common/OnlyShrimpiaPlus';
import { RequestsList } from '@/components/domains/emoji-request/RequestsList';
import { URL_EMOJI_REQUEST_GUIDELINES, URL_SHRIMPIA_PLUS } from '@/consts';
import { filterAtom } from '@/states/emoji-request';
import { remainingEmojiRequestLimitAtom, userAtom } from '@/states/user';
import { useLoginGuard } from '@/hooks/useLoginGuard';
import { isEmojiStaff } from '@/services/is-staff';

const EmojiRequestPage = () => {
  useLoginGuard();
  const [{data: user}] = useAtom(userAtom);
  const [{data: limit}] = useAtom(remainingEmojiRequestLimitAtom);
  const [filter, setFilter] = useAtom(filterAtom);

  const isShrimpiaPlus = user && user.shrimpiaPlus !== 'not-member';

  return (
    <Container>
      <h1 className="fs-3 mb-4">
        カスタム絵文字の追加申請
      </h1>
      <p>
        シュリンピアで利用できるカスタム絵文字を、あなたも作って申請しましょう！<br/>
        スタッフによる審査がありますが、好きな言葉や自分の絵をカスタム絵文字として使えるようになるチャンスです！
      </p>
      <p>
        絵文字を作成・申請する前に、必ずガイドラインをお読みください！<br/>
        <a href={URL_EMOJI_REQUEST_GUIDELINES} target="_blank" rel="noopener noreferrer">
          <b>絵文字申請ガイドライン</b>
        </a>
      </p>
      {!isShrimpiaPlus && (limit === 0 ? (
        <OnlyShrimpiaPlus>カスタム絵文字の追加申請</OnlyShrimpiaPlus>
      ) : (
        <Alert variant="info">
          <Alert.Heading>いまだけ絵文字追加をお試し！</Alert.Heading>
          <p>今月に限り、Shrimpia+限定機能である絵文字申請を1件だけお試しいただけます！</p>
          <p>Shrimpia+に参加して、より多くの絵文字を申請しましょう！</p>
          <Button as="a" variant="warning" href={URL_SHRIMPIA_PLUS} target="_blank" rel="noreferrer noopener">Shrimpia+ に参加する</Button>
        </Alert>
      ))}
      <Stack className="mb-3" direction="horizontal" gap={3}>
        {user && (limit > 0) ? (
          <Button as={Link as any} to="/emoji-request/new" className="fw-bold">
            <i className="bi bi-plus" /> 申請する （残り{isEmojiStaff(user!) ? '∞' : limit}件）
          </Button>
        ) : (
          <Button disabled className="fw-bold" variant="secondary">
            <i className="bi bi-plus" /> 申請可能数がありません
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
      <RequestsList>
        まだ絵文字を申請していません。
      </RequestsList>
    </Container>
  );
};

export default EmojiRequestPage;

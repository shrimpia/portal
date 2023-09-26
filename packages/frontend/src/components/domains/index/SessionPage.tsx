import { useAtomValue } from 'jotai';
import { Container, Stack } from 'react-bootstrap';

import { isStaff } from '../../../services/is-staff';
import { userAtom } from '../../../states/user';
import { LinkCard } from '../../views/LinkCard';

export const SessionPage = () => {
  const user = useAtomValue(userAtom);
  return user ? (
    <Container>
      <h1 className="fs-3 mb-5">おかえりなさい、{`${user.username}`}さん。</h1>
      <Stack direction="vertical" gap={3}>
        <LinkCard
          title="カスタム絵文字の追加申請"
          to="/emoji-request"
          icon="bi bi-magic">
          シュリンピア帝国に、新しくカスタム絵文字の追加を申請できます。
        </LinkCard>
        {/* <LinkCard
          title="投書箱"
          to="/mailbox"
          icon="bi bi-mailbox2">
          おこまりのことはありませんか？皇帝にメッセージを送れます。<br/>
          メッセージは匿名にできるので、安心してご利用ください。
        </LinkCard>
        <LinkCard
          title="アカウント削除リクエスト"
          to="/delete-request"
          icon="bi bi-heartbreak-fill">
          アカウントの削除をスタッフへ申請できます。
        </LinkCard> */}
        {isStaff(user) && (
          <LinkCard
            title="帝国職員向けページ"
            to="/admin"
            icon="bi bi-speedometer">
            管理機能を備えた、帝国職員向けのページです。
          </LinkCard>
        )}
      </Stack>
    </Container>
  ) : null;
};

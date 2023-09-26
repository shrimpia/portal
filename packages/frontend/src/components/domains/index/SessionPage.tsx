import { useAtomValue } from 'jotai';
import { Col, Container, Row, Stack } from 'react-bootstrap';

import { isStaff } from '../../../services/is-staff';
import { userAtom } from '../../../states/user';
import { LinkCard } from '../../views/LinkCard';
import { LinkCardExternal } from '../../views/LinkCardExternal';

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
        <h2 className="fs-4 mt-5">
          その他のリンク
        </h2>
        <Row>
          <Col xs={12} md={6}>
            <LinkCardExternal
              title="シュリンピア帝国"
              to="https://mk.shrimpia.network"
              icon="bi bi-globe">
          シュリンピア帝国 Misskeyサーバー。
            </LinkCardExternal>
          </Col>
          <Col xs={12} md={6}>
            <LinkCardExternal
              title="国立図書館 (Wiki)"
              to="https://wiki.shrimpia.network"
              icon="bi bi-book">
              人気ネタから便利な情報まで、みんなで編集しよう。
            </LinkCardExternal>
          </Col>
        </Row>
        <Row>
          <Col xs={12} md={6}>
            <LinkCardExternal
              title="国立公園 (Discord)"
              to="https://discord.gg/zBq2acPPKC"
              icon="bi bi-discord">
          メンバー同士で、通話やチャットを楽しもう。<br/>
          緊急メンテナンス時のお知らせとしても利用しています。
            </LinkCardExternal>
          </Col>
          <Col xs={12} md={6}>
            <LinkCardExternal
              title="Shrimpia+"
              to="https://shrimpia.fanbox.cc/"
              icon="bi bi-patch-plus-fill">
          Shrimpia+に参加しませんか？<br/>
          様々な便利機能を手に入れ、運営を支援しましょう。
            </LinkCardExternal>
          </Col>
        </Row>
      </Stack>
    </Container>
  ) : null;
};

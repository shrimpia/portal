import { useAtomValue } from 'jotai';
import { Col, Container, Row } from 'react-bootstrap';

import { LinkCard } from '@/components/common/LinkCard';
import { LinkCardExternal } from '@/components/common/LinkCardExternal';
import { MfmView } from '@/components/common/MfmView';
import { isStaff } from '@/services/is-staff';
import { userAtom } from '@/states/user';

export const IndexSessionPage = () => {
  const user = useAtomValue(userAtom);
  return user ? (
    <Container>
      <h1 className="fs-3 mb-5">おかえりなさい、<MfmView>{user.name || user.username}</MfmView>さん。</h1>
      <Row className="gx-3 gy-3">
        <Col xs={12} xl={6}>
          <LinkCard
            title="カスタム絵文字の追加申請"
            to="/emoji-request"
            icon="bi bi-magic">
              シュリンピア帝国に、新しくカスタム絵文字の追加を申請できます。
          </LinkCard>
        </Col>
        {/* <Col xs={12} xl={6}>
          <LinkCard
            title="サポート"
            to="#"
            icon="bi bi-question-circle">
            coming soon!
          </LinkCard>
        </Col>
        <Col xs={12} xl={6}>
          <LinkCard
            title="アカウント削除リクエスト"
            to="#"
            icon="bi bi-heartbreak-fill">
            coming soon!
          </LinkCard>
        </Col> */}
        {isStaff(user) && (
          <Col xs={12} xl={6}>
            <LinkCard
              title="Staff Portal"
              to="/admin"
              icon="bi bi-speedometer">
              帝国の運営関係者向けのポータルです。
            </LinkCard>
          </Col>
        )}
      </Row>
      <h2 className="fs-4 mt-5">
          その他のリンク
      </h2>
      <Row className="gx-3 gy-3">
        <Col xs={12} xl={6}>
          <LinkCardExternal
            title="シュリンピア帝国"
            to="https://mk.shrimpia.network"
            icon="bi bi-globe">
          シュリンピア帝国 Misskeyサーバー。
          </LinkCardExternal>
        </Col>
        <Col xs={12} xl={6}>
          <LinkCardExternal
            title="国立図書館 (Wiki)"
            to="https://wiki.shrimpia.network"
            icon="bi bi-book">
              人気ネタから便利な情報まで、みんなで編集しよう。
          </LinkCardExternal>
        </Col>
        <Col xs={12} xl={6}>
          <LinkCardExternal
            title="国立公園 (Discord)"
            to="https://discord.gg/zBq2acPPKC"
            icon="bi bi-discord">
          メンバー同士で、通話やチャットを楽しもう。<br/>
          緊急メンテナンス時のお知らせとしても利用しています。
          </LinkCardExternal>
        </Col>
        <Col xs={12} xl={6}>
          <LinkCardExternal
            title="Shrimpia+"
            to="https://shrimpia.fanbox.cc/"
            icon="bi bi-patch-plus-fill">
          Shrimpia+に参加しませんか？<br/>
          様々な便利機能を手に入れ、運営を支援しましょう。
          </LinkCardExternal>
        </Col>
      </Row>
    </Container>
  ) : null;
};

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
            title="カスタム絵文字のリクエスト"
            to="/emoji-request"
            icon="bi bi-magic">
              シュリンピア帝国に、新しくカスタム絵文字の追加を申請できます。<br/>申請にはShrimpia+への参加が必要です。
          </LinkCard>
        </Col>
        <Col xs={12} xl={6}>
          <LinkCard
            title="イベントカレンダー"
            to="/events"
            icon="bi bi-calendar-event">
            帝国で開催されるイベントを確認しましょう。<br/>入国から1ヶ月経つと、イベントを追加できます！
          </LinkCard>
        </Col>
        {/* <Col xs={12} xl={6}>
          <LinkCard
            title="サポート"
            to="#"
            icon="bi bi-question-circle">
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
          シュリンピア帝国 Misskeyサーバー。<br/>
          入国者募集中！
          </LinkCardExternal>
        </Col>
        <Col xs={12} xl={6}>
          <LinkCardExternal
            title="Shrimpia Park (Discord)"
            to="https://go.shrimpia.network/discord"
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

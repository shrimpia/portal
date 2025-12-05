import { useAtom } from 'jotai';
import { Col, Container, Row } from 'react-bootstrap';

import { LinkCard } from '@/components/common/LinkCard';
import { LinkCardExternal } from '@/components/common/LinkCardExternal';
import { MfmView } from '@/components/common/MfmView';
import { URL_DISCORD, URL_DOCS, URL_MISSKEY, URL_SHRIMPIA_PLUS } from '@/consts';
import { isEmojiStaff } from '@/services/is-staff';
import { userAtom } from '@/states/user';

export const IndexSessionPage = () => {
  const [{data: user}] = useAtom(userAtom);
  return user ? (
    <Container>
      <h1 className="fs-3 mb-5 text-center">おかえりなさい、<MfmView>{user.name || user.username}</MfmView>さん。</h1>
      <Row className="gx-3 gy-3">
        <Col xs={12} xl={6}>
          <LinkCard
            title="カスタム絵文字の追加申請"
            to="/emoji-request"
            icon="bi bi-magic">
              シュリンピアに、新しくカスタム絵文字の追加を申請できます。<br/>申請にはShrimpia+への参加が必要です。
          </LinkCard>
        </Col>
        <Col xs={12} xl={6}>
          <LinkCard
            title="アバターデコレーションの申請（ベータ）"
            to="/avatar-decoration-request"
            icon="bi bi-stars">
            アイコンを楽しく着飾る、デコレーションを申請しましょう。<br/>申請にはShrimpia+への参加が必要です。
          </LinkCard>
        </Col>
        <Col xs={12} xl={6}>
          <LinkCard
            title="イベントカレンダー"
            to="/events"
            icon="bi bi-calendar-event">
            シュリンピアで開催されるイベントを確認しましょう。<br/>入国から1ヶ月経つと、イベントを追加できます！
          </LinkCard>
        </Col>
        <Col xs={12} xl={6}>
          <LinkCard
            title="Shrimpia Minecraft"
            to="/minecraft-auth"
            icon="bi bi-box">
            シュリンピアのMinecraftサーバーに入るための認証はこちらから。
          </LinkCard>
        </Col>
        {isEmojiStaff(user) && (
          <Col xs={12} xl={6}>
            <LinkCard
              title="Staff Portal"
              to="/admin"
              icon="bi bi-speedometer">
              シュリンピアの運営関係者向けのポータルです。
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
            title="Misskey サーバー"
            to={URL_MISSKEY}
            icon="bi bi-globe">
            シュリンピアでの会話を楽しめるMisskeyサーバー。<br/>
            好きなことを語ろう。
          </LinkCardExternal>
        </Col>
        <Col xs={12} xl={6}>
          <LinkCardExternal
            title="Discord サーバー"
            to={URL_DISCORD}
            icon="bi bi-discord">
            メンバー同士で、通話やチャットを楽しもう。<br/>
            緊急メンテナンス時のお知らせ場でもあります。
          </LinkCardExternal>
        </Col>
        <Col xs={12} xl={6}>
          <LinkCardExternal
            title="ドキュメント"
            to={URL_DOCS}
            icon="bi bi-file-earmark-text">
            シュリンピアのガイドラインを含む重要な情報や、<br/>
            世界観資料があります。
          </LinkCardExternal>
        </Col>
        <Col xs={12} xl={6}>
          <LinkCardExternal
            title="Shrimpia+"
            to={URL_SHRIMPIA_PLUS}
            icon="bi bi-patch-plus-fill">
            Shrimpia+に参加しませんか？<br/>
            様々な便利機能を手に入れ、運営を支援しましょう。
          </LinkCardExternal>
        </Col>
      </Row>
    </Container>
  ) : null;
};

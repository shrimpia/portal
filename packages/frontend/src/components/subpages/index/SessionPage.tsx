import { useAtom } from 'jotai';

import { LinkCard } from '@/components/common/LinkCard';
import { LinkCardExternal } from '@/components/common/LinkCardExternal';
import { MfmView } from '@/components/common/MfmView';
import { Container } from '@/components/ui/Container';
import { Grid } from '@/components/ui/Grid';
import { URL_DISCORD, URL_DOCS, URL_MISSKEY, URL_SHRIMPIA_PLUS } from '@/consts';
import { isEmojiStaff } from '@/services/is-staff';
import { userAtom } from '@/states/user';

export const IndexSessionPage = () => {
  const [{data: user}] = useAtom(userAtom);
  return user ? (
    <Container>
      <h1 className="lu-mb-12 lu-text-center">おかえりなさい、<MfmView>{user.name || user.username}</MfmView>さん。</h1>
      <Grid halves>
          <LinkCard
            title="カスタム絵文字の追加申請"
            to="/emoji-request"
            icon="bi bi-magic">
              シュリンピアに、新しくカスタム絵文字の追加を申請できます。<br/>申請にはShrimpia+への参加が必要です。
          </LinkCard>
          <LinkCard
            title="アバターデコレーションの申請（ベータ）"
            to="/avatar-decoration-request"
            icon="bi bi-stars">
            アイコンを楽しく着飾る、デコレーションを申請しましょう。<br/>申請にはShrimpia+への参加が必要です。
          </LinkCard>
          <LinkCard
            title="イベントカレンダー"
            to="/events"
            icon="bi bi-calendar-event">
            シュリンピアで開催されるイベントを確認しましょう。<br/>入国から1ヶ月経つと、イベントを追加できます！
          </LinkCard>
          <LinkCard
            title="Shrimpia Minecraft"
            to="/minecraft-auth"
            icon="bi bi-box">
            シュリンピアのMinecraftサーバーに入るための認証はこちらから。
          </LinkCard>
        {isEmojiStaff(user) && (
            <LinkCard
              title="Staff Portal"
              to="/admin"
              icon="bi bi-speedometer">
              シュリンピアの運営関係者向けのポータルです。
            </LinkCard>
        )}
      </Grid>
      <h2 className="lu-mt-12">
          その他のリンク
      </h2>
      <Grid halves>
          <LinkCardExternal
            title="Misskey サーバー"
            to={URL_MISSKEY}
            icon="bi bi-globe">
            シュリンピアでの会話を楽しめるMisskeyサーバー。<br/>
            好きなことを語ろう。
          </LinkCardExternal>
          <LinkCardExternal
            title="Discord サーバー"
            to={URL_DISCORD}
            icon="bi bi-discord">
            メンバー同士で、通話やチャットを楽しもう。<br/>
            緊急メンテナンス時のお知らせ場でもあります。
          </LinkCardExternal>
          <LinkCardExternal
            title="ドキュメント"
            to={URL_DOCS}
            icon="bi bi-file-earmark-text">
            シュリンピアのガイドラインを含む重要な情報や、<br/>
            世界観資料があります。
          </LinkCardExternal>
          <LinkCardExternal
            title="Shrimpia+"
            to={URL_SHRIMPIA_PLUS}
            icon="bi bi-patch-plus-fill">
            Shrimpia+に参加しませんか？<br/>
            様々な便利機能を手に入れ、運営を支援しましょう。
          </LinkCardExternal>
      </Grid>
    </Container>
  ) : null;
};

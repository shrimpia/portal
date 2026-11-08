import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';

import { TokenOutdatedBanner } from './TokenOutdatedBanner';

import shrimpia from '@/assets/shrimpia.svg';
import { Image } from '@/components/ui/Image';
import { Menu } from '@/components/ui/Menu';
import { Spinner } from '@/components/ui/Spinner';
import { SHRIMPIA_PLUS_PLAN_NAMES, URL_SHRIMPIA_PLUS } from '@/consts';
import { tokenAtom } from '@/states/sessions';
import { userAtom } from '@/states/user';

import './AppHeader.scss';

export const UserMenuButton: React.FC = () => {
  const [{data: user}] = useAtom(userAtom);
  const setToken = useSetAtom(tokenAtom);

  const logout = () => {
    setToken(null);
    location.href = '/';
  };

  return user && (
    <Menu
      className="lu-ms-auto"
      aria-label="ユーザーメニュー"
      label={
        <>
          <Image src={user.avatarUrl} alt="" width="24" height="24" roundedCircle />
          <span className="lu-text-bold">@{user.username}</span>
        </>
      }
    >
      <Menu.Item as={Link} to="/settings">
        <i className="bi bi-gear-fill" /> 設定
      </Menu.Item>
      {import.meta.env.DEV && (
        <Menu.Item as={Link} to="/debug">
          <i className="bi bi-bug-fill" /> デバッグ
        </Menu.Item>
      )}
      <Menu.Item danger onClick={logout}>
        <i className="bi bi-power" /> ログアウト
      </Menu.Item>
      <Menu.Divider />
      <Menu.Text>
        <b>@{user.username}</b><br/>
        {user.shrimpiaPlus !== 'not-member' ? (
          <>
            <span>{SHRIMPIA_PLUS_PLAN_NAMES[user.shrimpiaPlus]}</span><br/>
            <a className="lu-text-dimmed" href={URL_SHRIMPIA_PLUS} target="_blank" rel="noreferrer noopener">プランを変更…</a>
          </>
        ) : (
          <a className="lu-text-dimmed" href={URL_SHRIMPIA_PLUS} target="_blank" rel="noreferrer noopener">Shrimpia+ に参加…</a>
        )}
      </Menu.Text>
    </Menu>
  );
};

export const AppHeader: React.FC = () => {
  const token = useAtomValue(tokenAtom);
  return token ? (
    <>
      <header className="lu-navbar lu-navbar--fixed">
        <div className="lu-navbar__inner">
          <Link className="lu-navbar__brand" to="/">
            <img src={shrimpia} alt="Shrimpia" />
            <span className="sh-portal-text">
              Portal {import.meta.env.DEV ? '(開発版)' : ''}
            </span>
          </Link>
          <Suspense fallback={<Spinner size="sm" className="lu-ms-auto" />}>
            <UserMenuButton />
          </Suspense>
        </div>
      </header>
      {/* 固定のヘッダーの下に、通知バナーを置く */}
      <div style={{ paddingTop: 'var(--size-navbar)' }}>
        <Suspense fallback={null}>
          <TokenOutdatedBanner />
        </Suspense>
      </div>
    </>
  ) : null;
};

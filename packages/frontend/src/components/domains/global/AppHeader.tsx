import { useAtomValue, useSetAtom } from 'jotai';
import React, { Suspense } from 'react';
import { Container, Dropdown, Navbar, Spinner, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import shrimpia from '../../../assets/shrimpia.svg';
import { SHRIMPIA_PLUS_PLAN_NAMES, URL_SHRIMPIA_PLUS } from '../../../consts';
import { tokenAtom } from '../../../states/sessions';
import { userAtom } from '../../../states/user';

import './AppHeader.scss';

export const UserMenuButton: React.FC = () => {
  const user = useAtomValue(userAtom);
  const setToken = useSetAtom(tokenAtom);

  const logout = () => {
    setToken(null);
  };

  return user && (
    <Dropdown>
      <Dropdown.Toggle variant="dark" className="d-flex align-items-center" data-bs-display="static">
        <Stack className="d-inline-flex px-1" direction="horizontal" gap={3}>
          <img src={user.avatarUrl} alt={user.username} width="32" height="32" className="rounded-circle" />
          <div className="text-start fw-bold">
            @{user.username}
          </div>
        </Stack>
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item as={Link} to="/settings">
          <i className="bi bi-gear-fill" /> 設定
        </Dropdown.Item>
        {import.meta.env.DEV && (
          <Dropdown.Item as={Link} to="/debug">
            <i className="bi bi-bug-fill" /> デバッグ
          </Dropdown.Item>
        )}
        <Dropdown.Item className="text-danger" as="button" onClick={logout}>
          <i className="bi bi-power" /> ログアウト
        </Dropdown.Item>
        <Dropdown.Divider />
        <Dropdown.ItemText className="text-secondary">
          <b>@{user.username}</b><br/>
          {user.shrimpiaPlus !== 'not-member' ? (
            <>
              <span className="fs-small">{SHRIMPIA_PLUS_PLAN_NAMES[user.shrimpiaPlus]}</span><br/>
              <a className="fs-small text-secondary" href={URL_SHRIMPIA_PLUS} target="_blank" rel="noreferrer noopener">プランを変更…</a>
            </>
          ) : (
            <a className="fs-small text-secondary" href={URL_SHRIMPIA_PLUS} target="_blank" rel="noreferrer noopener">Shrimpia+ に参加…</a>
          )}
        </Dropdown.ItemText>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export const AppHeader: React.FC = () => {
  const token = useAtomValue(tokenAtom);
  return token ? (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" sticky="top" className="mb-5">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img src={shrimpia} alt="Shrimpia" width="32" height="32" className="d-inline-block align-top" />
          <span className="sh-portal-text">
            {' '}
            Portal
          </span>
        </Navbar.Brand>
        <Suspense fallback={<Spinner variant="primary" size="sm" />}>
          <UserMenuButton />
        </Suspense>
      </Container>
    </Navbar>
  ) : null;
};

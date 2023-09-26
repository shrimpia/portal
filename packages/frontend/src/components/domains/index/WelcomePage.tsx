import { useCallback } from 'react';
import { Button, Stack } from 'react-bootstrap';
import { v4 as uuid } from 'uuid';

import './WelcomePage.scss';

import shrimpia from '../../../assets/shrimpia.svg';
import { URL_EMPIRE } from '../../../consts';

export const WelcomePage = () => {
  const login = useCallback(() => {
    const sessionId = uuid();
    const query = new URLSearchParams();
    query.set('name', 'シュリンピアポータル');
    query.set('callback', `${location.origin}/miauth`);
    query.set('permission', 'read:account');
    const url = `${URL_EMPIRE}/miauth/${sessionId}?${query.toString()}`;
    location.href = url;
  }, []);

  return (
    <Stack gap={3} direction="vertical" className="min-vw-100 min-vh-100 justify-content-center align-items-center">
      <h1 className="sh-app-title">
        <img src={shrimpia} className="sh-icon-shrimpia-planet" />
        シュリンピアポータル
      </h1>
      <Button variant="primary" size="lg" onClick={login}>
        シュリンピア帝国でログイン
      </Button>
    </Stack>
  );
};

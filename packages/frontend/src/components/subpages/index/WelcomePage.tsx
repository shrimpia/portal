import { useCallback, useEffect, useState } from 'react';
import { Button, Stack } from 'react-bootstrap';

import shrimpia from '@/assets/shrimpia.svg';
import { navigateToMiAuth } from '@/services/navigate-to-miauth';

import './WelcomePage.scss';

export const IndexWelcomePage = () => {
  const [error, setError] = useState('');
  
  // クエリにエラーメッセージが含まれていれば表示
  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const error = query.get('error');
    if (error) {
      setError(error);
      location.search = '';
    }
  }, []);

  const login = useCallback(() => {
    navigateToMiAuth();
  }, []);

  return (
    <Stack gap={3} direction="vertical" className="min-vw-100 min-vh-100 justify-content-center align-items-center">
      {error && <div className="text-danger px-2 py-1 bg-dark">{error}</div>}
      <h1 className="sh-app-title">
        <img src={shrimpia} className="sh-icon-shrimpia-planet" />
        シュリンピアポータル
      </h1>
      <Button variant="primary" size="lg" onClick={login}>
        Misskeyでログイン
      </Button>
    </Stack>
  );
};

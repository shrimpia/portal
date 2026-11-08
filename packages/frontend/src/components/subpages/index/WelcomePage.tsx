import { useCallback, useEffect, useState } from 'react';

import shrimpia from '@/assets/shrimpia.svg';
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Stack } from '@/components/ui/Stack';
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
    <Stack gap={4} justify="center" align="center" style={{ minWidth: "100vw", minHeight: "100vh" }}>
      {error && <Alert variant="danger">{error}</Alert>}
      <h1 className="sh-app-title">
        <img src={shrimpia} className="sh-icon-shrimpia-planet" />
        シュリンピアポータル
      </h1>
      <Button variant="primary" onClick={login}>
        Misskeyでログイン
      </Button>
    </Stack>
  );
};

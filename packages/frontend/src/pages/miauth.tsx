import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Card, Container, Spinner } from 'react-bootstrap';

import { useQuery } from '@/hooks/useQuery';
import { useAPI } from '@/services/api';
import { tokenAtom } from '@/states/sessions';

const MiAuthPage = () => {
  const q = useQuery();
  const api = useAPI();
  const setToken = useSetAtom(tokenAtom);
  
  const session = q.get('session');
  const callbackTo = q.get('callback_to');

  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;

    (() => {
      if (!session) {
        setError('session not found');
        return;
      }
      if (ignore) return;

      api.miauth(session).then(({ token }) => {
        setToken(token);
        location.href = callbackTo ?? '/';
      }).catch((err) => {
        setError(err.message);
      });
    })();

    return () => {
      ignore = true;
    };
  }, [api, session, setToken]);

  return (
    <Container className="my-4">
      {error ? (
        <>
          <h1>エラーが発生しました</h1>
          <Card>
            <Card.Body>
              {error}
            </Card.Body>
          </Card>
        </>
      ) : (
        <>
          <h1>ログイン処理中です。</h1>
          <p>これには時間がかかる場合があります。<br />ブラウザを閉じずに、そのままお待ちください。</p>
          <Spinner variant="primary" />
        </>
      )}
    </Container>
  );
};

export default MiAuthPage;

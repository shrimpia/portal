import { useSetAtom } from 'jotai';
import { useEffect, useState } from 'react';
import { Card, Container, Spinner } from 'react-bootstrap';

import { useQuery } from '@/hooks/useQuery';
import { useAPI } from '@/services/api';
import { MIAUTH_SESSION_STORAGE_KEY } from '@/services/navigate-to-miauth';
import { tokenAtom } from '@/states/sessions';

/**
 * callback_to をポータル内の相対パスに正規化する。別オリジンや javascript: などの不正な値は '/' にする。
 */
const resolveCallback = (raw: string | null) => {
  if (!raw) return '/';
  try {
    const url = new URL(raw, location.origin);
    return url.origin === location.origin ? url.pathname + url.search + url.hash : '/';
  } catch {
    return '/';
  }
};

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

      // 自分が開始したログインでなければ中断する（第三者のセッションでのログインを防ぐ）
      if (session !== sessionStorage.getItem(MIAUTH_SESSION_STORAGE_KEY)) {
        setError('ログインセッションが一致しません。もう一度ログインしてください。');
        return;
      }

      api.miauth(session).then(({ token }) => {
        sessionStorage.removeItem(MIAUTH_SESSION_STORAGE_KEY);
        setToken(token);
        location.href = resolveCallback(callbackTo);
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

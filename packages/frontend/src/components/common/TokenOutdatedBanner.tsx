import { useAtom, useSetAtom } from 'jotai';
import { Alert, Button } from 'react-bootstrap';

import { tokenAtom } from '@/states/sessions';
import { userAtom } from '@/states/user';

export const TokenOutdatedBanner: React.FC = () => {
  const [{data: user}] = useAtom(userAtom);
  const setToken = useSetAtom(tokenAtom);

  const logout = () => {
    setToken(null);
  };

  return !user || user.misskeyTokenVersion >= 2 ? null : (
    <Alert variant="warning" className="rounded-0 border-0">
      トークンのバージョンが古い為、一部の機能がご利用いただけません。再度ログインしていただくと解消されます。
      <Button variant="link" className="p-0" onClick={logout}>ログアウトする</Button>
    </Alert>
  );
};

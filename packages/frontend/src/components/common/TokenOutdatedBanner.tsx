import { useAtom, useSetAtom } from 'jotai';

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { tokenAtom } from '@/states/sessions';
import { userAtom } from '@/states/user';

export const TokenOutdatedBanner: React.FC = () => {
  const [{data: user}] = useAtom(userAtom);
  const setToken = useSetAtom(tokenAtom);

  const logout = () => {
    setToken(null);
    location.href = '/';
  };

  return !user || user.misskeyTokenVersion >= 2 ? null : (
    <Alert variant="warning" style={{ borderRadius: 0 }}>
      トークンのバージョンが古い為、一部の機能がご利用いただけません。再度ログインしていただくと解消されます。
      <Button variant="ghost" onClick={logout}>ログアウトする</Button>
    </Alert>
  );
};

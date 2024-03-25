
import { useAtomValue } from 'jotai';
import React, { useEffect } from 'react';
import { Container, Image } from 'react-bootstrap';

import type { PropsWithChildren } from 'react';

import ebifurai from '@/assets/ebifurai.jpg';
import { userAtom } from '@/states/user';

export type AdminContainerProps = PropsWithChildren<{
  mode: 'emoji' | 'police' | 'emperor' | 'staff';
}>;

export const AdminContainer: React.FC<AdminContainerProps> = ({ mode, children }) => {
  const user = useAtomValue(userAtom);

  const allowedRoleName = mode === 'emperor' ? '皇帝': mode === 'emoji' ? '絵文字庁職員' : mode === 'police' ? '警察' : '職員';
  const isAllowed = user && (user.isEmperor || (mode === 'emoji' && user.canManageCustomEmojis) || (mode === 'staff' && (user.canManageCustomEmojis /* || user.isModerator */)));

  // ユーザーが非ログインであればトップページに飛ばす
  useEffect(() => {
    if (!user) {
      const urlEncodedErrorMessage = encodeURIComponent('ログインが必要です。');
      window.location.href = `/?error=${urlEncodedErrorMessage}`;
    }
  }, [user]);

  return (
    <Container>
      {isAllowed ? children : (
        <>
          <h1>{allowedRoleName}以外の立ち入りを禁止します。</h1>
          <p>
            本ページは{allowedRoleName}のみがアクセスできます。<br />
            無理に入ろうとしたらどうなるか、<span className="text-primary"><b>わかってるよね？</b></span>
          </p>
          <Image src={ebifurai} alt="エビフライの刑" fluid />
        </>
      )}
    </Container>
  );
};

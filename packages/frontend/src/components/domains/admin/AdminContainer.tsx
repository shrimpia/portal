
import { useAtom } from 'jotai';
import React, { useMemo } from 'react';
import { Alert, Container } from 'react-bootstrap';

import type { PropsWithChildren } from 'react';

import { userAtom } from '@/states/user';
import { useLoginGuard } from '@/hooks/useLoginGuard';
import { Session } from '@/types/session';

export const roles = {
  emoji: {
    name: '絵文字の管理',
    check: (user: Session) => user.canManageCustomEmojis,
  },
  'avatarDeco': {
    name: 'アバターデコレーションの管理',
    check: (user: Session) => user.canManageAvatarDecorations,
  },
  moderator: {
    name: 'モデレーター',
    check: (user: Session) => user.isModerator,
  },
  admin: {
    name: '管理者',
    check: (user: Session) => user.isEmperor,
  },
  staff: {
    name: 'スタッフ',
    check: (user: Session) => user.canManageCustomEmojis || user.canManageAvatarDecorations || user.isModerator || user.isEmperor,
  },
} as const;

export type AdminContainerProps = PropsWithChildren<{
  mode: keyof typeof roles;
}>;

export const AdminContainer: React.FC<AdminContainerProps> = ({ mode, children }) => {
  const [{data: user}] = useAtom(userAtom);
  useLoginGuard();

  const allowedRoleName = useMemo(() => roles[mode].name, [mode]);
  const isAllowed = user && (user.isEmperor || (roles[mode]?.check(user) ?? false));

  return (
    <Container>
      {isAllowed ? children : (
        <Alert variant="danger">
          <Alert.Heading>権限がありません。</Alert.Heading>
          <p>
            本ページの閲覧には、<strong>{allowedRoleName}</strong> 権限が必要です。<br/>
            スタッフにも関わらず権限が付与されていない場合は、お手数ですが管理者までお問い合わせください。
          </p>
        </Alert>
      )}
    </Container>
  );
};

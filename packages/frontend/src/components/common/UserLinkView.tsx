import { css } from '@linaria/core';
import { Suspense } from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';

import { Image } from '@/components/ui/Image';
import { Stack } from '@/components/ui/Stack';
import { URL_EMPIRE } from '@/consts';
import { fetchUser } from '@/services/fetch-user';
import { classNames } from '@/util/class-names';

const avatarSize = css`
  width: 24px;
  height: 24px;
  border-radius: 50%;
`;

const placeholderStyle = css`
  display: inline-block;
  background: var(--divider);
`;

const glowStyle = css`
  animation: sh-glow 1.5s ease-in-out infinite;
`;

const Inner: React.FC<{ username?: string | null, host?: string | null }> = ({ username }) => {
  // TODO: リモートユーザーに対応させる
  const { data } = useSuspenseQuery({
    queryKey: [username],
    queryFn: async ({ queryKey }) => {
      return await fetchUser(queryKey[0] as string);
    },
  });
  
  return data && 'error' in data ? (
    <Stack inline className="lu-text-dimmed" direction="horizontal" gap={2}>
      <span className={classNames(avatarSize, placeholderStyle)} />
      <div className="lu-text-start">不明</div>
    </Stack>
  ) : data ? (
    <Stack as="a" href={`${URL_EMPIRE}/@${data.username}`} target="_blank" rel="noopener noreferrer" inline direction="horizontal" gap={2} style={{ verticalAlign: 'bottom' }}>
      <Image src={data.avatarUrl} alt={data.username} width="24" height="24" roundedCircle />
      <span className="lu-text-start lu-text-bold">
        {data.username}
      </span>
    </Stack>
  ) : null;
};

const loading = (
  <Stack inline className="lu-text-dimmed" direction="horizontal" gap={2}>
    <span className={classNames(avatarSize, placeholderStyle, glowStyle)} />
    <div className="lu-text-start">......</div>
  </Stack>
);

export const UserLinkView: React.FC<{ username?: string | null, host?: string | null }> = (p) => {
  return (
    <Suspense fallback={loading}>
      <Inner {...p} />
    </Suspense>
  );
};

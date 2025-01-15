import { Suspense } from 'react';
import { Placeholder, Stack } from 'react-bootstrap';
import { useSuspenseQuery } from '@tanstack/react-query';

import { URL_EMPIRE } from '@/consts';
import { fetchUser } from '@/services/fetch-user';

const Inner: React.FC<{ username?: string | null, host?: string | null }> = ({ username }) => {
  // TODO: リモートユーザーに対応させる
  const { data } = useSuspenseQuery({
    queryKey: [username],
    queryFn: async ({ queryKey }) => {
      return await fetchUser(queryKey[0] as string);
    },
  });
  
  return data && 'error' in data ? (
    <Stack className="text-muted d-inline-flex" direction="horizontal" gap={2}>
      <Placeholder style={{ width: 24, height: 24 }} className="rounded-circle" />
      <div className="text-start">不明</div>
    </Stack>
  ) : data ? (
    <Stack as="a" href={`${URL_EMPIRE}/@${data.username}`} target="_blank" rel="noopener noreferrer" className="d-inline-flex align-bottom" direction="horizontal" gap={2}>
      <img src={data.avatarUrl} alt={data.username} width="24" height="24" className="rounded-circle" />
      <span className="text-start fw-bold">
        {data.username}
      </span>
    </Stack>
  ) : null;
};

const loading = (
  <Stack className="text-muted d-inline-flex" direction="horizontal" gap={2}>
    <Placeholder animation="glow" style={{ width: 24, height: 24 }} className="rounded-circle" />
    <div className="text-start">......</div>
  </Stack>
);

export const UserLinkView: React.FC<{ username?: string | null, host?: string | null }> = (p) => {
  return (
    <Suspense fallback={loading}>
      <Inner {...p} />
    </Suspense>
  );
};

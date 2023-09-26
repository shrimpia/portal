import { Placeholder, Stack } from 'react-bootstrap';
import { useQuery } from 'react-query';

import { URL_EMPIRE } from '../../consts';

import type { MisskeyUser } from '../../types/misskey-user';

const fetchUser = async (username: string) => {
  const res = await fetch(`${URL_EMPIRE}/api/users/show`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username }),
  });
  return await res.json() as MisskeyUser | { error: any };
};

export const UserLinkView: React.FC<{ username?: string | null }> = ({ username }) => {
  const { data } = useQuery({
    queryKey: [username],
    queryFn: async ({ queryKey }) => {
      return await fetchUser(queryKey[0] as string);
    },
    suspense: true,
  });
  
  return data && 'error' in data ? (
    <Stack className="text-muted d-inline-flex" direction="horizontal" gap={2}>
      <Placeholder style={{ width: 24, height: 24 }} className="rounded-circle" />
      <div className="text-start">不明</div>
    </Stack>
  ) : data ? (
    <Stack as="a" href={`${URL_EMPIRE}/@${data.username}`} target="_blank" rel="noopener noreferrer" className="d-inline-flex" direction="horizontal" gap={2}>
      <img src={data.avatarUrl} alt={data.username} width="24" height="24" className="rounded-circle" />
      <div className="text-start fw-bold">
        {data.username}
      </div>
    </Stack>
  ) : null;
};

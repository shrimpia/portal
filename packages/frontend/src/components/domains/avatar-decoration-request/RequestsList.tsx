import { useAtom } from 'jotai';
import groupBy from 'lodash.groupby';
import { useMemo, type PropsWithChildren } from 'react';
import { Container } from 'react-bootstrap';
import Masonry from 'react-masonry-css';

import { RequestsListItem } from './RequestsListItem';

import { avatarDecorationRequestsAtom } from '@/states/avatar-decoration-request';


export type RequestsListProp = PropsWithChildren;

export const AvatarDecorationRequestsList: React.FC<RequestsListProp> = ({ children }) => {
  const [{data: requests}] = useAtom(avatarDecorationRequestsAtom);

  const grouped = useMemo(() => groupBy(requests, r => r.createdYear * 100 + r.createdMonth), [requests]);
  const groupKeys = useMemo(() => Object.keys(grouped).sort((a, b) => Number(b) - Number(a)), [grouped]);

  return groupKeys.length > 0 ? (
    <Container>
      {groupKeys.map(key => (
        <article key={key}>
          <h3>{grouped[key][0].createdYear}年{grouped[key][0].createdMonth}月</h3>
          <p className="text-muted">{grouped[key].length}件の申請</p>
          <Masonry breakpointCols={{
            default: 4,
            992: 2,
            1200: 3,
            768: 1,
          }} className="d-flex gap-3 mb-3" columnClassName="d-flex flex-column gap-3">
            {grouped[key].map(r => <RequestsListItem request={r} key={r.id} />)}
          </Masonry>
        </article>
      ))}
    </Container>
  ) : children;
};
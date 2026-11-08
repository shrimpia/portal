import { useAtom } from 'jotai';
import groupBy from 'lodash.groupby';
import { useMemo, type PropsWithChildren } from 'react';
import Masonry from 'react-masonry-css';

import { RequestsListItem } from './RequestsListItem';

import { Container } from '@/components/ui/Container';
import { avatarDecorationRequestsAtom } from '@/states/avatar-decoration-request';
import { masonryColumnStyle, masonryStyle } from '@/components/common/masonry';

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
          <p className="lu-text-dimmed">{grouped[key].length}件の申請</p>
          <Masonry breakpointCols={{
            default: 4,
            992: 2,
            1200: 3,
            768: 1,
          }} className={`${masonryStyle} lu-mb-4`} columnClassName={masonryColumnStyle}>
            {grouped[key].map(r => <RequestsListItem request={r} key={r.id} />)}
          </Masonry>
        </article>
      ))}
    </Container>
  ) : children;
};
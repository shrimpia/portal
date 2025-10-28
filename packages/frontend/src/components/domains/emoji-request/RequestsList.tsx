import { useAtom } from 'jotai';
import groupBy from 'lodash.groupby';
import { useMemo, useEffect, useRef, type PropsWithChildren } from 'react';
import { Button, Container, Spinner } from 'react-bootstrap';
import Masonry from 'react-masonry-css';

import { RequestsListItem } from './RequestsListItem';

import { emojiRequestsAtom } from '@/states/emoji-request';


export type RequestsListProp = PropsWithChildren;

export const RequestsList: React.FC<RequestsListProp> = ({ children }) => {
  const [{data, fetchNextPage, hasNextPage, isFetching}] = useAtom(emojiRequestsAtom);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  console.log(data?.pages);

  const requests = useMemo(() => data ? data.pages.flat() : [], [data]);

  const grouped = useMemo(() => groupBy(requests, r => r.createdYear * 100 + r.createdMonth), [requests]);
  const groupKeys = useMemo(() => Object.keys(grouped).sort((a, b) => Number(b) - Number(a)), [grouped]);

  useEffect(() => {
    if (!hasNextPage || isFetching) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, [hasNextPage, isFetching, fetchNextPage]);

  return groupKeys.length > 0 ? (
    <Container>
      {groupKeys.map((key, i) => (
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
      {hasNextPage && (
        <div ref={loadMoreRef} className="text-center mb-4">
          <Button variant="outline-primary" onClick={() => fetchNextPage()}>
            {isFetching ? <Spinner variant="dark" size="sm" /> : 'もっと読み込む'}
          </Button>
        </div>
      )}
    </Container>
  ) : children;
};

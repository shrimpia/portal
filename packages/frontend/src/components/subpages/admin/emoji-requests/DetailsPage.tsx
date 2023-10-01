import { useAtomValue } from 'jotai';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { RequestCard } from '@/components/domains/emoji-request/admin/RequestCard';
import { adminCurrentEmojiRequestAtom } from '@/states/emoji-request';

export const DetailsPage = () => {
  const item = useAtomValue(adminCurrentEmojiRequestAtom);
  return item ? (
    <>
      <Button as={Link as any} to="/admin/emoji-requests" className="mb-3" variant="outline-primary">
        <i className="bi bi-arrow-left" /> 一覧に戻る
      </Button>
      <RequestCard details request={item} />
    </>
  ) : null;
};

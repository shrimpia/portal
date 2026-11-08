import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';

import { RequestCard } from '@/components/domains/emoji-request/admin/RequestCard';
import { Button } from '@/components/ui/Button';
import { adminCurrentEmojiRequestAtom } from '@/states/emoji-request';

export const DetailsPage = () => {
  const [{data: item}] = useAtom(adminCurrentEmojiRequestAtom);
  return item ? (
    <>
      <Button as={Link} to="/admin/emoji-requests" className="lu-mb-4" variant="ghost">
        <i className="bi bi-arrow-left" /> 一覧に戻る
      </Button>
      <RequestCard details request={item} />
    </>
  ) : null;
};

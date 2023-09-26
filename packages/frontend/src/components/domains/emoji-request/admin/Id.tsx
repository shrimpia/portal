import { useAtomValue } from 'jotai';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { adminCurrentEmojiRequestAtom } from '../../../../states/emoji-request';

import { RequestCard } from './RequestCard';

export const EmojiRequestAdminId = () => {
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

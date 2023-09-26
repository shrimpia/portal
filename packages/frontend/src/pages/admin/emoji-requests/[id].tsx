
import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router';

import { AdminContainer } from '../../../components/domains/admin/AdminContainer';
import { EmojiRequestAdminId } from '../../../components/domains/emoji-request/admin/Id';
import { currentRequestIdAtom } from '../../../states/emoji-request';

const AdminEmojiRequestsIndexPage = () => {
  const id = useParams<{ id: string }>().id;
  const setCurrentRequestId = useSetAtom(currentRequestIdAtom);

  useEffect(() => {
    setCurrentRequestId(id ?? null);
  }, [id, setCurrentRequestId]);

  return (
    <AdminContainer mode="emoji">
      <EmojiRequestAdminId />
    </AdminContainer>
  );
};
export default AdminEmojiRequestsIndexPage;

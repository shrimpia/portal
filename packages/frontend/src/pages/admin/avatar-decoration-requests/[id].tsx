import { useSetAtom } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router';

import { AdminContainer } from '@/components/domains/admin/AdminContainer';
import { DetailsPage } from '@/components/subpages/admin/avatar-decoration-requests/DetailsPage';
import { currentRequestIdAtom } from '@/states/avatar-decoration-request';

const AdminAvatarDecorationRequestsDetailsPage = () => {
  const id = useParams<{ id: string }>().id;
  const setCurrentRequestId = useSetAtom(currentRequestIdAtom);

  useEffect(() => {
    setCurrentRequestId(id ?? null);
  }, [id, setCurrentRequestId]);

  return (
    <AdminContainer mode="emoji">
      <DetailsPage />
    </AdminContainer>
  );
};

export default AdminAvatarDecorationRequestsDetailsPage;
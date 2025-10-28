import { useAtom } from 'jotai';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { RequestCard } from '@/components/domains/avatar-decoration-request/admin/RequestCard';
import { adminCurrentAvatarDecorationRequestAtom } from '@/states/avatar-decoration-request';

export const DetailsPage = () => {
  const [{data: item}] = useAtom(adminCurrentAvatarDecorationRequestAtom);
  
  return item ? (
    <>
      <Button as={Link as any} to="/admin/avatar-decoration-requests" className="mb-3" variant="outline-primary">
        <i className="bi bi-arrow-left" /> 一覧に戻る
      </Button>
      <RequestCard details request={item} />
    </>
  ) : null;
};
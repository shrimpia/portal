import { AdminContainer } from '@/components/domains/admin/AdminContainer';
import { IndexPage } from '@/components/subpages/admin/avatar-decoration-requests/IndexPage';

const AdminAvatarDecorationRequestsIndexPage = () => {
  return (
    <AdminContainer mode="emoji">
      <IndexPage />
    </AdminContainer>
  );
};

export default AdminAvatarDecorationRequestsIndexPage;
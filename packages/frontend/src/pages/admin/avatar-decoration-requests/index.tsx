import { AdminContainer } from '@/components/domains/admin/AdminContainer';
import { IndexPage } from '@/components/subpages/admin/avatar-decoration-requests/IndexPage';

const AdminAvatarDecorationRequestsIndexPage = () => {
  return (
    <AdminContainer mode="avatarDeco">
      <IndexPage />
    </AdminContainer>
  );
};

export default AdminAvatarDecorationRequestsIndexPage;
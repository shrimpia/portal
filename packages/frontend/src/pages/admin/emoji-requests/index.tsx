
import { AdminContainer } from '../../../components/domains/admin/AdminContainer';
import { EmojiRequestAdminIndex } from '../../../components/domains/emoji-request/admin/Index';

const AdminEmojiRequestsIndexPage = () => {
  return (
    <AdminContainer mode="emoji">
      <EmojiRequestAdminIndex />
    </AdminContainer>
  );
};
export default AdminEmojiRequestsIndexPage;

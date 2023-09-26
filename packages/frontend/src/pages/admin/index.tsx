import { useAtomValue } from 'jotai';
import { Stack } from 'react-bootstrap';

import { AdminContainer } from '../../components/domains/admin/AdminContainer';
import { LinkCard } from '../../components/views/LinkCard';
import { userAtom } from '../../states/user';


const IndexPage = () => {
  const user = useAtomValue(userAtom);
  return user ? (
    <AdminContainer mode="staff">
      <h1 className="fs-3 mb-5">Staff Portal</h1>
      <Stack direction="vertical" gap={3}>
        <LinkCard
          title="絵文字申請の管理"
          to="/admin/emoji-requests"
          icon="bi bi-magic">
          処理待ちの絵文字申請を一覧表示します。<br/>
        </LinkCard>
      </Stack>
    </AdminContainer>
  ) : null;
};

export default IndexPage;

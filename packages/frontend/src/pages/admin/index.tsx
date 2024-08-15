import { useAtomValue } from 'jotai';
import { Stack } from 'react-bootstrap';

import { LinkCard } from '@/components/common/LinkCard';
import { AdminContainer } from '@/components/domains/admin/AdminContainer';
import { userAtom } from '@/states/user';

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
        <LinkCard
          title="ヒントの管理"
          to="/admin/hints"
          icon="bi bi-lightbulb">
          ヒントの追加・編集・削除を行います。<br/>
        </LinkCard>
      </Stack>
    </AdminContainer>
  ) : null;
};

export default IndexPage;

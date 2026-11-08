import { useAtom } from 'jotai';
import { Link } from 'react-router-dom';

import { RequestCard } from '@/components/domains/avatar-decoration-request/admin/RequestCard';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Choice';
import { adminAvatarDecorationRequestIsShowingTemplateAtom, adminCurrentAvatarDecorationRequestAtom } from '@/states/avatar-decoration-request';

export const DetailsPage = () => {
  const [{data: item}] = useAtom(adminCurrentAvatarDecorationRequestAtom);
  const [isShowingTemplate, setIsShowingTemplate] = useAtom(adminAvatarDecorationRequestIsShowingTemplateAtom);

  return item ? (
    <>
      <Switch className="lu-mb-4"
        checked={isShowingTemplate}
        onChange={e => setIsShowingTemplate(e.target.checked)}
      >
        プレビュー画像にテンプレートを表示
      </Switch>

      <Button as={Link} to="/admin/avatar-decoration-requests" className="lu-mb-4" variant="ghost">
        <i className="bi bi-arrow-left" /> 一覧に戻る
      </Button>
      <RequestCard details request={item} showPreview={isShowingTemplate} />
    </>
  ) : null;
};
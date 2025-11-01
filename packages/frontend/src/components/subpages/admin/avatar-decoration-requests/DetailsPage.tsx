import { useAtom } from 'jotai';
import { Button, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { RequestCard } from '@/components/domains/avatar-decoration-request/admin/RequestCard';
import { adminAvatarDecorationRequestIsShowingTemplateAtom, adminCurrentAvatarDecorationRequestAtom } from '@/states/avatar-decoration-request';

export const DetailsPage = () => {
  const [{data: item}] = useAtom(adminCurrentAvatarDecorationRequestAtom);
  const [isShowingTemplate, setIsShowingTemplate] = useAtom(adminAvatarDecorationRequestIsShowingTemplateAtom);

  return item ? (
    <>
      <Form.Switch className="mb-3"
        label="プレビュー画像にテンプレートを表示"
        checked={isShowingTemplate}
        onChange={e => setIsShowingTemplate(e.target.checked)}
      />

      <Button as={Link as any} to="/admin/avatar-decoration-requests" className="mb-3" variant="outline-primary">
        <i className="bi bi-arrow-left" /> 一覧に戻る
      </Button>
      <RequestCard details request={item} showPreview={isShowingTemplate} />
    </>
  ) : null;
};
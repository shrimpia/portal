import { useAtomValue } from 'jotai';
import React, { useCallback, useMemo } from 'react';
import { Button, Card, Form, Stack } from 'react-bootstrap';

import { AdminContainer } from '@/components/domains/admin/AdminContainer';
import { useAPI } from '@/services/api';
import { allHintsAtom, allHintsStatusAtom } from '@/states/hints';
import { userAtom } from '@/states/user';

const HintEditor: React.FC<{id?: string | null}> = ({ id }) => {
  const allHints = useAtomValue(allHintsAtom);
  const { refetch } = useAtomValue(allHintsStatusAtom);
  const user = useAtomValue(userAtom);
  const api = useAPI();

  const isEmperor = useMemo(() => user?.isEmperor ?? false, [user]);


  const hint = useMemo(() => id === null ? null : allHints.find(hint => hint.id === id), [id, allHints]);

  const [content, setContent] = React.useState(hint?.content || '');

  const isInvalid = useMemo(() => content.length > 80 || content.length === 0, [content]);

  const setVisibility = useCallback(async (visibility: boolean) => {
    if (!isEmperor) return;
    if (!id) return;

    await api.admin.changeHintVisibility(id, visibility);
    await refetch();
  }, [api.admin, id, isEmperor, refetch]);

  const submit = useCallback(async () => {
    try {
      if (id) {
        await api.admin.editHint(id, content);
      } else {
        await api.admin.createHint(content);
        setContent('');
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        alert(e.message);
      }
    }
    await refetch();
  }, [refetch, id, api.admin, content]);

  const deleteThisItem = useCallback(async () => {
    if (!hint || !id) return;
    if (!confirm(`本当に「${hint.content}」を削除？`)) return;

    await api.admin.deleteHint(id);
    await refetch();
  }, [api.admin, hint, id, refetch]);

  return (
    <Card>
      <Card.Body>
        {!id && <Card.Title>新規作成</Card.Title>}
        <Form.Group className="mb-2">
          <Form.Control type="text" placeholder="" value={content} onChange={e => setContent(e.target.value)} isInvalid={isInvalid} />
          <Form.Text className={`ms-2 ${isInvalid ? 'text-danger' : 'text-muted'}`}>残り{80 - content.length}文字</Form.Text>
        </Form.Group>
        {id && (
          <Form.Group className="mb-2">
            <Form.Switch>
              <Form.Check.Input id="isDecoMoji" type="checkbox" disabled={!isEmperor} checked={hint?.is_published} onChange={() => setVisibility(!(hint?.is_published))} />
              <Form.Check.Label htmlFor="isDecoMoji">
                <b>公開にする</b><br/>
                <Form.Text muted>帝国皇帝のみが操作できます。</Form.Text>
              </Form.Check.Label>
            </Form.Switch>
          </Form.Group>
        )}
        <Stack direction="horizontal" gap={2}>
          {id && (
            <Button variant="outline-danger" onClick={() => deleteThisItem()}>
              <i className="bi bi-trash me-2" />
              削除する
            </Button>
          )}
          <Button variant="primary" onClick={submit} disabled={isInvalid}>
            <i className="bi bi-save me-2" />
            {id ? '更新する' : '作成する'}
          </Button>
        </Stack>
      </Card.Body>
    </Card>
  );
};

const IndexPage = () => {
  const user = useAtomValue(userAtom);
  const hints = useAtomValue(allHintsAtom);
  
  return user ? (
    <AdminContainer mode="staff">
      <h1 className="fs-3 mb-5">ヒント管理</h1>
      <div className="mb-5">
        <HintEditor />
      </div>
      <Stack gap={3}>
        {hints.map(hint => (
          <HintEditor key={hint.id} id={hint.id} />
        ))}
      </Stack>
    </AdminContainer>
  ) : null;
};

export default IndexPage;

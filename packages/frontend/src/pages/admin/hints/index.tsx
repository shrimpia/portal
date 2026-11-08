import { useAtom } from 'jotai';
import React, { useCallback, useMemo, useState } from 'react';

import { AdminContainer } from '@/components/domains/admin/AdminContainer';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Switch } from '@/components/ui/Choice';
import { Stack } from '@/components/ui/Stack';
import { Textfield } from '@/components/ui/Textfield';
import { useAPI } from '@/services/api';
import { allHintsAtom } from '@/states/hints';
import { userAtom } from '@/states/user';

const HintEditor: React.FC<{id?: string | null}> = ({ id }) => {
  const [{data: allHints, refetch}] = useAtom(allHintsAtom);
  const [{data: user}] = useAtom(userAtom);
  const api = useAPI();

  const isEmperor = useMemo(() => user?.isEmperor ?? false, [user]);
  const hint = useMemo(() => id === null ? null : allHints.find(hint => hint.id === id), [id, allHints]);

  const [content, setContent] = useState(hint?.content || '');
  const [url, setUrl] = useState(hint?.url ?? null);

  const isInvalid = useMemo(() => content.length > 80 || content.length === 0, [content.length]);

  const setVisibility = useCallback(async (visibility: boolean) => {
    if (!isEmperor) return;
    if (!id) return;

    await api.admin.changeHintVisibility(id, visibility);
    await refetch();
  }, [api.admin, id, isEmperor, refetch]);

  const submit = useCallback(async () => {
    try {
      if (id) {
        await api.admin.editHint(id, content, url);
      } else {
        await api.admin.createHint(content, url);
        setContent('');
        setUrl('');
      }
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        alert(e.message);
      }
    }
    await refetch();
  }, [refetch, id, api.admin, content, url]);

  const deleteThisItem = useCallback(async () => {
    if (!hint || !id) return;
    if (!confirm(`本当に「${hint.content}」を削除しますか？`)) return;

    await api.admin.deleteHint(id);
    await refetch();
  }, [api.admin, hint, id, refetch]);

  return (
    <Card>
      {!id && <Card.Title><i className="bi bi-plus"/> 新規作成</Card.Title>}
      <Stack gap={4}>
        <Textfield
          value={content}
          onChange={e => setContent(e.target.value)}
          invalid={isInvalid}
          caption={`残り${80 - content.length}文字`}
        />
        <Textfield
          placeholder="URL"
          value={url ?? ''}
          onChange={e => setUrl(!e.target.value ? null : e.target.value)}
          caption="ヘッドラインをタップしたときのリンクURL。不要な場合は空欄にします。"
        />
        {id && (
          <Switch
            className="lu-mb-2"
            disabled={!isEmperor}
            checked={hint?.is_published}
            onChange={() => setVisibility(!(hint?.is_published))}
            caption="管理者のみが操作できます。"
          >
            <b>公開にする</b>
          </Switch>
        )}
        <Stack direction="horizontal" gap={2}>
          {id && (
            <Button variant="danger" onClick={() => deleteThisItem()}>
              <i className="bi bi-trash lu-me-2" />
              削除する
            </Button>
          )}
          <Button variant="primary" onClick={submit} disabled={isInvalid}>
            <i className="bi bi-save lu-me-2" />
            {id ? '更新する' : '作成する'}
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
};

const IndexPage = () => {
  const [{data: user}] = useAtom(userAtom);
  const [{data: hints}] = useAtom(allHintsAtom);
  
  return user ? (
    <AdminContainer mode="staff">
      <h1 className="lu-mb-12">ヒント管理</h1>
      <div className="lu-mb-12">
        <HintEditor />
      </div>
      <Stack gap={4}>
        {hints.map(hint => (
          <HintEditor key={hint.id} id={hint.id} />
        ))}
      </Stack>
    </AdminContainer>
  ) : null;
};

export default IndexPage;

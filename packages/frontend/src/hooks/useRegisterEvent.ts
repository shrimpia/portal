import { useAtom } from 'jotai';
import { useCallback } from 'react';

import { useWithSpinner } from './useWithSpinner';

import type { EventDraft } from '@/types/event';

import { useAPI } from '@/services/api';
import { allEventsAtom } from '@/states/events';

export const useSaveEvent = () => {
  const [{refetch}] = useAtom(allEventsAtom);
  const api = useAPI();
  const withSpinner = useWithSpinner();

  const onSave = useCallback(async (event: EventDraft) => {
    try {
      if (!confirm(`イベント「${event.name}」を新規登録します。

登録されたイベントは、帝国全体に公開されます。
憲法に反する内容のイベントは削除またはアカウント停止の対象となる場合があります。

上記に同意し、イベントを登録しますか？`)) return false;
      await withSpinner(() => api.createEvent(event));
      refetch();
      return true;
    } catch (e) {
      if (e instanceof Error) {
        alert(e.message);
        console.error(e);
      }
    }
    return false;
  }, [api, refetch, withSpinner]);

  return onSave;
};

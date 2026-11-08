import { useAtom } from "jotai";
import { Suspense, useCallback, useState } from "react";

import type { EventDraft } from "@/types/event";

import { LoadingView } from "@/components/common/LoadingView";
import { EditEventModal } from "@/components/domains/events/EditEventModal";
import { EventCalendarView } from "@/components/subpages/events/EventCalendarView";
import { EventListView } from "@/components/subpages/events/EventListView";
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Stack } from '@/components/ui/Stack';
import { TabBar } from '@/components/ui/TabBar';
import { useSaveEvent } from "@/hooks/useRegisterEvent";
import { viewModeAtom } from "@/states/events";
import { useLoginGuard } from "@/hooks/useLoginGuard";

const EventsPage: React.FC = () => {
  useLoginGuard();
  const [show, setShow] = useState(false);
  const [viewMode, setViewMode] = useAtom(viewModeAtom);

  const save = useSaveEvent();

  const onSave = useCallback(
    async (event: EventDraft) => {
      if (!(await save(event))) return;
      setShow(false);
    },
    [save],
  );

  return (
    <Container>
      <h1 className="lu-mb-4">イベントカレンダー</h1>
      <p>
        シュリンピアでイベントを開催する全ての方が利用できるイベントカレンダーです！
        <br />
        ゲーム大会、オフ会、創作企画、部活動など、シュリンピア上で開催するイベントであれば、どなたでも自由に登録できます！
      </p>
      <Stack direction="horizontal" align="center" className="lu-mb-4">
        <TabBar value={viewMode} onChange={setViewMode} aria-label="表示の切り替え">
  <TabBar.Tab value="list"><i className="bi bi-card-heading" /> リスト</TabBar.Tab>
  <TabBar.Tab value="calendar"><i className="bi bi-calendar-event" /> カレンダー</TabBar.Tab>
</TabBar>
        <Button variant="primary" className="lu-ms-auto" onClick={() => setShow(true)}>
          <i className="bi bi-plus-lg" /> イベントを追加
        </Button>
      </Stack>
      <Suspense fallback={<LoadingView />}>
        {viewMode === "calendar" ? <EventCalendarView /> : <EventListView />}
      </Suspense>
      <EditEventModal
        show={show}
        onHide={() => setShow(false)}
        onSave={onSave}
      />
    </Container>
  );
};

export default EventsPage;

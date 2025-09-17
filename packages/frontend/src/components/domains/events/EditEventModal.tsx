import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Alert, Button, Form, Modal, Stack } from 'react-bootstrap';
import DatePicker from 'react-datepicker';

import type { EventDraft, EventDto } from '@/types/event';

import 'react-datepicker/dist/react-datepicker.css';

import { userAtom } from '@/states/user';

export type EditEventModalProp = {
    show: boolean;
    initialEvent?: EventDto | null;
    initialDate?: Date | null;

    onHide: () => void;
    onSave: (data: EventDraft) => void;
};

export const EditEventModal: React.FC<EditEventModalProp> = (p) => {
  const [name, setName] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isAllDay, setAllDay] = useState(false);
  const [isOfficial, setOfficial] = useState(false);
  const [description, setDescription] = useState('');
  const [{data: user}] = useAtom(userAtom);

  const isUpdateMode = p.initialEvent != null;

  const canPost = useMemo(() => name.length > 0 && startDate.getTime() <= endDate.getTime(), [name, startDate, endDate]);

  const onClickSave = useCallback(() => {
    const data: EventDraft = {
      name,
      startDate,
      endDate,
      isAllDay,
      description,
    };

    if (user?.isEmperor) {
      data.isOfficial = isOfficial;
    }
    
    p.onSave(data);
  }, [name, startDate, endDate, isAllDay, description, user?.isEmperor, p, isOfficial]);

  useEffect(() => {
    if (p.initialDate) {
      setStartDate(p.initialDate);
      setEndDate(p.initialDate);
    }

    if (p.initialEvent) {
      setName(p.initialEvent.name);
      setStartDate(new Date(p.initialEvent.startDate));
      if (p.initialEvent.endDate) setEndDate(new Date(p.initialEvent.endDate));
      setAllDay(p.initialEvent.isAllDay);
      setDescription(p.initialEvent.description);
    }
  }, [p.initialDate, p.initialEvent]);

  useEffect(() => {
    if (startDate.getTime() > endDate.getTime()) {
      setEndDate(startDate);
    }
    if (endDate.getTime() < startDate.getTime()) {
      setStartDate(endDate);
    }
  }, [endDate, startDate]);
  
  return (
    <Modal show={p.show} onHide={p.onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{isUpdateMode ? 'イベント編集' : 'イベントを新規登録'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Stack gap={3}>
          {!isUpdateMode && (
            <Alert variant="warning">
              <div className="d-flex gap-2">
                <i className="bi bi-exclamation-triangle-fill" />
                <div>
                  イベントはシュリンピア全体に公開されます。<br/>
                  憲法に反する内容のイベントは削除またはアカウント停止の対象となる場合があります。
                </div>
              </div>
            </Alert>
          )}
          <div>
            <Form.Label htmlFor="name" className="fw-bold">イベント名</Form.Label>
            <Form.Control value={name} id="name" type="text" placeholder="例：第１回お絵描き大会" onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <Form.Label className="fw-bold">日時</Form.Label>
            <div className="d-flex align-items-center">
              <DatePicker
                dateFormat={isAllDay ? 'y年M月d日' : 'y年M月d日 HH:mm'}
                showTimeSelect={!isAllDay}
                selected={startDate}
                className="form-control"
                onChange={(date: Date | null) => setStartDate(date ?? new Date())} />
              <div className="mx-2">～</div>
              <DatePicker
                dateFormat={isAllDay ? 'y年M月d日' : 'y年M月d日 HH:mm'}
                locale="ja-JP"
                showTimeSelect={!isAllDay}
                selected={endDate}
                className="form-control"
                onChange={(date: Date | null) => setEndDate(date ?? new Date())} />
            </div>
            <Form.Check checked={isAllDay} type="checkbox" id="isAllDay" label="終日予定にする" className="mt-2 ms-2" onChange={e => setAllDay(e.target.checked)} />
          </div>
          <div>
            <Form.Label htmlFor="description" className="fw-bold">説明</Form.Label>
            <Form.Control value={description} id="description" as="textarea" rows={7} placeholder="例：お絵描き大会を開催します。" onChange={e => setDescription(e.target.value)} />
            <Form.Text muted>一部のMFMが使用できます。</Form.Text>
          </div>
          {user?.isEmperor && (
            <div>
              <Form.Label className="fw-bold">その他の設定</Form.Label>
              <Form.Check type="checkbox" id="isOfficial" label="公式イベント（管理者のみ設定可能）" checked={isOfficial} onChange={e => setOfficial(e.target.checked)} />              
            </div>
          )}
        </Stack>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={p.onHide}>
          キャンセル
        </Button>
        <Button variant="primary" disabled={!canPost} onClick={onClickSave}>
          {isUpdateMode ? '更新' : '登録'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

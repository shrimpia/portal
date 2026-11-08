import { useAtom } from "jotai";
import { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";

import type { EventDraft, EventDto } from "@/types/event";

import "react-datepicker/dist/react-datepicker.css";

import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Checkbox } from '@/components/ui/Choice';
import { Dialog } from '@/components/ui/Dialog';
import { FieldTitle } from '@/components/ui/Field';
import { Stack } from '@/components/ui/Stack';
import { Textarea } from '@/components/ui/Textarea';
import { Textfield } from '@/components/ui/Textfield';
import { userAtom } from "@/states/user";

import { ja } from "date-fns/locale/ja";

registerLocale("ja", ja);

export type EditEventModalProp = {
  show: boolean;
  initialEvent?: EventDto | null;
  initialDate?: Date | null;

  onHide: () => void;
  onSave: (data: EventDraft) => void;
};

export const EditEventModal: React.FC<EditEventModalProp> = (p) => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [isAllDay, setAllDay] = useState(false);
  const [isOfficial, setOfficial] = useState(false);
  const [description, setDescription] = useState("");
  const [{ data: user }] = useAtom(userAtom);

  const isUpdateMode = p.initialEvent != null;

  const [errors, setErrors] = useState<string[]>([]);

  const canPost = useMemo(
    () => name.length > 0 && startDate.getTime() <= endDate.getTime(),
    [name, startDate, endDate],
  );

  const checkErrors = useCallback(() => {
    const errs: string[] = [];
    if (name.length === 0) errs.push("イベント名を入力してください。");
    if (startDate.getTime() > endDate.getTime())
      errs.push("終了日時は開始日時より後に設定してください。");
    setErrors(errs);
  }, [name, startDate, endDate]);

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
  }, [
    name,
    startDate,
    endDate,
    isAllDay,
    description,
    user?.isEmperor,
    p,
    isOfficial,
  ]);

  /* 初期化 */
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

  return (
    <Dialog
      open={p.show}
      onClose={p.onHide}
      title={isUpdateMode ? "イベント編集" : "イベントを新規登録"}
      actions={
        <>
          <Button onClick={p.onHide}>キャンセル</Button>
          <Button variant="primary" disabled={!canPost} onClick={onClickSave}>
            {isUpdateMode ? "更新" : "登録"}
          </Button>
        </>
      }
    >
        <Stack gap={4}>
          {!isUpdateMode && (
            <Alert variant="warning" icon="bi-exclamation-triangle-fill">
              イベントはシュリンピア全体に公開されます。
              <br />
              サーバールールに反するイベントや、サービス・コンテンツ等の宣伝を目的としたイベントは禁止されます。
            </Alert>
          )}
          {errors.length > 0 && (
            <Alert variant="danger">
              <ul className="lu-mb-0 lu-ps-4">
                {errors.map((e) => (
                  <li key={e}>{e}</li>
                ))}
              </ul>
            </Alert>
          )}
          <div>
            <Textfield
              title="イベント名"
              value={name}
              id="name"
              type="text"
              placeholder="例：第１回お絵描き大会"
              onChange={(e) => setName(e.target.value)}
              onBlur={checkErrors}
            />
          </div>
          <div>
            <FieldTitle>日時</FieldTitle>
            <Stack direction="horizontal" align="center">
              <DatePicker
                dateFormat={isAllDay ? "y年M月d日" : "y年M月d日 HH:mm"}
                locale="ja"
                showTimeSelect={!isAllDay}
                selected={startDate}
                customInput={<Textfield />}
                onChange={(date) => setStartDate(date ?? new Date())}
                onBlur={checkErrors}
              />
              <div className="lu-mx-2">～</div>
              <DatePicker
                dateFormat={isAllDay ? "y年M月d日" : "y年M月d日 HH:mm"}
                locale="ja"
                showTimeSelect={!isAllDay}
                selected={endDate}
                customInput={<Textfield />}
                onChange={(date) => setEndDate(date ?? new Date())}
                onBlur={checkErrors}
              />
            </Stack>
            <Checkbox
              checked={isAllDay}
              id="isAllDay"
              className="lu-mt-2 lu-ms-2"
              onChange={(e) => {
                setAllDay(e.target.checked);
                if (e.target.checked) {
                  setStartDate((d) => {
                    const next = new Date(d);
                    next.setHours(0, 0, 0, 0);
                    return next;
                  });
                  setEndDate((d) => {
                    const next = new Date(d);
                    next.setHours(0, 0, 0, 0);
                    return next;
                  });
                }
              }}
            >
              終日予定にする
            </Checkbox>
          </div>
          <Textarea
            title="説明"
            value={description}
            id="description"
            rows={7}
            placeholder="例：お絵描き大会を開催します。"
            onChange={(e) => setDescription(e.target.value)}
            caption="一部のMFMが使用できます。"
          />
          {user?.isEmperor && (
            <div>
              <FieldTitle>その他の設定</FieldTitle>
              <Checkbox
                id="isOfficial"
                checked={isOfficial}
                onChange={(e) => setOfficial(e.target.checked)}
              >
                公式イベント（管理者のみ設定可能）
              </Checkbox>
            </div>
          )}
        </Stack>
      </Dialog>
  );
};

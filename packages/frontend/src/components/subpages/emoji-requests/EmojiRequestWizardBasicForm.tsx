import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue } from 'jotai';
import React, { useCallback, useEffect, useMemo } from 'react';
import { Card, Form, Stack } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import type { BasicInputFormSchema } from '@/form-schemas/emoji-request/basic-input';

import { MfmView } from '@/components/common/MfmView';
import { EmojiPreview } from '@/components/domains/emoji-request/EmojiPreview';
import { SubmitButton } from '@/components/domains/emoji-request/SubmitButton';
import { basicInputFormSchema } from '@/form-schemas/emoji-request/basic-input';
import { useAPI } from '@/services/api';
import { fileAtom, imgDataUrlAtom, basicInputFormAtom, emojiNameDuplicationCheckStateAtom } from '@/states/emoji-request';

const EmojiRequestBasicForm: React.FC<{onStep: () => void}> = ({ onStep }) => {
  const url = useAtomValue(imgDataUrlAtom);
  const file = useAtomValue(fileAtom);
  const [data, setData] = useAtom(basicInputFormAtom);
  const [emojiNameState, setEmojiNameState] = useAtom(emojiNameDuplicationCheckStateAtom);

  const api = useAPI();

  const normalizedName = useMemo(() => {
    if (!file) return undefined;
    return file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[\s-]/g, '_').replace(/[^a-z0-9_]/g, '');
  }, [file]);

  const emojiNameStateMessage = useMemo(() => {
    switch (emojiNameState) {
      case 'initial':
        return null;
      case 'loading':
        return (
          <Form.Text className="text-muted ms-2">
            検証中…
          </Form.Text>
        );
      case 'valid':
        return (
          <Form.Text className="text-success ms-2">
            <i className="bi bi-check-circle-fill" /> <MfmView>:eeyan:</MfmView>
          </Form.Text>
        );
      case 'invalid':
        return (
          <Form.Text className="text-danger ms-2">
            <i className="bi bi-exclamation-triangle-fill" /> この名前はすでに登録、あるいは申請されています。
          </Form.Text>
        );
    }
  }, [emojiNameState]);

  const { register, handleSubmit, formState: { isValid, errors } } = useForm<BasicInputFormSchema>({
    resolver: zodResolver(basicInputFormSchema),
    mode: 'onChange',
    defaultValues: data ?? {
      name: normalizedName,
    },
  });

  const checkEmojiNameDuplicated = useCallback(async (name: string) => {
    setEmojiNameState('loading');
    const isDuplicated = await api.isDuplicatedEmojiName(name);
    setEmojiNameState(isDuplicated ? 'invalid' : 'valid');
  }, [api, setEmojiNameState]);

  const onBlurNameInput = useCallback<React.FocusEventHandler<HTMLInputElement>>((e) => {
    if (errors.name) return;
    checkEmojiNameDuplicated(e.target.value);
  }, [checkEmojiNameDuplicated, errors.name]);

  const onSubmit = useCallback((data: BasicInputFormSchema) => {
    setData(data);
    onStep();
  }, [onStep, setData]);

  useEffect(() => {
    if (normalizedName) checkEmojiNameDuplicated(normalizedName);
  }, [checkEmojiNameDuplicated, normalizedName]);

  return (
    <div className="">
      <h1 className="fs-3 mb-3">情報を入力</h1>
      <p>
        アップロードした絵文字について、情報を入力してください。<br/>
        入力内容が正しくない、あるいは不足している場合は却下の対象となります。
      </p>

      <h2 className="fs-6 mt-4 fw-bold">絵文字プレビュー</h2>
      <EmojiPreview src={url ?? ''} />

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={3}>
          <Form.Group controlId="name" className="mt-4">
            <Form.Label className="fw-bold">名前</Form.Label>
            <Form.Control
              type="text"
              autoComplete="off"
              placeholder="例: lutica_dadakone"
              {...register('name')}
              isInvalid={errors.name != null || emojiNameState === 'invalid'}
              onBlur={onBlurNameInput}
            />
            <Stack>
              {errors.name && (
                <Form.Text className="text-danger ms-2">
                  <i className="bi bi-exclamation-triangle-fill" /> 1文字以上32文字以内の小文字の英数字とアンダースコア(_)のみが利用できます
                </Form.Text>
              )}
              {!errors.name && emojiNameStateMessage}
            </Stack>
          </Form.Group>
      
          <Card>
            <Card.Body>
              <p>アップロードした画像に対し、当てはまる項目をオンにしてください。</p>
              <Stack gap={2}>
                <Form.Check>
                  <Form.Check.Input id="hasText" type="checkbox" {...register('hasText')} />
                  <Form.Check.Label htmlFor="hasText">
                    <b>画像内にテキストが含まれる</b><br/>
                  </Form.Check.Label>
                </Form.Check>
      
                <Form.Check>
                  <Form.Check.Input id="hasAnimation" type="checkbox" {...register('hasAnimation')} />
                  <Form.Check.Label htmlFor="hasAnimation">
                    <b>アニメーション画像である</b>
                  </Form.Check.Label>
                </Form.Check>
              </Stack>
            </Card.Body>
          </Card>

          <SubmitButton disabled={!isValid || emojiNameState !== 'valid'}>次へ進む</SubmitButton>
        </Stack>
      </Form>
    </div>
  );
};

export default EmojiRequestBasicForm;

import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue } from 'jotai';
import React, { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import type { BasicInputFormSchema } from '@/form-schemas/emoji-request/basic-input';

import { MfmView } from '@/components/common/MfmView';
import { EmojiPreview } from '@/components/domains/emoji-request/EmojiPreview';
import { EmojiRequestFormContainer } from '@/components/domains/emoji-request/EmojiRequestFormContainer';
import { SubmitButton } from '@/components/domains/emoji-request/SubmitButton';
import { Card } from '@/components/ui/Card';
import { Checkbox } from '@/components/ui/Choice';
import { Stack } from '@/components/ui/Stack';
import { Textfield } from '@/components/ui/Textfield';
import { basicInputFormSchema } from '@/form-schemas/emoji-request/basic-input';
import { useAPI } from '@/services/api';
import { fileAtom, imgDataUrlAtom, basicInputFormAtom, emojiNameDuplicationCheckStateAtom } from '@/states/emoji-request';

const BasicForm: React.FC = () => {
  const url = useAtomValue(imgDataUrlAtom);
  const file = useAtomValue(fileAtom);
  const [data, setData] = useAtom(basicInputFormAtom);
  const [emojiNameState, setEmojiNameState] = useAtom(emojiNameDuplicationCheckStateAtom);

  const api = useAPI();
  const navigate = useNavigate();

  const normalizedName = useMemo(() => {
    if (!file) return undefined;
    return file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[\s-]/g, '_').replace(/[^a-z0-9_]/g, '');
  }, [file]);

  const emojiNameStateMessage = useMemo(() => {
    switch (emojiNameState) {
      case 'initial':
        return null;
      case 'loading':
        return '検証中…';
      case 'valid':
        return (
          <>
            <i className="bi bi-check-circle-fill" /> <MfmView>:iizo:</MfmView>
          </>
        );
      case 'invalid':
        return (
          <>
            <i className="bi bi-exclamation-triangle-fill" /> この名前はすでに登録、あるいは申請されています。
          </>
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
    navigate('/emoji-request/new/detail');
  }, [navigate, setData]);

  useEffect(() => {
    if (normalizedName) checkEmojiNameDuplicated(normalizedName);
  }, [checkEmojiNameDuplicated, normalizedName]);

  // 必要なデータがなければトップに飛ばす
  useEffect(() => {
    if (!file) {
      navigate('/emoji-request/new');
    }
  }, [file, navigate]);

  return !file ? null : (
    <EmojiRequestFormContainer step={1}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack gap={4}>
          <Stack direction="horizontal" justify="center">
            <EmojiPreview src={url ?? ''} />
          </Stack>
          <p className="lu-text-center lu-mb-12">
            アップロードした絵文字について、情報を入力してください。<br/>
            入力内容が正しくない、あるいは不足している場合は却下の対象となります。
          </p>
          <Textfield
            title="名前"
            autoComplete="off"
            placeholder="例: lutica_dadakone"
            {...register('name')}
            invalid={errors.name != null || emojiNameState === 'invalid'}
            onBlur={onBlurNameInput}
            caption={errors.name ? (
              <>
                <i className="bi bi-exclamation-triangle-fill" /> 1文字以上32文字以内の小文字の英数字とアンダースコア(_)のみが利用できます
              </>
            ) : emojiNameStateMessage}
          />
      
          <Card>
            <p>アップロードした画像に対し、当てはまる項目をオンにしてください。</p>
            <Stack gap={2}>
              <Checkbox {...register('hasText')}>
                <b>テキストを含む</b>
              </Checkbox>
    
              <Checkbox {...register('hasAnimation')}>
                <b>アニメーションする</b>
              </Checkbox>
            </Stack>
          </Card>

          <SubmitButton disabled={!isValid || emojiNameState !== 'valid'}>次へ進む</SubmitButton>
        </Stack>
      </form>
    </EmojiRequestFormContainer>
  );
};

export default BasicForm;

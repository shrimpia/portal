import { zodResolver } from '@hookform/resolvers/zod';
import { css } from '@linaria/core';
import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { ErrorCode, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import type { UploadFormSchema } from '@/form-schemas/emoji-request/upload';

import { EmojiNoteView } from '@/components/common/EmojiNoteView';
import { EmojiRequestFormContainer } from '@/components/domains/emoji-request/EmojiRequestFormContainer';
import { SubmitButton } from '@/components/domains/emoji-request/SubmitButton';
import { Alert } from '@/components/ui/Alert';
import { Checkbox } from '@/components/ui/Choice';
import { Grid } from '@/components/ui/Grid';
import { uploadFormSchema } from '@/form-schemas/emoji-request/upload';
import { animatedInputFormAtom, basicInputFormAtom, detailInputFormAtom, fileAtom, imgDataUrlAtom, includingTextInputFormAtom, uploadFormAtom } from '@/states/emoji-request';

const uploadAreaStyle = css`
  padding: 16px;
  border-radius: 8px;
  border: 2px dashed var(--border);
  cursor: pointer;

  &[data-active] {
    border-color: var(--primary);
  }
`;

const uploaderErrorMessageMap: Record<string, string> = {
  [ErrorCode.FileTooLarge]: 'ファイルサイズは200KB以下である必要があります。',
  [ErrorCode.FileInvalidType]: 'ファイル形式が正しくありません。',
};

const EmojiRequestNewPage = () => {
  const [error, setError] = useState<string[]>([]);
  const [file, setFile] = useAtom(fileAtom);
  const [imgDataUrl, setImgDataUrl] = useAtom(imgDataUrlAtom);
  const [data, setData] = useAtom(uploadFormAtom);

  const setBasicInput = useSetAtom(basicInputFormAtom);
  const setDetailInput = useSetAtom(detailInputFormAtom);
  const setAnimatedInput = useSetAtom(animatedInputFormAtom);
  const setIncludingTextInput = useSetAtom(includingTextInputFormAtom);

  const navigate = useNavigate();

  const fileSizeInKB = useMemo(() => (file ? (file.size / 1024).toPrecision(4) : 0), [file]);
  const isFileSizeValid = useMemo(() => (file && file.size <= 200 * 1024), [file]);

  const { register, handleSubmit, reset, formState: { isValid } } = useForm({
    resolver: zodResolver(uploadFormSchema),
    mode: 'onChange',
    defaultValues: data,
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    maxSize: 200 * 1024,
    accept: {
      'image/png': ['.png'],
      'image/gif': ['.gif'],
      'image/vnd.mozilla.apng': ['.apng', '.png'],
    },
    onDropAccepted: (files) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      setFile(file);
      setError([]);
      const reader = new FileReader();
      reader.onload = () => {
        setImgDataUrl(reader.result as string);
        setBasicInput(undefined);
        setDetailInput(undefined);
        setAnimatedInput(undefined);
        setIncludingTextInput(undefined);
        reset({
          isReadableInDark: false as any,
          isNotHiddenInDark: false as any,
          isReadableInLight: false as any,
          isNotHiddenInLight: false as any,
        });
      };
      reader.readAsDataURL(file);
    },
    onDropRejected: (fileRejections) => {
      setError(fileRejections[0].errors.map(e => uploaderErrorMessageMap[e.code]));
    },
  });

  const onSubmit = useCallback((data: UploadFormSchema) => {
    if (!file) return;
    setData(data);
    navigate('/emoji-request/new/basic');
  }, [file, navigate, setData]);
  return (
    <EmojiRequestFormContainer step={0}>
      <Alert className="lu-mb-4" variant="info">
        アップロードする前に、<br/><a href="https://docs.shrimpia.network/emoji-guideline" target="_blank" rel="noopener noreferrer">絵文字申請ガイドライン</a>を必ずお読みください！
      </Alert>
      
      {error?.length > 0 && error.map(e => (
        <Alert className="lu-mb-4" variant="danger" icon="bi-exclamation-triangle-fill" key={'error-' + e}>
          {e}
        </Alert>
      ))}
      
      <div className={uploadAreaStyle} data-active={isDragActive ? '' : undefined} {...getRootProps()}>
        <input {...getInputProps()} />
        {file && (
          <div className="lu-mb-2">
            <span>{file.name} - </span>
            <span className={isFileSizeValid ? 'text-success' : 'text-danger'}>
              {fileSizeInKB} KB <i className={`bi bi-${isFileSizeValid ? 'check' : 'x'}-circle-fill`} />
            </span>
          </div>
        )}
        {
          isDragActive ?
            <span>そう、その調子！<br/>さあ、その画像をこちらへ…！</span> :
            <span>このエリアに画像をドロップするか、<br/>クリック（あるいはタップ）してください</span>
        }
      </div>
      
      {imgDataUrl && file && (
        <div className="lu-mt-6">
          <p className="lu-text-center lu-my-12">以下のプレビューを見て、表示に問題がないことを確認してください。</p>
                    
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid halves>
              <div>
                <h2>ダークテーマ</h2>
                <EmojiNoteView emojiUrl={imgDataUrl} theme="dark" />
                <Checkbox {...register('isReadableInDark', { required: true })}>文字が潰れていない</Checkbox>
                <Checkbox {...register('isNotHiddenInDark', { required: true })}>画像の一部が隠れていない</Checkbox>
              </div>
              <div>
                <h2>ライトテーマ</h2>
                <EmojiNoteView emojiUrl={imgDataUrl} theme="light" />
                <Checkbox {...register('isReadableInLight', { required: true })}>文字が潰れていない</Checkbox>
                <Checkbox {...register('isNotHiddenInLight', { required: true })}>画像の一部が隠れていない</Checkbox>
              </div>
            </Grid>
            <SubmitButton disabled={!isValid}>次へ進む</SubmitButton>
          </form>
        </div>
      )}
    </EmojiRequestFormContainer>
  );
};

export default EmojiRequestNewPage;

import { zodResolver } from '@hookform/resolvers/zod';
import { css } from '@linaria/core';
import { useAtom } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import { ErrorCode, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

import type { UploadFormSchema } from '@/form-schemas/emoji-request/upload';

import { EmojiNoteView } from '@/components/common/EmojiNoteView';
import { SubmitButton } from '@/components/domains/emoji-request/SubmitButton';
import { uploadFormSchema } from '@/form-schemas/emoji-request/upload';
import { fileAtom, imgDataUrlAtom, uploadFormAtom } from '@/states/emoji-request';

const uploadAreaStyle = css`
  padding: 16px;
  border-radius: 8px;
  border: 2px dashed var(--bs-border-color);
  background-color: var(--bs-body-bg);
  cursor: pointer;

  &[data-active] {
    border-color: var(--bs-primary);
  }
`;

const uploaderErrorMessageMap: Record<string, string> = {
  [ErrorCode.FileTooLarge]: 'ファイルサイズは200KB以下である必要があります。',
  [ErrorCode.FileInvalidType]: 'ファイル形式が正しくありません。',
};

const EmojiRequestWizardUpload: React.FC<{onStep: () => void}> = ({ onStep }) => {
  const [error, setError] = useState<string[]>([]);

  const [file, setFile] = useAtom(fileAtom);
  const [imgDataUrl, setImgDataUrl] = useAtom(imgDataUrlAtom);
  const [data, setData] = useAtom(uploadFormAtom);

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
        reset();
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
    onStep();
  }, [file, onStep, setData]);

  return (
    <div className="">
      <h1 className="fs-3 mb-3">アップロード</h1>

      <Alert variant="info">
        アップロードする前に、<br/><a href="https://docs.shrimpia.network/emoji-guideline" target="_blank" rel="noopener noreferrer">絵文字申請ガイドライン</a>を必ずお読みください！
      </Alert>

      {error?.length > 0 && error.map(e => (
        <Alert variant="danger" key={'error-' + e}>
          <i className="bi bi-exclamation-triangle-fill" /> {e}
        </Alert>
      ))}

      <div className={uploadAreaStyle} data-active={isDragActive ? '' : undefined} {...getRootProps()}>
        <input {...getInputProps()} />
        {file && (
          <div className="mb-2">
            <span>{file.name} - </span>
            <span className={isFileSizeValid ? 'text-success' : 'text-danger'}>
              {fileSizeInKB} KB <i className={`bi bi-${isFileSizeValid ? 'check' : 'x'}-circle-fill`} />
            </span>
          </div>
        )}
        {
          isDragActive ?
            <span>さあ、それを早く<br/>ここへ落とすんだ……！</span> :
            <span>このエリアに画像をドロップするか、<br/>クリック（あるいはタップ）してください</span>
        }
      </div>

      {imgDataUrl && file && (
        <div className="mt-4">
          <p className="fw-bold text-center mb-4">以下のプレビューを見て、表示に問題がないことを確認してください。</p>
              
          <form onSubmit={handleSubmit(onSubmit)}>
            <Row className="">
              <Col lg={6} sm={12} className="mb-2">
                <h2 className="fs-5">ダークテーマ</h2>
                <EmojiNoteView emojiUrl={imgDataUrl} theme="dark" />
                <Form.Check>
                  <Form.Check.Input id="isNotDifficultToReadInDarkMode" type="checkbox" {...register('isReadableInDark', { required: true })} />
                  <Form.Check.Label htmlFor="isNotDifficultToReadInDarkMode">文字が潰れていない</Form.Check.Label>
                </Form.Check>
                <Form.Check>
                  <Form.Check.Input id="somePartsAreNotHiddenInDarkMode" type="checkbox" {...register('isNotHiddenInDark', { required: true })} />
                  <Form.Check.Label htmlFor="somePartsAreNotHiddenInDarkMode">画像の一部が隠れていない</Form.Check.Label>
                </Form.Check>
              </Col>
              <Col lg={6} sm={12}>
                <h2 className="fs-5">ライトテーマ</h2>
                <EmojiNoteView emojiUrl={imgDataUrl} theme="light" />
                <Form.Check>
                  <Form.Check.Input id="isNotDifficultToReadInLightMode" type="checkbox" {...register('isReadableInLight', { required: true })} />
                  <Form.Check.Label htmlFor="isNotDifficultToReadInLightMode">文字が潰れていない</Form.Check.Label>
                </Form.Check>
                <Form.Check>
                  <Form.Check.Input id="somePartsAreNotHiddenInLightMode" type="checkbox" {...register('isNotHiddenInLight', { required: true })} />
                  <Form.Check.Label htmlFor="somePartsAreNotHiddenInLightMode">画像の一部が隠れていない</Form.Check.Label>
                </Form.Check>
              </Col>
            </Row>
            <SubmitButton disabled={!isValid}>次へ進む</SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
};

export default EmojiRequestWizardUpload;

import { zodResolver } from '@hookform/resolvers/zod';
import { css } from '@linaria/core';
import { useAtom, useSetAtom } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Button, Card, Col, Container, Form, Image, Row, Stack } from 'react-bootstrap';
import { ErrorCode, useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { z } from 'zod';

import { OnlyShrimpiaPlus } from '@/components/common/OnlyShrimpiaPlus';
import { UserLinkView } from '@/components/common/UserLinkView';
import { useLoginGuard } from '@/hooks/useLoginGuard';
import { useWithSpinner } from '@/hooks/useWithSpinner';
import { api } from '@/services/api';
import { getImageSize } from '@/services/get-image-size';
import {
  agreedToGuidelinesAtom,
  avatarDecorationRequestsAtom,
  confirmedTemplateAtom,
  descriptionAtom,
  fileAtom,
  imgDataUrlAtom,
  nameAtom,
  remainingAvatarDecorationRequestLimitAtom,
} from '@/states/avatar-decoration-request';
import { tokenAtom } from '@/states/sessions';
import { userAtom } from '@/states/user';

import avatarDecorationTemplate from '@/assets/avatar-decoration-template.png';
import { URL_AVATAR_DECORATION_REQUEST_GUIDELINES } from '@/consts';

const uploadAreaStyle = css`
  padding: 16px;
  border-radius: 8px;
  border: 2px dashed var(--bs-border-color);
  cursor: pointer;

  &[data-active] {
    border-color: var(--bs-primary);
  }
`;

const previewContainerStyle = css`
  position: relative;
  width: 192px;
  height: 192px;
  max-width: 100%;
  margin: 0 auto;
`;

const overlayImageStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.7;
`;

const uploaderErrorMessageMap: Record<string, string> = {
  [ErrorCode.FileTooLarge]: 'ファイルサイズは5MB以下である必要があります。',
  [ErrorCode.FileInvalidType]: 'ファイル形式はPNGである必要があります。',
};

const formSchema = z.object({
  name: z.string().min(1, '名前を入力してください').max(50, '名前は50文字以内で入力してください'),
  description: z.string().max(200, '説明は200文字以内で入力してください'),
  agreedToGuidelines: z.boolean().refine(val => val === true, 'ガイドラインに同意してください'),
});

type FormSchema = z.infer<typeof formSchema>;

const AvatarDecorationRequestNewPage = () => {
  useLoginGuard();

  const [error, setError] = useState<string[]>([]);
  const [file, setFile] = useAtom(fileAtom);
  const [imgDataUrl, setImgDataUrl] = useAtom(imgDataUrlAtom);
  const [name, setName] = useAtom(nameAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [agreedToGuidelines, setAgreedToGuidelines] = useAtom(agreedToGuidelinesAtom);
  
  const [{data: user}] = useAtom(userAtom);
  const [{data: limit}] = useAtom(remainingAvatarDecorationRequestLimitAtom);
  const [token] = useAtom(tokenAtom);
  const setRequests = useSetAtom(avatarDecorationRequestsAtom);

  const navigate = useNavigate();
  const withSpinner = useWithSpinner();

    const isStaff = user?.canManageAvatarDecorations || user?.isEmperor;
  const isShrimpiaPlus = user && user.shrimpiaPlus !== 'not-member';
  const fileSizeInMB = useMemo(() => (file ? (file.size / 1024 / 1024).toPrecision(3) : 0), [file]);
  const isFileSizeValid = useMemo(() => (file && file.size <= 5 * 1024 * 1024), [file]);

  const { register, handleSubmit, formState: { isValid, errors } } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      name,
      description,
      agreedToGuidelines,
    },
  });

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    multiple: false,
    maxSize: 5 * 1024 * 1024,
    accept: {
      'image/png': ['.png'],
    },
    onDropAccepted: async (files) => {
      if (!files || files.length === 0) return;
      const file = files[0];
      
      // 画像サイズをチェック
      try {
        const size = await getImageSize(file);
        if (size.width !== 512 || size.height !== 512) {
          setError(['画像サイズは512x512である必要があります。']);
          return;
        }
        
        const reader = new FileReader();
        reader.onload = () => {
          const dataUrl = reader.result as string;
          setFile(file);
          setImgDataUrl(dataUrl);
          setError([]);
        };
        reader.readAsDataURL(file);
      } catch (e) {
        setError(['画像の読み込みに失敗しました。']);
      }
    },
    onDropRejected: (fileRejections) => {
      setError(fileRejections[0].errors.map(e => uploaderErrorMessageMap[e.code] || e.message));
    },
  });

  const onSubmit = useCallback(async (data: FormSchema) => {
    if (!file || !token) return;

    await withSpinner(async () => {
      try {
        await api(token).createAvatarDecorationRequest(file, data.name, data.description);
        
        // キャッシュを無効化して再取得
        setRequests();
        
        // フォームをリセット
        setFile(null);
        setImgDataUrl(null);
        setName('');
        setDescription('');
        setAgreedToGuidelines(false);
        
        navigate('/avatar-decoration-request');
      } catch (e: any) {
        setError([e.message || '申請に失敗しました。']);
      }
    });
  }, [file, token, withSpinner, navigate, setFile, setImgDataUrl, setName, setDescription, setAgreedToGuidelines, setRequests]);

  return (
    <Container style={{ maxWidth: 960 }}>
      <h1 className="fs-3 mb-4">アバターデコレーションの申請</h1>
      
      {!isShrimpiaPlus ? (
        <OnlyShrimpiaPlus>アバターデコレーションの申請</OnlyShrimpiaPlus>
      ) : (
        <>

          <div className="mb-4">
            残り申請可能数: {
              isStaff
                ? <b>スタッフのため無制限</b>
                : <b className={limit === 0 ? 'text-danger' : ''}>{limit}</b>
            }<br/>
            <small className="text-muted">
              月ごとのリクエスト可能数は、
              <a href="https://docs.shrimpia.network/services/shrimpia-plus/" target="_blank" rel="noopener noreferrer">
                Shrimpia+
              </a>
              ページをご確認ください。
            </small>
          </div>

          {limit > 0 && (
            <Card>
              <Card.Body>
                {error?.length > 0 && error.map(e => (
                  <Alert variant="danger" key={'error-' + e}>
                    <i className="bi bi-exclamation-triangle-fill" /> {e}
                  </Alert>
                ))}
                
                <Alert variant="info">
                    アップロードする前に、<br/>
                    <a href={URL_AVATAR_DECORATION_REQUEST_GUIDELINES} target="_blank" rel="noopener noreferrer">
                    アバターデコレーション申請ガイドライン
                    </a>
                    を必ずお読みください！
                </Alert>

                <div className={uploadAreaStyle} data-active={isDragActive ? '' : undefined} {...getRootProps()}>
                  <input {...getInputProps()} />
                  {file && (
                    <div className="mb-2">
                      <span>{file.name} - </span>
                      <span className={isFileSizeValid ? 'text-success' : 'text-danger'}>
                        {fileSizeInMB} MB <i className={`bi bi-${isFileSizeValid ? 'check' : 'x'}-circle-fill`} />
                      </span>
                    </div>
                  )}
                  {isDragActive ? (
                    <span>そう、その調子！<br/>さあ、その画像をこちらへ…！</span>
                  ) : (
                    <span>
                      このエリアに画像をドロップするか、<br/>
                      クリック（あるいはタップ）してください
                    </span>
                  )}
                </div>

                {imgDataUrl && file && (
                  <form onSubmit={handleSubmit(onSubmit)} className="mt-4">
                    <div className="mb-4">
                      <p className="text-center my-3">以下のプレビューを見て、表示に問題がないことを確認してください。</p>
                      <div className={previewContainerStyle}>
                        <Image src={imgDataUrl} alt="プレビュー" fluid />
                        <Image src={avatarDecorationTemplate} alt="テンプレート" className={overlayImageStyle} fluid />
                      </div>
                    </div>

                    <Form.Group className="mb-3">
                      <Form.Label>デコレーション名 <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="例: キラキラ"
                        {...register('name')}
                        onChange={(e) => {
                          register('name').onChange(e);
                          setName(e.target.value);
                        }}
                        isInvalid={!!errors.name}
                      />
                      <Form.Control.Feedback type="invalid">{errors.name?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>デコレーションの説明</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="例: アイコンをキラキラさせるデコレーションです"
                        {...register('description')}
                        onChange={(e) => {
                          register('description').onChange(e);
                          setDescription(e.target.value);
                        }}
                        isInvalid={!!errors.description}
                      />
                      <Form.Control.Feedback type="invalid">{errors.description?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        id="agreedToGuidelines"
                        label={
                          <>
                            <a href={URL_AVATAR_DECORATION_REQUEST_GUIDELINES} target="_blank" rel="noopener noreferrer">
                              ガイドライン
                            </a>
                            を読み、同意しました
                          </>
                        }
                        {...register('agreedToGuidelines')}
                        onChange={(e) => {
                          register('agreedToGuidelines').onChange(e);
                          setAgreedToGuidelines(e.target.checked);
                        }}
                        isInvalid={!!errors.agreedToGuidelines}
                      />
                      <Form.Control.Feedback type="invalid">{errors.agreedToGuidelines?.message}</Form.Control.Feedback>
                    </Form.Group>

                    <Stack direction="horizontal" gap={2}>
                      <Button variant="secondary" onClick={() => navigate('/avatar-decoration-request')}>
                        キャンセル
                      </Button>
                      <Button type="submit" variant="primary" disabled={!isValid}>
                        申請する
                      </Button>
                    </Stack>
                  </form>
                )}
              </Card.Body>
            </Card>
          )}
        </>
      )}
    </Container>
  );
};

export default AvatarDecorationRequestNewPage;
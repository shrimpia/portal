import { zodResolver } from "@hookform/resolvers/zod";
import { css } from "@linaria/core";
import { useAtom, useSetAtom } from "jotai";
import { useCallback, useMemo, useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { z } from "zod";

import { OnlyShrimpiaPlus } from "@/components/common/OnlyShrimpiaPlus";
import { Alert } from '@/components/ui/Alert';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Checkbox, Switch } from '@/components/ui/Choice';
import { Container } from '@/components/ui/Container';
import { Dialog } from '@/components/ui/Dialog';
import { Image } from '@/components/ui/Image';
import { Stack } from '@/components/ui/Stack';
import { Textarea } from '@/components/ui/Textarea';
import { Textfield } from '@/components/ui/Textfield';
import { useLoginGuard } from "@/hooks/useLoginGuard";
import { useWithSpinner } from "@/hooks/useWithSpinner";
import { api } from "@/services/api";
import { getImageSize } from "@/services/get-image-size";
import {
  agreedToGuidelinesAtom,
  avatarDecorationRequestsAtom,
  descriptionAtom,
  fileAtom,
  imgDataUrlAtom,
  nameAtom,
  remainingAvatarDecorationRequestLimitAtom,
} from "@/states/avatar-decoration-request";
import { tokenAtom } from "@/states/sessions";
import { userAtom } from "@/states/user";

import avatarDecorationTemplate from "@/assets/avatar-decoration-template.png";
import { URL_AVATAR_DECORATION_REQUEST_GUIDELINES } from "@/consts";

const uploadAreaStyle = css`
  padding: 16px;
  border-radius: 8px;
  border: 2px dashed var(--border);
  cursor: pointer;

  &[data-active] {
    border-color: var(--primary);
  }
`;

const previewContainerStyle = css`
  position: relative;
  width: 192px;
  height: 192px;
  max-width: 100%;
  margin: 0 auto;
  pointer-events: none;
`;

const decorationTemplateStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
`;

const avatarStyle = css`
  position: absolute;
  top: 50%;
  left: 50%;
  translate: -50% -50%;
  width: 50%;
  height: 50%;
  z-index: 1;
`;

const decorationStyle = css`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
`;

const optionsStyle = css`
  margin: 0 auto;
`;

const uploaderErrorMessageMap: Record<string, string> = {
  [ErrorCode.FileTooLarge]: "ファイルサイズは5MB以下である必要があります。",
  [ErrorCode.FileInvalidType]: "ファイル形式はPNGである必要があります。",
};

const formSchema = z.object({
  name: z
    .string()
    .min(1, "名前を入力してください")
    .max(50, "名前は50文字以内で入力してください"),
  description: z.string().max(200, "説明は200文字以内で入力してください"),
  agreedToGuidelines: z
    .boolean()
    .refine((val) => val === true, "ガイドラインに同意してください"),
});

type FormSchema = z.infer<typeof formSchema>;

const AvatarDecorationRequestNewPage = () => {
  useLoginGuard();

  // States
  const [error, setError] = useState<string[]>([]);
  const [isShowingIcon, setShowingIcon] = useState(true);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  // Atoms
  const [file, setFile] = useAtom(fileAtom);
  const [imgDataUrl, setImgDataUrl] = useAtom(imgDataUrlAtom);
  const [name, setName] = useAtom(nameAtom);
  const [description, setDescription] = useAtom(descriptionAtom);
  const [agreedToGuidelines, setAgreedToGuidelines] = useAtom(
    agreedToGuidelinesAtom,
  );
  const [{ data: user }] = useAtom(userAtom);
  const [{ data: limit }] = useAtom(remainingAvatarDecorationRequestLimitAtom);
  const [token] = useAtom(tokenAtom);
  const setRequests = useSetAtom(avatarDecorationRequestsAtom);

  // Computed Values
  const isStaff = user?.canManageAvatarDecorations || user?.isEmperor;
  const isShrimpiaPlus = user && user.shrimpiaPlus !== "not-member";
  const fileSizeInMB = useMemo(
    () => (file ? (file.size / 1024 / 1024).toPrecision(3) : 0),
    [file],
  );
  const isFileSizeValid = useMemo(
    () => file && file.size <= 5 * 1024 * 1024,
    [file],
  );

  const navigate = useNavigate();
  const withSpinner = useWithSpinner();

  const {
    register,
    handleSubmit,
    formState: { isValid, errors },
  } = useForm<FormSchema>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
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
      "image/png": [".png"],
    },
    onDropAccepted: async (files) => {
      if (!files || files.length === 0) return;
      const file = files[0];

      // 画像サイズをチェック
      try {
        const size = await getImageSize(file);
        if (size.width !== 512 || size.height !== 512) {
          setError(["画像サイズは512x512である必要があります。"]);
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
        setError(["画像の読み込みに失敗しました。"]);
      }
    },
    onDropRejected: (fileRejections) => {
      setError(
        fileRejections[0].errors.map(
          (e) => uploaderErrorMessageMap[e.code] || e.message,
        ),
      );
    },
  });

  const handleConfirmSubmit = useCallback(async () => {
    if (!file || !token) return;
    setShowConfirmDialog(false);

    await withSpinner(async () => {
      try {
        await api(token).createAvatarDecorationRequest(file, name, description);

        // キャッシュを無効化して再取得
        setRequests();

        // フォームをリセット
        setFile(null);
        setImgDataUrl(null);
        setName("");
        setDescription("");
        setAgreedToGuidelines(false);

        navigate("/avatar-decoration-request");
      } catch (e: any) {
        setError([e.message || "申請に失敗しました。"]);
      }
    });
  }, [
    file,
    token,
    name,
    description,
    withSpinner,
    navigate,
    setFile,
    setImgDataUrl,
    setName,
    setDescription,
    setAgreedToGuidelines,
    setRequests,
  ]);

  const onSubmit = useCallback(
    async (data: FormSchema) => {
      if (!file || !token) return;

      // ダイアログを表示
      setShowConfirmDialog(true);
    },
    [file, token],
  );

  return (
    <Container style={{ maxWidth: 960 }}>
      <h1 className="lu-mb-6">アバターデコレーションの申請</h1>

      {!isShrimpiaPlus ? (
        <OnlyShrimpiaPlus>アバターデコレーションの申請</OnlyShrimpiaPlus>
      ) : (
        <>
          <div className="lu-mb-6">
            残り申請可能数:{" "}
            {isStaff ? (
              <b>スタッフのため無制限</b>
            ) : (
              <b className={limit === 0 ? "text-danger" : ""}>{limit}</b>
            )}
            <br />
            <small className="lu-text-dimmed">
              月ごとのリクエスト可能数は、
              <a
                href="https://docs.shrimpia.network/services/shrimpia-plus/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Shrimpia+
              </a>
              ページをご確認ください。
            </small>
          </div>

          {limit > 0 && (
            <Card>
              {error?.length > 0 &&
                error.map((e) => (
                  <Alert className="lu-mb-4" variant="danger" icon="bi-exclamation-triangle-fill" key={"error-" + e}>
                    {e}
                  </Alert>
                ))}

              <Alert className="lu-mb-4" variant="info">
                アップロードする前に、
                <br />
                <a
                  href={URL_AVATAR_DECORATION_REQUEST_GUIDELINES}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  アバターデコレーション申請ガイドライン
                </a>
                を必ずお読みください！
              </Alert>

              <div
                className={uploadAreaStyle}
                data-active={isDragActive ? "" : undefined}
                {...getRootProps()}
              >
                <input {...getInputProps()} />
                {file && (
                  <div className="lu-mb-2">
                    <span>{file.name} - </span>
                    <span
                      className={
                        isFileSizeValid ? "text-success" : "text-danger"
                      }
                    >
                      {fileSizeInMB} MB{" "}
                      <i
                        className={`bi bi-${isFileSizeValid ? "check" : "x"}-circle-fill`}
                      />
                    </span>
                  </div>
                )}
                {isDragActive ? (
                  <span>
                    そう、その調子！
                    <br />
                    さあ、その画像をこちらへ…！
                  </span>
                ) : (
                  <span>
                    このエリアに画像をドロップするか、
                    <br />
                    クリック（あるいはタップ）してください
                  </span>
                )}
              </div>

              {imgDataUrl && file && (
                <Stack as="form" onSubmit={handleSubmit(onSubmit)} gap={4} className="lu-mt-6">
                  <Stack gap={1} className="lu-text-center">
                    <div>
                      以下のプレビューを見て、表示に問題がないことを確認してください。
                    </div>
                    <div className={previewContainerStyle}>
                      <Image
                        src={avatarDecorationTemplate}
                        alt="テンプレート"
                        className={decorationTemplateStyle}
                        fluid
                      />
                      {isShowingIcon && (
                        <Image
                          src={user.avatarUrl}
                          alt="ユーザーアイコン"
                          className={avatarStyle}
                          roundedCircle
                          fluid
                        />
                      )}
                      <Image
                        src={imgDataUrl}
                        alt="プレビュー"
                        className={decorationStyle}
                        fluid
                      />
                    </div>
                    <div className="lu-mx-auto">
                      <Switch
                        checked={isShowingIcon}
                        onChange={(e) => setShowingIcon(e.target.checked)}
                      >
                        ユーザーアイコンを表示
                      </Switch>
                    </div>
                  </Stack>

                  <Textfield
                    title={<>デコレーション名 <span className="lu-text-danger">*</span></>}
                    placeholder="例: キラキラ"
                    {...register("name")}
                    onChange={(e) => {
                      register("name").onChange(e);
                      setName(e.target.value);
                    }}
                    invalid={!!errors.name}
                    caption={errors.name?.message}
                  />

                  <Textarea
                    title="デコレーションの説明"
                    rows={3}
                    placeholder="例: アイコンをキラキラさせるデコレーションです"
                    {...register("description")}
                    onChange={(e) => {
                      register("description").onChange(e);
                      setDescription(e.target.value);
                    }}
                    invalid={!!errors.description}
                    caption={errors.description?.message}
                  />

                  <Checkbox
                    {...register("agreedToGuidelines")}
                    onChange={(e) => {
                      register("agreedToGuidelines").onChange(e);
                      setAgreedToGuidelines(e.target.checked);
                    }}
                    error={errors.agreedToGuidelines?.message}
                  >
                    <a
                      href={URL_AVATAR_DECORATION_REQUEST_GUIDELINES}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      ガイドライン
                    </a>
                    を読み、同意しました
                  </Checkbox>

                  <Stack direction="horizontal" gap={2}>
                    <Button
                      onClick={() => navigate("/avatar-decoration-request")}
                    >
                      キャンセル
                    </Button>
                    <Button
                      type="submit"
                      variant="primary"
                      disabled={!isValid}
                    >
                      申請する
                    </Button>
                  </Stack>
                </Stack>
              )}
            </Card>
          )}
        </>
      )}

      {/* 確認ダイアログ */}
      <Dialog
        open={showConfirmDialog}
        onClose={() => setShowConfirmDialog(false)}
        title="申請の確認"
        actions={
          <>
            <Button onClick={() => setShowConfirmDialog(false)}>キャンセル</Button>
            <Button variant="primary" onClick={handleConfirmSubmit}>
              申請する
            </Button>
          </>
        }
      >
          <p>
            以下の内容でアバターデコレーションを申請します。よろしいですか？
          </p>
          <Stack gap={2}>
            <div>
              <strong>デコレーション名:</strong> {name}
            </div>
            {description && (
              <div>
                <strong>説明:</strong> {description}
              </div>
            )}
            {imgDataUrl && (
              <div className="lu-text-center lu-mt-4">
                <div className={previewContainerStyle}>
                  {isShowingIcon && user && (
                    <Image
                      src={user.avatarUrl}
                      alt="ユーザーアイコン"
                      className={avatarStyle}
                      roundedCircle
                      fluid
                    />
                  )}
                  <Image
                    src={imgDataUrl}
                    alt="プレビュー"
                    className={decorationStyle}
                    fluid
                  />
                </div>
              </div>
            )}
          </Stack>
        </Dialog>
    </Container>
  );
};

export default AvatarDecorationRequestNewPage;

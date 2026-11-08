import { css } from "@linaria/core";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import type { AvatarDecorationRequest } from "@/types/avatar-decoration-request";

import avatarDecorationTemplate from "@/assets/avatar-decoration-template.png";
import { AutoCollapse } from "@/components/common/AutoCollapse";
import { MfmView } from "@/components/common/MfmView";
import { UserLinkView } from "@/components/common/UserLinkView";
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Image } from '@/components/ui/Image';
import { Spinner } from '@/components/ui/Spinner';
import { Stack } from '@/components/ui/Stack';
import { useWithSpinner } from "@/hooks/useWithSpinner";
import { useAPI } from "@/services/api";
import { getImageSize } from "@/services/get-image-size";
import { adminPendingAvatarDecorationRequestsAtom } from "@/states/avatar-decoration-request";

const previewContainerStyle = css`
  position: relative;
  max-width: 256px;
  max-height: 256px;
  width: 100%;
  aspect-ratio: 1 / 1;
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

export type RequestCardProps = {
  request: AvatarDecorationRequest;
  showPreview?: boolean;
  details?: boolean;
};

export const RequestCard: React.FC<RequestCardProps> = ({
  request: r,
  details,
  showPreview,
}) => {
  const [type, setType] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<string | null>(null);
  const [fileSizeInMB, setFileSizeInMB] = useState<string | null>(null);

  const [{ refetch }] = useAtom(adminPendingAvatarDecorationRequestsAtom);
  const api = useAPI();
  const navigate = useNavigate();
  const withSpinner = useWithSpinner();

  const staffComment = r.staffComment?.trim();
  const noText = <span className="lu-text-dimmed">未記入</span>;

  const approve = () => {
    const confirmed = confirm(
      `アバターデコレーションの申請「${r.name}」を承認し、Misskeyに追加します。本当によろしいですか？`,
    );
    if (!confirmed) return;

    withSpinner(async () => {
      try {
        await api.admin.approveAvatarDecorationRequest(r.id);
        await refetch();
        if (details) {
          navigate("/admin/avatar-decoration-requests");
        }
      } catch (e) {
        if (e instanceof Error) {
          alert("失敗しました。\n\n技術情報: " + e.message);
        }
        console.error(e);
      }
    });
  };

  const reject = () => {
    const reason = prompt(
      `アバターデコレーションの申請「${r.name}」を却下します。本当によろしいですか？\n\n問題なければ、却下の理由を記入してください。\n（一部のMFMが利用できます。）`,
    );
    if (reason == null) return;

    withSpinner(async () => {
      try {
        await api.admin.rejectAvatarDecorationRequest(r.id, reason);
        await refetch();
        if (details) {
          navigate("/admin/avatar-decoration-requests");
        }
      } catch (e) {
        if (e instanceof Error) {
          alert("失敗しました。\n\n技術情報: " + e.message);
        }
        console.error(e);
      }
    });
  };

  useEffect(() => {
    setType(null);
    setImageSize(null);
    setFileSizeInMB(null);
    if (!details) {
      return;
    }
    fetch(r.url)
      .then((res) => res.blob())
      .then((blob) => {
        setType(blob.type);
        setFileSizeInMB((blob.size / 1024 / 1024).toPrecision(3));
        getImageSize(blob).then(({ width, height }) => {
          setImageSize(`${width} × ${height} [px]`);
        });
      });
  }, [r.url, details]);

  return (
    <Card>
      <Card.Title>{r.name}</Card.Title>
      <Stack gap={4}>
        <div className={previewContainerStyle}>
          {showPreview && (
            <Image
              src={avatarDecorationTemplate}
              alt="テンプレート"
              className={overlayImageStyle}
              fluid
            />
          )}
          <Image
            src={r.url}
            alt={r.name}
            backdrop
            style={{ width: "100%" }}
            fluid
          />
        </div>
        <div>
          {!details ? (
            <Stack gap={4}>
              <div>
                <h6>申請者</h6>
                <UserLinkView username={r.username} />
              </div>
              {r.description && (
                <div>
                  <h6>説明</h6>
                  <AutoCollapse>
                    <div className="lu-text-dimmed border-start lu-px-2 lu-mb-0">
                      <MfmView>{r.description}</MfmView>
                    </div>
                  </AutoCollapse>
                </div>
              )}
            </Stack>
          ) : (
            <table style={{ width: 'auto', marginBottom: 0 }}>
              <tbody>
                <tr>
                  <th>
                    <i className="bi bi-card-image" /> ファイル形式
                  </th>
                  <td>
                    {type != null ? (
                      type || (
                        <span className="lu-text-dimmed">
                          取得できませんでした。
                        </span>
                      )
                    ) : (
                      <Spinner size="sm" />
                    )}
                  </td>
                </tr>
                <tr>
                  <th>
                    <i className="bi bi-pie-chart-fill" /> ファイルサイズ
                  </th>
                  <td>
                    {fileSizeInMB != null ? (
                      `${fileSizeInMB} MB`
                    ) : (
                      <Spinner size="sm" />
                    )}
                  </td>
                </tr>
                <tr>
                  <th>
                    <i className="bi bi-aspect-ratio-fill" /> 画像の大きさ
                  </th>
                  <td>
                    {imageSize != null ? imageSize : <Spinner size="sm" />}
                  </td>
                </tr>
                <tr>
                  <th>
                    <i className="bi bi-person-circle" /> 申請者
                  </th>
                  <td>
                    <UserLinkView username={r.username} />
                  </td>
                </tr>
                <tr>
                  <th>
                    <i className="bi bi-chat-left-heart-fill" /> 説明
                  </th>
                  <td>
                    {r.description ? (
                      <MfmView>{r.description}</MfmView>
                    ) : (
                      noText
                    )}
                  </td>
                </tr>
                {r.status !== "pending" && (
                  <>
                    <tr>
                      <th>
                        <i className="bi bi-eye-fill" /> 作業スタッフ
                      </th>
                      <td>
                        <UserLinkView username={r.processerName} />
                      </td>
                    </tr>
                    <tr>
                      <th>
                        <i className="bi bi-chat-right-heart-fill" />{" "}
                        スタッフからのコメント
                      </th>
                      <td>
                        {staffComment ? (
                          <MfmView>{staffComment}</MfmView>
                        ) : (
                          noText
                        )}
                      </td>
                    </tr>
                  </>
                )}
              </tbody>
            </table>
          )}
        </div>
        {!details && (
          <div>
            <Link to={`/admin/avatar-decoration-requests/${r.id}`}>
              詳細を見る
            </Link>
          </div>
        )}

        {r.status === "pending" && (
          <Stack direction="horizontal" gap={4}>
            <Button variant="primary" onClick={approve}>
              <i className="bi bi-check2" /> 承認
            </Button>
            <Button onClick={reject}>
              <i className="bi bi-x-lg" /> 却下
            </Button>
          </Stack>
        )}
      </Stack>
    </Card>
  );
};

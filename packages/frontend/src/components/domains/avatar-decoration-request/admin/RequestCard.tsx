import { css } from "@linaria/core";
import { useAtom } from "jotai";
import React, { useEffect, useState } from "react";
import { Button, Card, Image, Spinner, Stack, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

import type { AvatarDecorationRequest } from "@/types/avatar-decoration-request";

import avatarDecorationTemplate from "@/assets/avatar-decoration-template.png";
import { AutoCollapse } from "@/components/common/AutoCollapse";
import { MfmView } from "@/components/common/MfmView";
import { UserLinkView } from "@/components/common/UserLinkView";
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
  const noText = <span className="text-muted">未記入</span>;

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
      <Card.Body>
        <Card.Title>{r.name}</Card.Title>
        <Stack gap={3}>
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
              className="bg-dark rounded p-2"
              style={{ width: "100%" }}
              fluid
            />
          </div>
          <div>
            {!details ? (
              <Stack gap={3}>
                <div>
                  <h2 className="fs-6 fw-bold">申請者</h2>
                  <UserLinkView username={r.username} />
                </div>
                {r.description && (
                  <div>
                    <h2 className="fs-6 fw-bold">説明</h2>
                    <AutoCollapse>
                      <div className="text-muted border-start px-2 mb-0">
                        <MfmView>{r.description}</MfmView>
                      </div>
                    </AutoCollapse>
                  </div>
                )}
              </Stack>
            ) : (
              <Table
                striped
                hover
                borderless
                className="mb-0 w-auto"
                style={{ "--bs-table-bg": "transparent" } as any}
              >
                <tbody>
                  <tr>
                    <th>
                      <i className="bi bi-card-image" /> ファイル形式
                    </th>
                    <td>
                      {type != null ? (
                        type || (
                          <span className="text-muted">
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
              </Table>
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
            <Stack direction="horizontal" gap={3}>
              <Button variant="success" onClick={approve}>
                <i className="bi bi-check2" /> 承認
              </Button>
              <Button variant="primary" onClick={reject}>
                <i className="bi bi-x-lg" /> 却下
              </Button>
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
};

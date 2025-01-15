import { useAtom, useAtomValue } from 'jotai';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Spinner, Stack, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import type { EmojiRequest } from '@/types/emoji-request';

import { AutoCollapse } from '@/components/common/AutoCollapse';
import { MfmView } from '@/components/common/MfmView';
import { UserLinkView } from '@/components/common/UserLinkView';
import { EmojiPreview } from '@/components/domains/emoji-request/EmojiPreview';
import { useWithSpinner } from '@/hooks/useWithSpinner';
import { useAPI } from '@/services/api';
import { getImageSize } from '@/services/get-image-size';
import { adminPendingEmojiRequestsAtom } from '@/states/emoji-request';


const parseComment = (comment: string | null) => {
  if (!comment?.trim()) return null;

  const data = {
    fontName: null as string | null,
    fontSource: null as string | null,
    kana: null as string | null,
    description: '',
  };

  const lines = comment.trim().split('\n');

  for (const line of lines) {
    if (line.startsWith('フォント名: ')) {
      data.fontName = line.slice('フォント名: '.length);
    } else if (line.startsWith('よみがな: ')) {
      data.kana = line.slice('よみがな: '.length);
    } else if (line.startsWith('フォント入手元: ')) {
      data.fontSource = line.slice('フォント入手元: '.length);
    } else {
      data.description += line + '\n';
    }
  }

  return data;
};

export type RequestCardProps = {
    request: EmojiRequest;
    details?: boolean;
};

export const RequestCard: React.FC<RequestCardProps> = ({ request: r, details }) => {
  const [type, setType] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<string | null>(null);
  const [fileSizeInKB, setFileSizeInKB] = useState<string | null>(null);
  
  const [{refetch}] = useAtom(adminPendingEmojiRequestsAtom);
  const api = useAPI();
  const navigate = useNavigate();
  const withSpinner = useWithSpinner();

  const comment = useMemo(() => parseComment(r.comment), [r.comment]);
  const staffComment = useMemo(() => r.staffComment?.trim(), [r.staffComment]);

  const noText = useMemo(() => <span className="text-muted">未記入</span>, []);

  const approve = () => {
    const tag = prompt(`絵文字の申請 :${r.name}: を承認し、Misskeyに追加します。本当によろしいですか？\n\n問題なければ、この絵文字用のタグを記入してください。`);
    if (tag == null) return;

    withSpinner(async () => {
      try {
        await api.admin.approveEmojiRequest(r.id, tag);
        await refetch();
        if (details) {
          navigate('/admin/emoji-requests');
        }
      } catch (e) {
        if (e instanceof Error) {
          alert('失敗しました。\n\n技術情報: ' + e.message);
        }
        console.error(e);
      }
    });
  };

  const reject = () => {
    const reason = prompt(`絵文字の申請 :${r.name}: を却下します。本当によろしいですか？\n\n問題なければ、却下の理由を記入してください。\n（一部のMFMが利用できます。）`);
    if (reason == null) return;

    withSpinner(async () => {
      try {
        await api.admin.rejectEmojiRequest(r.id, reason);
        await refetch();
        if (details) {
          navigate('/admin/emoji-requests');
        }
      } catch (e) {
        if (e instanceof Error) {
          alert('失敗しました。\n\n技術情報: ' + e.message);
        }
        console.error(e);
      }
    });
  };

  useEffect(() => {
    setType(null);
    setImageSize(null);
    setFileSizeInKB(null);
    if (!details) {
      return;
    }
    fetch(r.url).then(res => res.blob()).then(blob => {
      setType(blob.type);
      setFileSizeInKB((blob.size / 1024).toPrecision(4));
      getImageSize(blob).then(({ width, height }) => {
        setImageSize(`${width} × ${height} [px]`);
      });
    });
  }, [r.url, details]);

  return (
    <Card>
      <Card.Body>
        <Card.Title>:{r.name}:</Card.Title>
        <Stack gap={3}>
          <EmojiPreview src={r.url} />
          <div>
            {!details ? (
              <Stack gap={3}>
                <div>
                  <h2 className="fs-6 fw-bold">申請者</h2>
                  <UserLinkView username={r.username} />
                </div>
                <div>
                  <h2 className="fs-6 fw-bold">コメント</h2>
                  {r.comment.trim() ? (
                    <AutoCollapse>
                      <div className="text-muted border-start px-2 mb-0"><MfmView>{r.comment}</MfmView></div>
                    </AutoCollapse>
                  ) : (
                    <div className="text-muted">なし</div>
                  )}
                </div>
              </Stack>
            ) : (
              <Table striped hover borderless className="mb-0 w-auto" style={{ '--bs-table-bg': 'transparent' } as any}>
                <tbody>
                  <>
                    <tr>
                      <th><i className="bi bi-card-image" /> ファイル形式</th>
                      <td>{type != null ? (type || <span className="text-muted">取得できませんでした。</span>) : <Spinner size="sm" />}</td>
                    </tr>
                    <tr>
                      <th><i className="bi bi-pie-chart-fill" /> ファイルサイズ</th>
                      <td>{fileSizeInKB != null ? `${fileSizeInKB} KB` : <Spinner size="sm" />}</td>
                    </tr>
                    <tr>
                      <th><i className="bi bi-aspect-ratio-fill" /> 画像の大きさ</th>
                      <td>{imageSize != null ? imageSize : <Spinner size="sm" />}</td>
                    </tr>
                  </>
                  <tr>
                    <th><i className="bi bi-person-circle" /> 申請者</th>
                    <td>{<UserLinkView username={r.username} />}</td>
                  </tr>
                  {comment && (
                    <>
                      {comment.fontName && (
                        <tr>
                          <th><i className="bi bi-fonts" /> 使用フォント</th>
                          <td>{comment.fontName || noText}</td>
                        </tr>
                      )}
                      {comment.fontSource && (
                        <tr>
                          <th><i className="bi bi-link-45deg" /> フォント入手元</th>
                          <td>{comment.fontSource || noText}</td>
                        </tr>
                      )}
                      {comment.kana && (
                        <tr>
                          <th><i className="bi bi-type" /> ふりがな</th>
                          <td>{comment.kana || noText}</td>
                        </tr>
                      )}
                      <tr>
                        <th><i className="bi bi-chat-left-heart-fill" /> コメント</th>
                        <td>{comment.description ? <MfmView>{comment.description}</MfmView> : noText}</td>
                      </tr>
                    </>
                  )}
                  {r.status !== 'pending' && (
                    <>
                      <tr>
                        <th><i className="bi bi-eye-fill" /> 作業スタッフ</th>
                        <td>{<UserLinkView username={r.processerName} />}</td>
                      </tr>
                      <tr>
                        <th><i className="bi bi-chat-right-heart-fill" /> スタッフからのコメント</th>
                        <td>{staffComment ? <MfmView>{staffComment}</MfmView> : noText}</td>
                      </tr>
                    </>
                  )}
                </tbody>
              </Table>
            )}
          </div>
          {!details && (
            <div>
              <Link to={`/admin/emoji-requests/${r.id}`}>
                詳細を見る
              </Link>
            </div>
          )}
          
          {r.status === 'pending' && (
            <Stack direction="horizontal" gap={3}>
              <Button variant="success" onClick={approve}><i className="bi bi-check2" /> 承認</Button>
              <Button variant="primary" onClick={reject}><i className="bi bi-x-lg" /> 却下</Button>
            </Stack>
          )}
        </Stack>
      </Card.Body>
    </Card>
  );
};

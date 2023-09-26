import { useAtomValue } from 'jotai';
import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Spinner, Stack, Table } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { useWithSpinner } from '../../../../hooks/useWithSpinner';
import { useAPI } from '../../../../services/api';
import { getImageSize } from '../../../../services/get-image-size';
import { adminPendingEmojiRequestsStatusAtom } from '../../../../states/emoji-request';
import { EmojiPreview } from '../../../views/EmojiPreview';
import { RichText } from '../../../views/RichText';
import { UserLinkView } from '../../../views/UserLinkView';

import type { EmojiRequest } from '../../../../types/emoji-request';

const parseComment = (comment: string | null) => {
  if (!comment?.trim()) return null;

  const data = {
    fontName: null as string | null,
    kana: null as string | null,
    description: '',
  };

  const lines = comment.trim().split('\n');

  for (const line of lines) {
    if (line.startsWith('フォント名: ')) {
      data.fontName = line.slice('フォント名: '.length);
    } else if (line.startsWith('よみがな: ')) {
      data.kana = line.slice('よみがな: '.length);
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
  
  const stat = useAtomValue(adminPendingEmojiRequestsStatusAtom);
  const api = useAPI();
  const navigate = useNavigate();
  const withSpinner = useWithSpinner();

  const comment = useMemo(() => parseComment(r.comment), [r.comment]);
  const staffComment = useMemo(() => r.staffComment?.trim() || 'なし', [r.staffComment]);

  const approve = () => {
    const tag = prompt(`絵文字の申請 :${r.name}: を承認し、Misskeyに追加します。本当によろしいですか？\n\n問題なければ、この絵文字用のタグを記入してください。`);
    if (tag == null) return;

    withSpinner(async () => {
      try {
        await api.admin.approveEmojiRequest(r.id, tag);
        await stat.refetch();
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
    const reason = prompt(`絵文字の申請 :${r.name}: を却下します。本当によろしいですか？\n\n問題なければ、却下の理由を記入してください。`);
    if (reason == null) return;

    withSpinner(async () => {
      try {
        await api.admin.rejectEmojiRequest(r.id, reason);
        await stat.refetch();
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
                    <RichText className="text-muted border-start px-2 mb-0">{r.comment}</RichText>
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
                      <td>{fileSizeInKB != null ? `${fileSizeInKB}KB` : <Spinner size="sm" />}</td>
                    </tr>
                    <tr>
                      <th><i className="bi bi-aspect-ratio-fill" /> 画像の大きさ</th>
                      <td>{imageSize != null ? imageSize : <Spinner size="sm" />}</td>
                    </tr>
                  </>
                  <tr>
                    <th><i className="bi bi-person-circle" /> 申請者</th>
                    <td>{r.username ? <UserLinkView username={r.username} /> : '不明'}</td>
                  </tr>
                  {comment && (
                    <>
                      {comment.fontName && (
                        <tr>
                          <th><i className="bi bi-fonts" /> 使用フォント</th>
                          <td>{comment.fontName || '未記入'}</td>
                        </tr>
                      )}
                      {comment.kana && (
                        <tr>
                          <th><i className="bi bi-type" /> ふりがな</th>
                          <td>{comment.kana || '未記入'}</td>
                        </tr>
                      )}
                      <tr>
                        <th><i className="bi bi-chat-left-heart-fill" /> コメント</th>
                        <td>{<RichText>{comment.description || '未記入'}</RichText>}</td>
                      </tr>
                    </>
                  )}
                  {r.status !== 'pending' && (
                    <>
                      <tr>
                        <th><i className="bi bi-eye-fill" /> 作業スタッフ</th>
                        <td>{r.processerName ? <UserLinkView username={r.processerName} /> : '不明'}</td>
                      </tr>
                      <tr>
                        <th><i className="bi bi-chat-right-heart-fill" /> スタッフからのコメント</th>
                        <td>{<RichText>{staffComment || '未記入'}</RichText>}</td>
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
          <Stack direction="horizontal" gap={3}>
            <Button variant="success" onClick={approve}><i className="bi bi-check2" /> 承認</Button>
            <Button variant="primary" onClick={reject}><i className="bi bi-x-lg" /> 却下</Button>
          </Stack>
        </Stack>
      </Card.Body>
    </Card>
  );
};

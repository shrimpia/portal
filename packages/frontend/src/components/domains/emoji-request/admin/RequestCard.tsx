import { useAtomValue } from 'jotai';
import React, { useEffect, useState } from 'react';
import { Button, Card, Spinner, Stack } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

import { useWithSpinner } from '../../../../hooks/useWithSpinner';
import { useAPI } from '../../../../services/api';
import { getImageSize } from '../../../../services/get-image-size';
import { adminPendingEmojiRequestsStatusAtom } from '../../../../states/emoji-request';
import { EmojiPreview } from '../../../views/EmojiPreview';
import { RichText } from '../../../views/RichText';
import { UserLinkView } from '../../../views/UserLinkView';

import type { EmojiRequest } from '../../../../types/emoji-request';

export type RequestCardProps = {
    request: EmojiRequest;
    details?: boolean;
};

export const RequestCard: React.FC<RequestCardProps> = ({ request: r, details }) => {
  // const [type, setType] = useState<string | null>(null);
  const [imageSize, setImageSize] = useState<string | null>(null);
  const [fileSizeInKB, setFileSizeInKB] = useState<string | null>(null);
  
  const stat = useAtomValue(adminPendingEmojiRequestsStatusAtom);
  const api = useAPI();
  const navigate = useNavigate();
  const withSpinner = useWithSpinner();

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
    // setType(null);
    setImageSize(null);
    setFileSizeInKB(null);
    if (!details) {
      return;
    }
    fetch(r.url).then(res => res.blob()).then(blob => {
      // setType(blob.type);
      setFileSizeInKB((blob.size / 1024).toPrecision(4));
      getImageSize(blob).then(({ width, height }) => {
        setImageSize(`${width}px × ${height}px`);
      });
    });
  }, [r.url, details]);

  return (
    <Card>
      <Card.Body>
        <Card.Title>:{r.name}:</Card.Title>
        <EmojiPreview className="mb-3" src={r.url} />
        <Card.Text>
          <h2 className="fs-6 fw-bold">申請者</h2>
          <UserLinkView username={r.username} />
        </Card.Text>
        {details && (
          <Card.Text>
            <h2 className="fs-6 fw-bold">ファイル形式</h2>
            {fileSizeInKB != null && imageSize != null ? (
              <ul>
                <li>ファイルサイズ: {fileSizeInKB}KB</li>
                <li>画像の大きさ: {imageSize}</li>
              </ul>
            ) : (<Spinner size="sm" />)}
          </Card.Text>
        )}
        <Card.Text>
          <h2 className="fs-6 fw-bold">コメント</h2>
          {r.comment.trim() ? (
            <RichText className="text-muted border-start px-2 mb-0">{r.comment}</RichText>
          ) : (
            <div className="text-muted">なし</div>
          )}
        </Card.Text>
        {!details && (
          <div className="mb-3">
            <Link to={`/admin/emoji-requests/${r.id}`}>
              詳細を見る
            </Link>
          </div>
        )}
        <Stack direction="horizontal" gap={3}>
          <Button variant="success" onClick={approve}><i className="bi bi-check2" /> 承認</Button>
          <Button variant="primary" onClick={reject}><i className="bi bi-x-lg" /> 却下</Button>
        </Stack>
      </Card.Body>
    </Card>
  );
};

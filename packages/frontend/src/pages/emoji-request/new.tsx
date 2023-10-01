
import { useAtomValue } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Button, Card, Container, Form, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import type { ChangeEvent } from 'react';

import { EmojiPreview } from '@/components/domains/emoji-request/EmojiPreview';
import { useWithSpinner } from '@/hooks/useWithSpinner';
import { useAPI } from '@/services/api';
import { remainingEmojiRequestLimitAtom, userAtom } from '@/states/user';

import './new.scss';

const namePattern = /^[a-z0-9_]+$/;

const EmojiRequestNewPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgDataUrl, setImgDataUrl] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [isDecoMoji, setDecoMoji] = useState(false);
  const [fontName, setFontName] = useState('');
  const [yomigana, setYomigana] = useState('');
  const [comment, setComment] = useState('');
  const [isAgreeToGuideline, setAgreeToGuideline] = useState(false);

  const limit = useAtomValue(remainingEmojiRequestLimitAtom);
  const user = useAtomValue(userAtom);

  const withSpinner = useWithSpinner();
  const api = useAPI();
  const navigate = useNavigate();

  const limitMessage = useMemo(() => {
    if (user?.canManageCustomEmojis || user?.isEmperor) {
      return 'スタッフのため、無制限に申請できます。';
    }
    if (limit > 0) {
      return `今月はあと${limit}つ申請できます。`;
    } else {
      return '今月はこれ以上申請できません。';
    }
  }, [limit, user?.canManageCustomEmojis, user?.isEmperor]);

  const fileSizeInKB = useMemo(() => (file ? (file.size / 1024).toPrecision(4) : 0), [file]);
  const isFileSizeValid = useMemo(() => (file && file.size <= 200 * 1024), [file]);
  const isNameValid = useMemo(() => namePattern.test(name), [name]);
  const isCompleted = useMemo(() => isFileSizeValid && isNameValid && isAgreeToGuideline, [isAgreeToGuideline, isFileSizeValid, isNameValid]);
  const composedComment = useMemo(() => isDecoMoji ? (
    `フォント名: ${fontName}\nよみがな: ${yomigana}\n\n${comment}`
  ) : comment, [isDecoMoji, fontName, yomigana, comment]);

  const onClickButtonFileName = useCallback(() => {
    if (!file) return;
    setName(file.name.replace(/\.[^/.]+$/, '').toLowerCase().replace(/[\s-]/g, '_'));
  }, [file]);

  const uploadFile = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    setFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setImgDataUrl(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  const post = useCallback(async () => {
    if (!file) return;
    if (!confirm('本当にこの内容で申請しますか？\n\n申請後は取り消せません。不備がないことを再度ご確認ください。')) return;
  
    try {
      await withSpinner(() => api.createEmojiRequest(file, name, composedComment));
      alert('申請しました。');
      navigate('/emoji-request');
    } catch (e) {
      if (e instanceof Error) {
        alert('申請に失敗しました。\n\n技術情報: ' + e.message);
      }
      console.error(e);
    }
  }, [api, composedComment, file, name, navigate, withSpinner]);

  return (
    <Container>
      <h1 className="fs-3 mb-5">カスタム絵文字の追加申請</h1>
      <Form>
        <Stack direction="vertical" gap={3}>
          <Alert variant={limit > 0 ? 'info' : 'danger'}>
            <Alert.Heading>{limitMessage}</Alert.Heading>
            <ul className="mb-0">
              <li>申請可能な枠の数は毎月1日にリセットされます</li>
              <li>枠の数は、加入しているShrimpia+のプランによって異なります
                <ul>
                  <li>
                    詳しくは
                    <a href="https://docs.shrimpia.network/Shrimpia-ca2cb8697df5405393d9167cd98835ee" target="_blank" rel="noreferrer noopener">
                      Shrimpia+のプラン一覧
                    </a>
                    をご覧ください
                  </li>
                </ul>
              </li>
            </ul>
          </Alert>
          {limit > 0 ? (
            <>
              <Card bg="dark">
                <Card.Body>
                  <Form.Group controlId="image">
                    <Form.Label className="fw-bold">絵文字に使用する画像</Form.Label>
                    <Form.Control type="file" accept="image/*" onChange={uploadFile} />
                    <Form.Text className={isFileSizeValid ?? true ? 'text-muted' : 'text-danger'}>
                      画像のサイズは200KB以下でなければいけません。
                    </Form.Text>
            
                    {imgDataUrl && file && (
                      <EmojiPreview src={imgDataUrl}>
                        <div className={isFileSizeValid ? 'text-success' : 'text-danger'}>
                          {fileSizeInKB} KB <i className={`bi bi-${isFileSizeValid ? 'check' : 'x'}-circle-fill`} />
                        </div>
                      </EmojiPreview>
                    )}
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card bg="dark">
                <Card.Body>
                  <Form.Group controlId="name">
                    <Form.Label className="fw-bold">絵文字の名前</Form.Label>
                    {file && <Button size="sm" className="ms-2" onClick={onClickButtonFileName}>ファイル名を反映する</Button>}
                    <Form.Control className="mt-2" type="text" value={name} placeholder="例: lutica_dadakone" onChange={e => setName(e.target.value)} />
                    <Form.Text className={name == '' || isNameValid ? 'text-muted' : 'text-danger'}>
                      絵文字の入力時に用いる名前です。<br/>小文字の英数字およびアンダースコア（_）のみが利用できます。
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card bg="dark">
                <Card.Body>
                  <Form.Switch>
                    <Form.Check.Input id="isDecoMoji" type="checkbox" checked={isDecoMoji} onChange={e => setDecoMoji(e.target.checked)} />
                    <Form.Check.Label htmlFor="isDecoMoji">
                      <b>デコ文字である</b><br/>
                      <Form.Text muted>画像が主に文字列で構成される場合は、必ず <b>オン</b> にしてください。</Form.Text>
                    </Form.Check.Label>
                  </Form.Switch>
                  {isDecoMoji && (
                    <>
                      <hr />
                      <Stack direction="vertical" gap={3}>
                        <Form.Group controlId="fontName">
                          <Form.Label className="fw-bold">フォントの名前</Form.Label>
                          <Form.Control type="text" value={fontName} placeholder="例: M PLUS Rounded 1c" onChange={e => setFontName(e.target.value)} />
                          <Form.Text muted>
                            正確に記載してください。不備がある場合、却下される可能性があります。<br />
                            MEGAMOJI等のツールを用いて作成した場合は、ツール名と選択したフォント名をご記入ください。<br/>
                            手描きの場合は、その旨を記載してください。
                          </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="yomigana">
                          <Form.Label className="fw-bold">読み仮名</Form.Label>
                          <Form.Control type="text" value={yomigana} placeholder="例: かいしゃくちがい" onChange={e => setYomigana(e.target.value)} />
                          <Form.Text muted>漢字を含む場合は、できればご記入ください。意図する通りの読み方でタグを設定するために使用されます。</Form.Text>
                        </Form.Group>
                      </Stack>
                    </>
                  )}
                </Card.Body>
              </Card>
              <Card bg="dark">
                <Card.Body>
                  <Form.Group className="mb-3" controlId="comment">
                    <Form.Label className="fw-bold">コメント</Form.Label>
                    <Form.Control as="textarea" rows={6} value={comment} onChange={e => setComment(e.target.value)} />
                    <Form.Text muted>
                      <strong>代理申請の場合は、必ず作成者のユーザー名を明記してください。</strong><br/>
                      その他、画像に何らかの元ネタがある場合など、スタッフが知っておくべき背景がある場合は、その旨を詳細に記入してください。
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Form.Group controlId="agreeToGuideline">
                <Alert variant="warning">
                  投稿する絵文字は、必ず
                  <a href="https://docs.shrimpia.network/a6fe11f1441f4a51912069a218dbc9e9" target="_blank" rel="noreferrer noopener">
                  絵文字ガイドライン
                  </a>
                  を遵守する必要があります！
                  <Form.Check className="mt-2" type="checkbox" checked={isAgreeToGuideline} label="絵文字ガイドラインに同意する" onChange={e => setAgreeToGuideline(e.target.checked)} />
                </Alert>
              </Form.Group>
              <Button size="lg" className="mx-auto mt-5 px-5 fw-bold" disabled={!isCompleted} onClick={post}>この内容で申請する</Button>
            </>
          ) : (
            <Button as={Link as any} to="/emoji-request" size="lg" variant="outline-primary" className="mx-auto px-5 fw-bold">もどる</Button>
          )}
        </Stack>
      </Form>
    </Container>
  );
};

export default EmojiRequestNewPage;

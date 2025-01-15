
import { useAtom } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { Alert, Button, Card, Container, Form, Spinner, Stack } from 'react-bootstrap';
import { useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import type { ChangeEvent } from 'react';

import { EmojiPreview } from '@/components/domains/emoji-request/EmojiPreview';
import { URL_EMOJI_REQUEST_GUIDELINES } from '@/consts';
import { useWithSpinner } from '@/hooks/useWithSpinner';
import { useAPI } from '@/services/api';
import { remainingEmojiRequestLimitAtom, userAtom } from '@/states/user';

import './Legacy.scss';

const namePattern = /^[a-z0-9_]+$/;

const LegacyEmojiRequestFormPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [imgDataUrl, setImgDataUrl] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [isDecoMoji, setDecoMoji] = useState(false);
  const [fontName, setFontName] = useState('');
  const [fontSource, setFontSource] = useState('');
  const [yomigana, setYomigana] = useState('');
  const [comment, setComment] = useState('');
  const [isAgreeToGuideline, setAgreeToGuideline] = useState(false);
  const [emojiNameState, setEmojiNameState] = useState<'initial' | 'valid' | 'invalid' | 'loading'>('initial');

  const [{data: limit}] = useAtom(remainingEmojiRequestLimitAtom);
  const [{data: user}] = useAtom(userAtom);

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
  const canSubmit = useMemo(
    () => isFileSizeValid && isNameValid && isAgreeToGuideline && emojiNameState === 'valid' && comment.length <= 500,
    [comment.length, emojiNameState, isAgreeToGuideline, isFileSizeValid, isNameValid],
  );
  const composedComment = useMemo(() => isDecoMoji ? (
    `フォント名: ${fontName}\nフォント入手元: ${fontSource}\nよみがな: ${yomigana}\n\n${comment}`
  ) : comment, [isDecoMoji, fontName, fontSource, yomigana, comment]);

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

  const checkEmojiNameDuplicated = useCallback(async () => {
    if (!isNameValid) return;
    setEmojiNameState('loading');
    const isDuplicated = await api.isDuplicatedEmojiName(name);
    setEmojiNameState(isDuplicated ? 'invalid' : 'valid');
  }, [api, isNameValid, name]);

  return (
    <Container>
      <h1 className="fs-3 mb-5">カスタム絵文字の追加申請</h1>
      <Alert variant="success">
        <i className="bi bi-stars" /> 絵文字申請フォームをリニューアルしました！<br/>
        より整理された新フォームを試すには、<Link to="/settings">設定</Link>から「カスタム絵文字の追加申請フォームを従来版に戻す」をオフにしてください。
      </Alert>
      <Form>
        <Stack direction="vertical" gap={3}>
          <Alert variant={limit > 0 ? 'info' : 'danger'}>
            <Alert.Heading>{limitMessage}</Alert.Heading>
            <ul className="mb-0">
              <li>申請可能な枠の数は毎月1日にリセットされます</li>
              <li>
                枠の数は、加入しているShrimpia+のプランによって異なります
                <ul>
                  <li>
                    詳しくは
                    <a href="https://docs.shrimpia.network/Shrimpia-ca2cb8697df5405393d9167cd98835ee" target="_blank" rel="noreferrer noopener" style={{ color: 'inherit' }}>
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
              <Card>
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
              <Card>
                <Card.Body>
                  <Form.Group controlId="name">
                    <Form.Label className="fw-bold">絵文字の名前</Form.Label>
                    {file && <Button size="sm" className="ms-2" onClick={onClickButtonFileName}>ファイル名を反映する</Button>}
                    <Form.Text className="text-muted">
                      <br/>絵文字の入力時に用いる名前です。小文字の英数字およびアンダースコア（_）のみが利用できます。
                    </Form.Text>
                    <Form.Control autoComplete="off" className="mt-2" type="text" value={name} placeholder="例: lutica_dadakone" onChange={e => setName(e.target.value)} onBlur={checkEmojiNameDuplicated} />
                    {(!isNameValid || emojiNameState !== 'initial') && (
                      <Form.Text>
                        {!isNameValid && !!name ? (
                          <span className="text-danger">絵文字の名前が不正です。</span>
                        ) : emojiNameState === 'loading' ? (
                          <Spinner size="sm" variant="primary" />
                        ) : emojiNameState === 'invalid' ? (
                          <span className="text-danger"><i className="bi bi-x " /> この名前は既に使われています。</span>
                        ) : emojiNameState === 'valid' ? (
                          <span className="text-success"><i className="bi bi-check2 " /> OKです！</span>
                        ) : null}
                      </Form.Text>
                    )}
                  </Form.Group>
                </Card.Body>
              </Card>
              <Card>
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
                        <div className="text-muted">
                          フォントの権利関係をスタッフが審査するため、追加の質問にご回答ください。<br/>
                          不備がある場合、却下される可能性があります。
                        </div>
                        <Form.Group controlId="fontName">
                          <Form.Label className="fw-bold">フォントの名前</Form.Label>
                          <Form.Control type="text" value={fontName} placeholder="例: M PLUS Rounded 1c" onChange={e => setFontName(e.target.value)} />
                          <Form.Text muted>
                            MEGAMOJI等のツールを用いて作成した場合は、ツール名と選択したフォント名をご記入ください。<br/>
                            手描きの場合は、その旨を記載してください。
                          </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="fontSource">
                          <Form.Label className="fw-bold">フォントの入手元</Form.Label>
                          <Form.Control type="text" value={fontSource} placeholder="例: Adobe Fonts" onChange={e => setFontSource(e.target.value)} />
                          <Form.Text muted>
                            自分が所有する、あるいはサブスク等を用いて利用しているフォントの場合、入手元をご記入ください。
                          </Form.Text>
                        </Form.Group>
                        <Form.Group controlId="yomigana">
                          <Form.Label className="fw-bold">読み仮名</Form.Label>
                          <Form.Control type="text" value={yomigana} placeholder="例: かいしゃくちがい" onChange={e => setYomigana(e.target.value)} />
                          <Form.Text muted>漢字を含む場合、できればご記入ください。スタッフがひらがなタグを振るために使用します。</Form.Text>
                        </Form.Group>
                      </Stack>
                    </>
                  )}
                </Card.Body>
              </Card>
              <Card>
                <Card.Body>
                  <Form.Group className="mb-3" controlId="comment">
                    <Form.Label className="fw-bold">コメント</Form.Label>
                    <Form.Text>
                      <br/><strong>代理申請の場合は、必ず作成者のユーザー名を明記してください。</strong><br/>
                      その他、画像に何らかの元ネタがある場合など、スタッフが知っておくべき背景がある場合は、その旨を詳細に記入してください。<br/>
                      （一部のMFMが利用できます。）
                    </Form.Text>
                    <Form.Control as="textarea" rows={6} value={comment} onChange={e => setComment(e.target.value)} />
                    <Form.Text className={comment.length > 500 ? 'text-danger' : 'text-muted'}>
                      {comment.length} / 500
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>
              <Form.Group controlId="agreeToGuideline">
                <Alert variant="warning">
                  投稿する絵文字は、必ず
                  <a href={URL_EMOJI_REQUEST_GUIDELINES} target="_blank" rel="noreferrer noopener" style={{ color: 'inherit' }}>
                    絵文字申請ガイドライン
                  </a>
                  を遵守する必要があります！
                  <Form.Check className="mt-2" type="checkbox" checked={isAgreeToGuideline} label="絵文字申請ガイドライン" onChange={e => setAgreeToGuideline(e.target.checked)} />
                </Alert>
              </Form.Group>
              <Button size="lg" className="mx-auto mt-5 px-5 fw-bold" disabled={!canSubmit} onClick={post}>この内容で申請する</Button>
            </>
          ) : (
            <Button as={Link as any} to="/emoji-request" size="lg" variant="outline-primary" className="mx-auto px-5 fw-bold">もどる</Button>
          )}
        </Stack>
      </Form>
    </Container>
  );
};

export default LegacyEmojiRequestFormPage;

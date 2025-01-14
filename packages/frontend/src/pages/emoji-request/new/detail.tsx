import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue } from 'jotai';
import React, { useCallback, useEffect } from 'react';
import { Card, Form, Nav, Stack } from 'react-bootstrap';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import type { DetailInputAnimatedFormSchema, DetailInputFormSchema, DetailInputIncludingTextFormSchema } from '@/form-schemas/emoji-request/detail-input';

import { MfmView } from '@/components/common/MfmView';
import { EmojiPreview } from '@/components/domains/emoji-request/EmojiPreview';
import { EmojiRequestFormContainer } from '@/components/domains/emoji-request/EmojiRequestFormContainer';
import { SubmitButton } from '@/components/domains/emoji-request/SubmitButton';
import { URL_EMOJI_REQUEST_GUIDELINES } from '@/consts';
import { detailInputAnimatedFormSchema, detailInputFormSchema, detailInputIncludingTextFormSchema } from '@/form-schemas/emoji-request/detail-input';
import { imgDataUrlAtom, basicInputFormAtom, animatedInputFormAtom, includingTextInputFormAtom, detailInputFormAtom } from '@/states/emoji-request';

const DetailForm: React.FC = () => {
  const [commentFormType, setCommentFormType] = React.useState<'editor' | 'preview'>('editor');

  const url = useAtomValue(imgDataUrlAtom);
  const basicInput = useAtomValue(basicInputFormAtom);

  const [animatedInputForm, setAnimatedInputForm] = useAtom(animatedInputFormAtom);
  const [includingTextInputForm, setIncludingTextInputForm] = useAtom(includingTextInputFormAtom);
  const [detailInputForm, setDetailInputForm] = useAtom(detailInputFormAtom);

  const animatedForm = useForm<DetailInputAnimatedFormSchema>({
    resolver: zodResolver(detailInputAnimatedFormSchema),
    mode: 'onChange',
    defaultValues: animatedInputForm ?? {
    },
  });
  const includingTextForm = useForm<DetailInputIncludingTextFormSchema>({
    resolver: zodResolver(detailInputIncludingTextFormSchema),
    mode: 'onChange',
    defaultValues: includingTextInputForm ?? {
      isFreeHanded: false,
      fontName: '',
      fontSource: '',
      yomigana: '',
    },
  });
  const detailForm = useForm<DetailInputFormSchema>({
    resolver: zodResolver(detailInputFormSchema),
    mode: 'onChange',
    defaultValues: detailInputForm ?? {
      authorInfo: '',
      comment: '',
      agreeToGuideline: false as any,
    },
  });
  
  const navigate = useNavigate();

  const onClick = useCallback(async () => {
    if (basicInput == null) throw new Error('invalid state');
    const isDetailFormValid = await detailForm.trigger(undefined, { shouldFocus: true });

    let isAnimatedFormValid = true;
    if (basicInput.hasAnimation) isAnimatedFormValid = await animatedForm.trigger(undefined, { shouldFocus: true });

    let isIncludingTextFormValid = true;
    if (basicInput.hasText) isIncludingTextFormValid = await includingTextForm.trigger(undefined, { shouldFocus: true });

    console.log(isDetailFormValid, isAnimatedFormValid, isIncludingTextFormValid);

    if (!isDetailFormValid || !isAnimatedFormValid || !isIncludingTextFormValid) return;

    setAnimatedInputForm(animatedForm.getValues());
    setIncludingTextInputForm(includingTextForm.getValues());
    setDetailInputForm(detailForm.getValues());
    navigate('/emoji-request/new/confirm');
  }, [basicInput, detailForm, animatedForm, includingTextForm, setAnimatedInputForm, setIncludingTextInputForm, setDetailInputForm, navigate]);
  
  const comment = detailForm.watch('comment');

  const isFreeHanded = includingTextForm.watch('isFreeHanded');

  // 必要なデータがなければトップに飛ばす
  useEffect(() => {
    if (!basicInput) {
      navigate('/emoji-request/new');
    }
  }, [basicInput, navigate]);

  return !basicInput ? null : (
    <EmojiRequestFormContainer step={2}>
      <Stack gap={3}>
        <div className="d-flex justify-content-center">
          <EmojiPreview src={url ?? ''} />
        </div>
        <p className="text-center mb-5">
          最後に、登録中の絵文字 <code>:{basicInput.name}:</code> の詳細情報を入力してください。<br/>
          入力内容が正しくない、あるいは不足している場合は却下の対象となります。
        </p>

        {basicInput.hasAnimation && (
          <Card>
            <Card.Body>
              <Card.Title>アニメーション画像についての確認事項</Card.Title>
              <Form.Check>
                <Form.Check.Input
                  type="checkbox"
                  id="doesNotContainExcessiveFlashing" 
                  isInvalid={animatedForm.formState.errors.doesNotContainExcessiveFlashing != null}
                  {...animatedForm.register('doesNotContainExcessiveFlashing')} 
                />
                <Form.Check.Label htmlFor="doesNotContainExcessiveFlashing">
                  過度な点滅や激しい動きを含まない
                </Form.Check.Label>
                <Form.Text muted className="d-block">
                  <a href="https://ja.wikipedia.org/wiki/%E5%85%89%E9%81%8E%E6%95%8F%E6%80%A7%E7%99%BA%E4%BD%9C" target="_blank" rel="noopener noreferrer">
                    光過敏性発作
                  </a>
                  を誘発しないよう考慮されているか、今一度ご確認ください。
                </Form.Text>
                {animatedForm.formState.errors.doesNotContainExcessiveFlashing && (
                  <Form.Text className="text-danger d-block fw-bold">
                    この項目をオンにしないと登録できません！
                  </Form.Text>
                )}
              </Form.Check>
            </Card.Body>
          </Card>
        )}

        {basicInput.hasText && (
          <Card>
            <Card.Body>
              <Card.Title>テキストについての確認事項</Card.Title>
              <Stack gap={3}>
                <Form.Check>
                  <Form.Check.Input id="isFreeHanded" type="checkbox" {...includingTextForm.register('isFreeHanded')} />
                  <Form.Check.Label htmlFor="isFreeHanded">
                    文字フォントを使用していない<br/>
                    <Form.Text muted>手書き文字のみを含む場合は<b>オン</b>にしてください。</Form.Text>
                  </Form.Check.Label>
                </Form.Check>
                {!isFreeHanded && (
                  <>
                    <Form.Group controlId="fontName">
                      <Form.Label className="fw-bold">使用しているフォントの名前</Form.Label>
                      <Form.Control type="text" placeholder="例: M PLUS Rounded 1c" {...includingTextForm.register('fontName')} />
                      <Form.Text muted className="ms-2 d-block">
                        MEGAMOJI等のツールを用いて作成した場合は、ツール内における呼称でOKです。<br/>
                      </Form.Text>
                    </Form.Group>
                    <Form.Group controlId="fontSource">
                      <Form.Label className="fw-bold">フォントの入手元</Form.Label>
                      <Form.Control type="text" placeholder="例: Adobe Fonts"  {...includingTextForm.register('fontSource')} />
                      <Form.Text muted className="ms-2 d-block">
                        サブスクリプションの場合は、サービス名を記入してください。<br/>
                        ツール内蔵のフォントを用いた場合は、ツールのURLを入力してください。<br/>
                        フリー、あるいは購入したフォントの場合は、その入手元URLを記入してください。<br/>
                      </Form.Text>
                    </Form.Group>
                  </>
                )}
                <Form.Group controlId="yomigana">
                  <Form.Label className="fw-bold">読み仮名</Form.Label>
                  <Form.Control type="text" placeholder="例: かいしゃくちがい" {...includingTextForm.register('yomigana')} />
                  <Form.Text muted className="ms-2 d-block">
                    漢字を含む場合は、こちらに正しい読みを入力してください。タグ付けの参考にします。
                  </Form.Text>
                </Form.Group>
              </Stack>
            </Card.Body>
          </Card>
        )}

        <Card>
          <Card.Body>
            <Stack gap={3}>
              <Form.Group controlId="authorInfo">
                <Form.Label className="fw-bold">オリジナルの作者情報</Form.Label>
                <Form.Control type="text" {...detailForm.register('authorInfo')} />
                <Form.Text muted className="ms-2 d-block">
                  代理申請の場合、オリジナル作者のノートURLを入力してください。<br/>
                  他者の作成したコンテンツの場合、著作元の名前および、アップロードしたコンテンツのライセンス表記のあるURL等を入力してください。
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="comment">
                <Form.Label className="fw-bold">自由記述欄</Form.Label>
                <Form.Text className="ms-2 d-block">
                  その他、フォームに記入しきれなかった情報や、
                  アップロードした画像に何らかの元ネタがある場合など、絵文字の意図が伝わるような追加情報がありましたら、その旨を記入してください。<br/>
                  （一部のMFMが利用できます。）
                </Form.Text>
                
                <Nav variant="underline" activeKey={commentFormType} onSelect={key => setCommentFormType(key as 'editor' | 'preview')}>
                  <Nav.Item>
                    <Nav.Link eventKey="editor">エディタ</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="preview">プレビュー</Nav.Link>
                  </Nav.Item>
                </Nav>
                {commentFormType === 'editor' ? (
                  <>
                    <Form.Control as="textarea" rows={6} {...detailForm.register('comment')} />
                    <Form.Text className="text-danger">
                      {detailForm.formState.errors.comment?.message}
                    </Form.Text>
                  </>
                ) : (
                  <Card>
                    <Card.Body>
                      <MfmView>{comment ?? ''}</MfmView>
                    </Card.Body>
                  </Card>
                )}
              </Form.Group>
            </Stack>
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Form.Check>
              <Form.Check.Input
                type="checkbox"
                id="agreeToGuideline" 
                isInvalid={detailForm.formState.errors.agreeToGuideline != null}
                {...detailForm.register('agreeToGuideline')}
              />
              <Form.Check.Label htmlFor="agreeToGuideline">
                この申請が
                <a href={URL_EMOJI_REQUEST_GUIDELINES} target="_blank" rel="noopener noreferrer">
                  絵文字申請ガイドライン
                </a>
                に準拠していることを確認しました
              </Form.Check.Label>
              {detailForm.formState.errors.agreeToGuideline && (
                <Form.Text className="text-danger d-block fw-bold">
                  この項目をオンにしないと登録できません！
                </Form.Text>
              )}
            </Form.Check>
          </Card.Body>
        </Card>
          
        <SubmitButton type="button" onClick={onClick}>入力項目を確認する</SubmitButton>

      </Stack>
    </EmojiRequestFormContainer>
  );
};

export default DetailForm;

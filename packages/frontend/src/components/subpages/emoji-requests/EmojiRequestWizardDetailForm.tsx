import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue } from 'jotai';
import React, { useCallback } from 'react';
import { Card, Form, Stack } from 'react-bootstrap';
import { useForm } from 'react-hook-form';

import type { DetailInputAnimatedFormSchema, DetailInputFormSchema, DetailInputIncludingTextFormSchema } from '@/form-schemas/emoji-request/detail-input';

import { EmojiPreview } from '@/components/domains/emoji-request/EmojiPreview';
import { SubmitButton } from '@/components/domains/emoji-request/SubmitButton';
import { detailInputAnimatedFormSchema, detailInputFormSchema, detailInputIncludingTextFormSchema } from '@/form-schemas/emoji-request/detail-input';
import { imgDataUrlAtom, basicInputFormAtom, animatedInputFormAtom, includingTextInputFormAtom, detailInputFormAtom } from '@/states/emoji-request';

const EmojiRequestWizardDetailForm: React.FC<{onStep: () => void}> = ({ onStep }) => {
  const url = useAtomValue(imgDataUrlAtom);
  const basicInput = useAtomValue(basicInputFormAtom);

  const [animatedInputForm, setAnimatedInputForm] = useAtom(animatedInputFormAtom);
  const [includingTextInputForm, setIncludingTextInputForm] = useAtom(includingTextInputFormAtom);
  const [detailInputForm, setDetailInputForm] = useAtom(detailInputFormAtom);

  //   const onSubmit = useCallback((data: DetailInputFormSchema) => {
  //     setData(data);
  //     onStep();
  //   }, [onStep, setData]);

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
      usingFont: false,
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
    },
  });

  const onClick = useCallback(async () => {
    await detailForm.trigger(undefined, { shouldFocus: true });
    await includingTextForm.trigger(undefined, { shouldFocus: true });
    await animatedForm.trigger(undefined, { shouldFocus: true });

    if (animatedForm.formState.isValid && includingTextForm.formState.isValid && detailForm.formState.isValid) {
      setAnimatedInputForm(animatedForm.getValues());
      setIncludingTextInputForm(includingTextForm.getValues());
      setDetailInputForm(detailForm.getValues());
      onStep();
    }

  }, [animatedForm, detailForm, includingTextForm, onStep, setAnimatedInputForm, setDetailInputForm, setIncludingTextInputForm]);

  if (basicInput == null) throw new Error('invalid state');
  
  const usingFont = includingTextForm.watch('usingFont');

  return (
    <div className="">
      <h1 className="fs-3 mb-3">詳細情報を入力</h1>
      <p>
        最後に、登録中の絵文字 <code>:{basicInput.name}:</code> の詳細情報を入力してください。<br/>
        入力内容が正しくない、あるいは不足している場合は却下の対象となります。
      </p>

      <Stack gap={3}>
        <div>
          <h2 className="fs-6 mt-4 fw-bold">絵文字プレビュー</h2>
          <EmojiPreview src={url ?? ''} />
        </div>

        <Card>
          <Card.Body>
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

        <Card>
          <Card.Body>
            <Stack gap={3}>
              <Form.Check>
                <Form.Check.Input id="hasText" type="checkbox" {...includingTextForm.register('usingFont')} />
                <Form.Check.Label htmlFor="hasText">
                  <b>文字フォントを使用している</b><br/>
                </Form.Check.Label>
              </Form.Check>
              <Form.Group controlId="fontName">
                <Form.Label className="fw-bold">フォントの名前</Form.Label>
                <Form.Control type="text" placeholder="例: M PLUS Rounded 1c" {...includingTextForm.register('fontName')} disabled={!usingFont} />
                <Form.Text muted className="ms-2 d-block">
                  MEGAMOJI等のツールを用いて作成した場合は、ツール内における呼称でOKです。<br/>
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="fontSource">
                <Form.Label className="fw-bold">フォントの入手元</Form.Label>
                <Form.Control type="text" placeholder="例: Adobe Fonts"  {...includingTextForm.register('fontSource')} disabled={!usingFont} />
                <Form.Text muted className="ms-2 d-block">
                  サブスクリプションの場合は、サービス名を記入してください。<br/>
                  ツール内蔵のフォントを用いた場合は、ツールのURLを入力してください。<br/>
                  フリー、あるいは購入したフォントの場合は、その入手元URLを記入してください。<br/>
                </Form.Text>
              </Form.Group>
              <Form.Group controlId="yomigana">
                <Form.Label className="fw-bold">読み仮名</Form.Label>
                <Form.Control type="text" placeholder="例: かいしゃくちがい" {...includingTextForm.register('yomigana')} />
                <Form.Text muted className="ms-2 d-block">
                  漢字を含む場合は、こちらに正しい読みを入力してください。<br/>
                  スタッフがひらがなタグを振るために使用します。
                </Form.Text>
              </Form.Group>
            </Stack>
          </Card.Body>
        </Card>

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
                <Form.Label className="fw-bold">コメント</Form.Label>
                <Form.Text className="ms-2 d-block">
                  画像に何らかの元ネタがある場合など、スタッフが知っておくべき背景がある場合は、その旨を詳細に記入してください。<br/>
                  （一部のMFMが利用できます。）
                </Form.Text>
                <Form.Control as="textarea" rows={6} {...detailForm.register('comment')} />
                <Form.Text className="text-danger">
                  {detailForm.formState.errors.comment?.message}
                </Form.Text>
              </Form.Group>
            </Stack>
          </Card.Body>
        </Card>

        <SubmitButton type="button" onClick={onClick}>入力項目を確認する</SubmitButton>

      </Stack>
      
    </div>
  );
};

export default EmojiRequestWizardDetailForm;

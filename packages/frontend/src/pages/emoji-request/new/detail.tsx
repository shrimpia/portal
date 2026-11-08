import { zodResolver } from '@hookform/resolvers/zod';
import { useAtom, useAtomValue } from 'jotai';
import React, { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';

import type { DetailInputAnimatedFormSchema, DetailInputFormSchema, DetailInputIncludingTextFormSchema } from '@/form-schemas/emoji-request/detail-input';

import { MfmView } from '@/components/common/MfmView';
import { EmojiPreview } from '@/components/domains/emoji-request/EmojiPreview';
import { EmojiRequestFormContainer } from '@/components/domains/emoji-request/EmojiRequestFormContainer';
import { SubmitButton } from '@/components/domains/emoji-request/SubmitButton';
import { Card } from '@/components/ui/Card';
import { Checkbox, Radio } from '@/components/ui/Choice';
import { FieldCaption, FieldTitle } from '@/components/ui/Field';
import { Stack } from '@/components/ui/Stack';
import { TabBar } from '@/components/ui/TabBar';
import { Textarea } from '@/components/ui/Textarea';
import { Textfield } from '@/components/ui/Textfield';
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
      fontUsage: 'font',
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

    if (!isDetailFormValid || !isAnimatedFormValid || !isIncludingTextFormValid) return;

    setAnimatedInputForm(animatedForm.getValues());
    setIncludingTextInputForm(includingTextForm.getValues());
    setDetailInputForm(detailForm.getValues());
    navigate('/emoji-request/new/confirm');
  }, [basicInput, detailForm, animatedForm, includingTextForm, setAnimatedInputForm, setIncludingTextInputForm, setDetailInputForm, navigate]);
  
  const comment = detailForm.watch('comment');

  const fontUsage = includingTextForm.watch('fontUsage');

  // 必要なデータがなければトップに飛ばす
  useEffect(() => {
    if (!basicInput) {
      navigate('/emoji-request/new');
    }
  }, [basicInput, navigate]);

  return !basicInput ? null : (
    <EmojiRequestFormContainer step={2}>
      <Stack gap={4}>
        <Stack direction="horizontal" justify="center">
          <EmojiPreview src={url ?? ''} />
        </Stack>
        <p className="lu-text-center lu-mb-12">
          最後に、登録中の絵文字 <code>:{basicInput.name}:</code> の詳細情報を入力してください。<br/>
          入力内容が正しくない、あるいは不足している場合は却下の対象となります。
        </p>

        {basicInput.hasAnimation && (
          <Card>
            <Card.Title>アニメーション画像についての確認事項</Card.Title>
            <Checkbox
              error={animatedForm.formState.errors.doesNotContainExcessiveFlashing != null && 'この項目をオンにしないと登録できません！'}
              caption={
                <>
                  <a href="https://ja.wikipedia.org/wiki/%E5%85%89%E9%81%8E%E6%95%8F%E6%80%A7%E7%99%BA%E4%BD%9C" target="_blank" rel="noopener noreferrer">
                    光過敏性発作
                  </a>
                  を誘発しないよう考慮されているか、今一度ご確認ください。
                </>
              }
              {...animatedForm.register('doesNotContainExcessiveFlashing')}
            >
              過度な点滅や激しい動きを含まない
            </Checkbox>
          </Card>
        )}

        {basicInput.hasText && (
          <Card>
            <Card.Title>テキストについての確認事項</Card.Title>
            <Stack gap={4}>
              <div role="radiogroup" aria-label="フォントの使用">
                <Radio value="handwritten" {...includingTextForm.register('fontUsage', { required: true })}>手書きのみ</Radio>
                <Radio value="font" {...includingTextForm.register('fontUsage', { required: true })}>フォントを使用している</Radio>
              </div>
              {fontUsage === 'font' && (
                <>
                  <Textfield
                    title="使用しているフォントの名前"
                    placeholder="例: M PLUS Rounded 1c"
                    invalid={includingTextForm.formState.errors.fontName != null}
                    caption={includingTextForm.formState.errors.fontName != null ? '必ず入力してください！' : 'MEGAMOJI等のツールを用いて作成した場合は、ツール内における呼称でOKです。'}
                    {...includingTextForm.register('fontName')}
                  />
                  <Textfield
                    title="フォントの入手元"
                    placeholder="例: Adobe Fonts"
                    invalid={includingTextForm.formState.errors.fontSource != null}
                    caption={includingTextForm.formState.errors.fontSource != null ? '必ず入力してください！' : (
                      <>
                        サブスクリプションの場合は、サービス名を記入してください。<br/>
                        ツール内蔵のフォントを用いた場合は、ツールのURLを入力してください。<br/>
                        フリー、あるいは購入したフォントの場合は、その入手元URLを記入してください。
                      </>
                    )}
                    {...includingTextForm.register('fontSource')}
                  />
                </>
              )}
              <Textfield
                title="読み仮名"
                placeholder="例: かいしゃくちがい"
                caption="漢字を含む場合は、こちらに正しい読みを入力してください。タグ付けの参考にします。"
                {...includingTextForm.register('yomigana')}
              />
            </Stack>
          </Card>
        )}

        <Card>
          <Stack gap={4}>
            <Textfield
              title="オリジナルの作者情報"
              caption={
                <>
                  代理申請の場合、オリジナル作者のノートURLを入力してください。<br/>
                  他者の作成したコンテンツの場合、著作元の名前および、アップロードしたコンテンツのライセンス表記のあるURL等を入力してください。
                </>
              }
              {...detailForm.register('authorInfo')}
            />
            <div>
              <FieldTitle>自由記述欄</FieldTitle>
              <FieldCaption>
                その他、フォームに記入しきれなかった情報や、
                アップロードした画像に何らかの元ネタがある場合など、絵文字の意図が伝わるような追加情報がありましたら、その旨を記入してください。<br/>
                （一部のMFMが利用できます。）
              </FieldCaption>

              <TabBar value={commentFormType} onChange={setCommentFormType} className="lu-ms-2" aria-label="表示の切り替え">
  <TabBar.Tab value="editor">エディタ</TabBar.Tab>
  <TabBar.Tab value="preview">プレビュー</TabBar.Tab>
</TabBar>
              {commentFormType === 'editor' ? (
                <Textarea
                  rows={6}
                  invalid={detailForm.formState.errors.comment != null}
                  caption={detailForm.formState.errors.comment?.message}
                  {...detailForm.register('comment')}
                />
              ) : (
                <Card>
                  <MfmView>{comment ?? ''}</MfmView>
                </Card>
              )}
            </div>
          </Stack>
        </Card>

        <Card>
          <Checkbox
            error={detailForm.formState.errors.agreeToGuideline && 'この項目をオンにしないと登録できません！'}
            {...detailForm.register('agreeToGuideline')}
          >
            この申請が
            <a href={URL_EMOJI_REQUEST_GUIDELINES} target="_blank" rel="noopener noreferrer">
              絵文字申請ガイドライン
            </a>
            に準拠していることを確認しました
          </Checkbox>
        </Card>
          
        <SubmitButton type="button" onClick={onClick}>入力項目を確認する</SubmitButton>

      </Stack>
    </EmojiRequestFormContainer>
  );
};

export default DetailForm;

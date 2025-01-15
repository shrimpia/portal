import { css } from '@linaria/core';
import { useAtom } from 'jotai';
import { useCallback, useEffect, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router';

import { MfmView } from '@/components/common/MfmView';
import { EmojiRequestFormContainer } from '@/components/domains/emoji-request/EmojiRequestFormContainer';
import { useWithSpinner } from '@/hooks/useWithSpinner';
import { useAPI } from '@/services/api';
import { animatedInputFormAtom, basicInputFormAtom, detailInputFormAtom, fileAtom, imgDataUrlAtom, includingTextInputFormAtom } from '@/states/emoji-request';

const emojiPreviewStyle = css`
  height: 2rem;
`;

const confirmationListStyle = css`
  > dt {
    font-weight: bold;
    margin-top: 1rem;
    margin-bottom: 0.2rem;
    line-height: 2;
    padding-left: 0.5rem;
    
    &:not(:first-child) {
      border-top: 1px solid var(--bs-border-color);
      padding-top: 0.2rem;
    }
  }
  > dd {
    padding-left: 1rem;
  }
`;

const commandButtonsStyle = css`
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 50px;
`;

const ConfirmForm: React.FC = () => {
  const [file, setFile] = useAtom(fileAtom);
  const [imgData, setImgData] = useAtom(imgDataUrlAtom);
  const [basicInput, setBasicInput] = useAtom(basicInputFormAtom);
  const [detailInput, setDetailInput] = useAtom(detailInputFormAtom);
  const [animatedInput, setAnimatedInput] = useAtom(animatedInputFormAtom);
  const [includingTextInput, setIncludingTextInput] = useAtom(includingTextInputFormAtom);

  const withSpinner = useWithSpinner();
  const api = useAPI();
  const navigate = useNavigate();

  const composedComment = useMemo(() => {
    let comment = '';
    const append = (text: string) => comment += text + '\n';

    if (!basicInput || !detailInput) return '';
    
    if (basicInput?.hasText && includingTextInput) {
      if (includingTextInput.fontUsage === 'handwritten') {
        append('フォント名: 手書き');
      } else {
        append(`フォント名: ${includingTextInput.fontName}`);
        append(`フォント入手元: ${includingTextInput.fontSource}`);
      }
      append(`よみがな: ${includingTextInput.yomigana}`);
    }
    if (detailInput.authorInfo !== null && detailInput.authorInfo !== '') {
      append(`オリジナルの作者情報: ${detailInput.authorInfo}`);
    }

    append('\n' + detailInput.comment);
    return comment;
  }, [basicInput, detailInput, includingTextInput]);

  const returnToFormTop = useCallback(() => {
    navigate('/emoji-request/new');
  }, [navigate]);

  const submitRequest = useCallback(async () => {
    if (!file || !basicInput) return;
    if (!confirm('本当にこの内容で申請しますか？\n\n申請後は取り消せません。不備がないことを再度ご確認ください。')) return;try {

      await withSpinner(() => api.createEmojiRequest(file, basicInput.name, composedComment));
      alert('申請しました。');
      setFile(null);
      setImgData(null);
      setBasicInput(undefined);
      setDetailInput(undefined);
      setAnimatedInput(undefined);
      setIncludingTextInput(undefined);
      
      navigate('/emoji-request');
    } catch (e) {
      if (e instanceof Error) {
        alert('申請に失敗しました。\n\n技術情報: ' + e.message);
      }
      console.error(e);
    }
  }, [api, basicInput, composedComment, file, navigate, setAnimatedInput, setBasicInput, setDetailInput, setFile, setImgData, setIncludingTextInput, withSpinner]);
  
  // 必要なデータがなければトップに飛ばす
  useEffect(() => {
    if (!imgData || !basicInput || !detailInput) {
      navigate('/emoji-request/new');
    }
  }, [imgData, basicInput, detailInput, navigate]);

  const noInput = useMemo(() => <span className="text-muted">(入力なし)</span>, []);
  
  return (!imgData || !basicInput || !detailInput) ? null : (
    <EmojiRequestFormContainer step={3}>
      <p className="text-center mb-5">登録内容が正しいかどうか、今一度ご確認ください。</p>
      <dl className={confirmationListStyle}>
        <dt>アップロードした画像</dt>
        <dd>
          <img src={imgData} alt={basicInput.name} className={emojiPreviewStyle} />
        </dd>
        <dt>名前</dt>
        <dd>{basicInput.name}</dd>
        <dt>画像の種別</dt>
        <dd>
          {basicInput.hasText ? 'テキストを含む、' : ''}{basicInput.hasAnimation ? 'アニメーション画像' : '静止画'}          
        </dd>
        {basicInput.hasAnimation && animatedInput && (
          <>
            <dt>過度な点滅や激しい動きを含まない</dt>
            <dd>{animatedInput.doesNotContainExcessiveFlashing ? 'はい' : 'いいえ'}</dd>
          </>
        )}
        {basicInput.hasText && includingTextInput && (
          <>
            <dt>テキストの表現</dt>
            <dd>
              {includingTextInput.fontUsage === 'handwritten' ? '手書き' : 'フォントを使用'}
            </dd>
            {includingTextInput.fontUsage === 'font' && (
              <>
                <dt>フォントの名前</dt>
                <dd>{includingTextInput.fontName || noInput}</dd>
                <dt>フォントの入手元</dt>
                <dd>{includingTextInput.fontSource || noInput}</dd>
                <dt>読み仮名</dt>
                <dd>{includingTextInput.yomigana || noInput}</dd>
              </>
            )}
          </>
        )}
        <dt>作者情報</dt>
        <dd>{detailInput.authorInfo || noInput}</dd>
        <dt>コメント</dt>
        <dd>
          {detailInput.comment ? <MfmView>{detailInput.comment}</MfmView> : noInput}
        </dd>
        <dt>絵文字申請ガイドライン</dt>
        <dd>{detailInput.agreeToGuideline ? '同意する' : '同意しない'}</dd>
      </dl>

      <div className={commandButtonsStyle}>
        <Button variant="secondary" onClick={returnToFormTop}>
          <i className="bi bi-arrow-left me-2" />
          入力しなおす
        </Button>
        <Button variant="primary" onClick={submitRequest}>
          <i className="bi bi-check2 me-2" />
          この内容で申請する
        </Button>
      </div>
    </EmojiRequestFormContainer>
  );
};

export default ConfirmForm;

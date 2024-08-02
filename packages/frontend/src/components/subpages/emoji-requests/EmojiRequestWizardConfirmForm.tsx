import { css } from '@linaria/core';
import { useAtomValue } from 'jotai';

import { basicInputFormAtom, detailInputFormAtom, imgDataUrlAtom, includingTextInputFormAtom } from '@/states/emoji-request';

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

const EmojiRequestWizardConfirmForm: React.FC<{onStep: () => void}> = ({ onStep }) => {
  const imgData = useAtomValue(imgDataUrlAtom);
  const basicInput = useAtomValue(basicInputFormAtom);
  const detailInput = useAtomValue(detailInputFormAtom);
  const includingTextInput = useAtomValue(includingTextInputFormAtom);
  
  if (imgData == null) throw new Error('imgData is null');
  if (basicInput == null) throw new Error('basicInput is null');
  if (detailInput == null) throw new Error('detailInput is null');
  
  return (
    <div>
      <p className="mb-3">登録内容が正しいかどうか、今一度ご確認ください。</p>
      <dl className={confirmationListStyle}>
        <dt>アップロードした画像</dt>
        <dd>
          <img src={imgData} alt={basicInput.name} className={emojiPreviewStyle} />
        </dd>
        <dt>名前</dt>
        <dd>{basicInput.name}</dd>
        <dt>画像の種別</dt>
        <dd>
          {basicInput.hasText ? 'テキストを含む' : ''}{basicInput.hasAnimation ? 'アニメーション画像' : '静止画'}          
        </dd>
        <dt>名前</dt>
        <dd>{basicInput.name}</dd>
        {basicInput.hasText && includingTextInput && (
          <>
            <dt>文字フォントを使用している</dt>
            <dd>{includingTextInput.usingFont ? 'はい' : 'いいえ'}</dd>
            <dt>フォントの名前</dt>
            <dd>{includingTextInput.fontName}</dd>
            <dt>フォントの入手元</dt>
            <dd>{includingTextInput.fontSource}</dd>
            <dt>読み仮名</dt>
            <dd>{includingTextInput.yomigana}</dd>
          </>
        )}
      </dl>
    </div>
  );
};

export default EmojiRequestWizardConfirmForm;

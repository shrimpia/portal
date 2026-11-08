import { css } from '@linaria/core';

import type { ComponentPropsWithRef, ReactNode } from 'react';

export type ChoiceProps = Omit<ComponentPropsWithRef<'input'>, 'type' | 'title'> & {
  /** ラベルの文字 */
  children?: ReactNode;
  /** ラベルの下に出る補足 */
  caption?: ReactNode;
  /** エラー状態にする。`error` を指定すると自動でオンになる */
  invalid?: boolean;
  /** ラベルの下に `danger` の色で出るエラー内容 */
  error?: ReactNode;
};

// 補足の左端を、ラベルの文字に揃える(チェック部分の幅 + gap)
const captionStyle = css`
  margin: 0 0 0 calc(var(--size-indicator) + var(--space-2));
  color: var(--dimmed);
  font-size: var(--text-small);
  line-height: 1.5;

  &[data-error] {
    color: var(--danger);
  }
`;

const createChoice = (kind: 'checkbox' | 'radio' | 'switch') => {
  const Choice: React.FC<ChoiceProps> = ({ children, caption, invalid, error, className, ...rest }) => (
    <div className={className}>
      <label className="lu-choice">
        <input
          className={`lu-${kind}`}
          type={kind === 'radio' ? 'radio' : 'checkbox'}
          role={kind === 'switch' ? 'switch' : undefined}
          aria-invalid={invalid || !!error || undefined}
          {...rest}
        />
        {children}
      </label>
      {caption && <p className={captionStyle}>{caption}</p>}
      {error && <p className={captionStyle} data-error="">{error}</p>}
    </div>
  );
  return Choice;
};

/** デザインシステムの Checkbox (`lu-checkbox`)。`className` は外側の `<div>` に付く。 */
export const Checkbox = createChoice('checkbox');
/** デザインシステムの Radio (`lu-radio`)。同じグループの `name` を揃える。 */
export const Radio = createChoice('radio');
/** デザインシステムの Switch (`lu-switch`)。即時に反映される設定に使う。 */
export const Switch = createChoice('switch');

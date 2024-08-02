
import { css } from '@linaria/core';
import { useAtomValue } from 'jotai';
import React, { Suspense, lazy, useEffect, useMemo, useRef, useState } from 'react';
import { Card, Container } from 'react-bootstrap';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingView } from '@/components/common/LoadingView';
import { Stepper } from '@/components/common/Stepper';
import { remainingEmojiRequestLimitAtom, userAtom } from '@/states/user';

type WizardPageDefinition = {
  label: string;
  component: React.LazyExoticComponent<React.FC<{onStep: () => void}>>;
};

const wizardPages: WizardPageDefinition[] = [{
  label: 'アップロード',
  component: lazy(() => import('@/components/subpages/emoji-requests/EmojiRequestWizardUpload')),
}, {
  label: '情報を入力',
  component: lazy(() => import('@/components/subpages/emoji-requests/EmojiRequestWizardBasicForm')),
}, {
  label: '詳細情報を入力',
  component: lazy(() => import('@/components/subpages/emoji-requests/EmojiRequestWizardDetailForm')),
}, {
  label: '確認',
  component: lazy(() => import('@/components/subpages/emoji-requests/EmojiRequestWizardConfirmForm')),
}];

const steps = wizardPages.map(p => p.label);

const containerStyle = css`
  max-width: 960px;
  margin: auto;
`;

const stepperOuterStyle = css`
  max-width: 400px;
  margin: auto;
`;

const EmojiRequestNewPage = () => {
  const [step, setStep] = useState(0);

  const Page = useMemo(() => wizardPages[step]?.component, [step]);

  const limit = useAtomValue(remainingEmojiRequestLimitAtom);
  const user = useAtomValue(userAtom);
  const isStaff = user?.canManageCustomEmojis || user?.isEmperor;

  const stepperRef = useRef<HTMLElement>();

  /** ブラウザバック時に警告を表示 */
  useEffect(() => {
    const callback = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', callback);
   
    return () => window.removeEventListener('beforeunload', callback);
  }, []);

  useEffect(() => {
    if (stepperRef.current) {
      stepperRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [step]);

  return (
    <Container className={containerStyle}>
      <h1 className={'fs-3 mb-4'}>絵文字リクエスト</h1>
      <div className="mb-4">
        残り申請可能数: {isStaff ? '∞ ': limit}<br/>
        <small className="text-muted">
          月ごとのリクエスト可能数は、
          <a href="https://docs.shrimpia.network/shrimpia-plus" target="_blank" rel="noopener noreferrer">
              Shrimpia+
          </a>
          ページをご確認ください。
        </small>
      </div>
      <Card>
        <Card.Body>
          <div ref={stepperRef} className={stepperOuterStyle}>
            <Stepper activeStep={step} steps={steps} onChange={setStep} />
          </div>
          <div className="py-5">
            <ErrorBoundary>
              <Suspense fallback={<LoadingView />}>
                {Page && <Page onStep={() => setStep(step + 1) } />}
              </Suspense>
            </ErrorBoundary>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default EmojiRequestNewPage;

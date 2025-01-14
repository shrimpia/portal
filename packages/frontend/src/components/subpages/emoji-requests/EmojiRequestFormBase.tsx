import { css } from '@linaria/core';
import { useAtomValue } from 'jotai';
import { Suspense, useCallback, useEffect, useMemo } from 'react';
import { Button, Card, Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router';

import type { PropsWithChildren } from 'react';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingView } from '@/components/common/LoadingView';
import { Stepper } from '@/components/common/Stepper';
import { wizardPages } from '@/states/emoji-request';
import { remainingEmojiRequestLimitAtom, userAtom } from '@/states/user';

const containerStyle = css`
  max-width: 960px;
  margin: auto;
`;

const stepperOuterStyle = css`
  max-width: 400px;
  margin: auto;
`;

export const EmojiRequestFormBase: React.FC<PropsWithChildren<{
  step: number;
}>> = (p) => {
  const navigate = useNavigate();
  const location = useLocation();

  const limit = useAtomValue(remainingEmojiRequestLimitAtom);
  const user = useAtomValue(userAtom);
  const isStaff = user?.canManageCustomEmojis || user?.isEmperor;

  const steps = useMemo(() => wizardPages.map(p => p.label), []);

  const goBack = useCallback(() => {
    navigate(-1);
  }, [navigate]);
  
  const teleportTo = useCallback((step: number) => {
    navigate(wizardPages[step].route);
  }, [navigate]);

  /** ブラウザバック時に警告を表示 */
  useEffect(() => {
    const callback = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener('beforeunload', callback);
     
    return () => window.removeEventListener('beforeunload', callback);
  }, []);

  /** 画面を遷移するたびに、上部にスクロール */
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <Container className={containerStyle}>
      <h1 className={'fs-3 mb-4'}>絵文字リクエスト</h1>
      <div className="mb-4">
        残り申請可能数: {isStaff ? 'スタッフのため無制限': limit}<br/>
        <small className="text-muted">
          月ごとのリクエスト可能数は、
          <a href="https://docs.shrimpia.network/services/shrimpia-plus/" target="_blank" rel="noopener noreferrer">
            Shrimpia+
          </a>
          ページをご確認ください。
        </small>
      </div>
      <Card>
        <Card.Body>
          {p.step !== 0 && (
            <Button variant="link me-3" onClick={goBack}>
              <i className="bi bi-arrow-left" /> 戻る
            </Button>
          )}

          <div className={stepperOuterStyle}>
            <Stepper activeStep={p.step} steps={steps} onChange={teleportTo} />
          </div>
          <div className="py-5">
            <ErrorBoundary>
              <Suspense fallback={<LoadingView />}>
                {p.children}
              </Suspense>
            </ErrorBoundary>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

import { css } from '@linaria/core';
import { useAtom } from 'jotai';
import { Suspense, useCallback, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router';
import { Link } from 'react-router-dom';

import type { PropsWithChildren } from 'react';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { LoadingView } from '@/components/common/LoadingView';
import { OnlyShrimpiaPlus } from '@/components/common/OnlyShrimpiaPlus';
import { Stepper } from '@/components/common/Stepper';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { isEmojiStaff } from '@/services/is-staff';
import { wizardPages } from '@/states/emoji-request';
import { remainingEmojiRequestLimitAtom, userAtom } from '@/states/user';
import { useLoginGuard } from '@/hooks/useLoginGuard';

const containerStyle = css`
  max-width: 960px;
  margin: auto;
`;

const stepperOuterStyle = css`
  max-width: 400px;
  margin: auto;
`;

export const EmojiRequestFormContainer: React.FC<PropsWithChildren<{
  step: number;
}>> = (p) => {
  useLoginGuard();

  const navigate = useNavigate();
  const location = useLocation();

  const [{data: limit}] = useAtom(remainingEmojiRequestLimitAtom);
  const [{data: user}] = useAtom(userAtom);
  const isStaff = isEmojiStaff(user!);
  const isShrimpiaPlus = user && user.shrimpiaPlus !== 'not-member';

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
      <h1 className="lu-mb-6">カスタム絵文字の追加申請</h1>
      {!isShrimpiaPlus && limit === 0 ? (
        <OnlyShrimpiaPlus>カスタム絵文字の追加申請</OnlyShrimpiaPlus>
      ) : (
        <>
          <div className="lu-mb-6">
            残り申請可能数: {
              isStaff
                ? <b>スタッフのため無制限</b>
                : <b className={limit === 0 ? 'text-danger' : ''}>{limit}</b>
            }<br/>
            <small className="lu-text-dimmed">
            月ごとのリクエスト可能数は、
              <a href="https://docs.shrimpia.network/services/shrimpia-plus/" target="_blank" rel="noopener noreferrer">
              Shrimpia+
              </a>
            ページをご確認ください。
            </small>
          </div>
          {limit > 0 && (
            <Card>
              {p.step !== 0 && (
                <Button variant="ghost" className="lu-me-4" onClick={goBack}>
                  <i className="bi bi-arrow-left" /> 戻る
                </Button>
              )}

              <div className={stepperOuterStyle}>
                <Stepper activeStep={p.step} steps={steps} onChange={teleportTo} />
              </div>
              <div className="lu-py-12">
                <ErrorBoundary>
                  <Suspense fallback={<LoadingView />}>
                    {p.children}
                  </Suspense>
                </ErrorBoundary>
              </div>
            </Card>
          )}
        </>
      )}
    </Container>
  );
};

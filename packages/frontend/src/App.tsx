import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppHeader } from '@/components/common/AppHeader';
import { LoadingView } from '@/components/common/LoadingView';
import { ModalSpinner } from '@/components/common/ModalSpinner';
import { useApplyTheme } from '@/hooks/useApplyTheme';
import routes from '~react-pages';

import 'bootstrap-icons/font/bootstrap-icons.min.css';
import '@/design-system/tokens.css';
import '@/design-system/bundle.css';
import '@/App.scss';

function App() {
  useApplyTheme();

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingView/>}>
        <AppHeader />
        <ModalSpinner />
        <div className="lu-mt-12">
          <ErrorBoundary>
            <Suspense fallback={<LoadingView/>}>
              {useRoutes(routes)}
              <footer className="lu-text-center lu-text-dimmed" style={{ marginTop: 128, fontFamily: 'serif' }}>
                <p>
                  (C)2023-2026 Shrimpia Network
                </p>
                <p>
                  <a className="lu-text-dimmed" href="https://github.com/shrimpia/portal" target="_blank" rel="noopener noreferrer">GitHub</a>
                </p>
              </footer>
            </Suspense>
          </ErrorBoundary>
        </div>
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;

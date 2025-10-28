import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import { ErrorBoundary } from '@/components/common/ErrorBoundary';
import { AppHeader } from '@/components/common/AppHeader';
import { LoadingView } from '@/components/common/LoadingView';
import { ModalSpinner } from '@/components/common/ModalSpinner';
import { useApplyTheme } from '@/hooks/useApplyTheme';
import routes from '~react-pages';

import 'bootstrap-icons/font/bootstrap-icons.min.css';
import '@/fonts.scss';
import '@/App.scss';

function App() {
  useApplyTheme();

  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingView/>}>
        <AppHeader />
        <ModalSpinner />
        <div className="mt-5">
          <ErrorBoundary>
            <Suspense fallback={<LoadingView/>}>
              {useRoutes(routes)}
              <footer className="text-center text-muted" style={{ marginTop: 128, fontFamily: 'serif' }}>
                <p>
                  (C)2023-2025 Shrimpia Network
                </p>
                <p>
                  <a className="text-muted" href="https://github.com/shrimpia/portal" target="_blank" rel="noopener noreferrer">GitHub</a>
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

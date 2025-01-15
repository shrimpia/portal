import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import { ErrorBoundary } from './components/common/ErrorBoundary';

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
            (C)2023-2025 シュリンピア帝国<br/>
            政府は、国民および帝国政府による特別な許諾を得た者のみに対し、本システムの利用を許諾する。<br/>
            本システムの利用により生じたいかなる損害に対しても、政府は責任を負わない。
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

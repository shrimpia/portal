import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import { AppHeader } from '@/components/common/AppHeader';
import { LoadingView } from '@/components/common/LoadingView';
import { ModalSpinner } from '@/components/common/ModalSpinner';
import routes from '~react-pages';

import 'bootstrap-icons/font/bootstrap-icons.min.css';
import '@/fonts.scss';
import '@/App.scss';

function App() {
  return (
    <Suspense fallback={<LoadingView/>}>
      <AppHeader />
      <ModalSpinner />
      <Suspense fallback={<LoadingView/>}>
        {useRoutes(routes)}
        <footer className="text-center text-muted" style={{ marginTop: 128, fontFamily: 'serif' }}>
          <p>
            (C)2023 Shrimpia Empire<br/>
            政府は、国民および帝国政府による特別な許諾を得た者のみに対し、本システムの利用を許諾する。<br/>
            本システムの利用により生じたいかなる損害に対しても、政府は責任を負わない。
          </p>
          <p>
            <a className="text-muted" href="https://github.com/shrimpia/portal" target="_blank" rel="noopener noreferrer">GitHub</a>
          </p>
        </footer>
      </Suspense>
    </Suspense>
  );
}

export default App;

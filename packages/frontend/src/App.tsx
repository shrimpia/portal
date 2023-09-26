import { Suspense } from 'react';
import { useRoutes } from 'react-router-dom';

import { AppHeader } from './components/domains/global/AppHeader';
import { GlobalSpinner } from './components/domains/global/GlobalSpinner';
import { LoadingView } from './components/views/LoadingView';

import routes from '~react-pages';

import 'bootstrap-icons/font/bootstrap-icons.min.css';
import './fonts.scss';
import './App.scss';

function App() {
  return (
    <Suspense fallback={<LoadingView/>}>
      <AppHeader />
      <GlobalSpinner />
      <Suspense fallback={<LoadingView/>}>
        {useRoutes(routes)}
      </Suspense>
    </Suspense>
  );
}

export default App;

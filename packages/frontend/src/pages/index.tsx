import { useAtomValue } from 'jotai';

import { SessionPage } from '../components/domains/index/SessionPage';
import { WelcomePage } from '../components/domains/index/WelcomePage';
import { tokenAtom } from '../states/sessions';

const IndexPage = () => {
  const token = useAtomValue(tokenAtom);
  
  return token ? <SessionPage /> : <WelcomePage />;
};

export default IndexPage;

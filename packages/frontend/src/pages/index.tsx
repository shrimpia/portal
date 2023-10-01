import { useAtomValue } from 'jotai';

import { IndexSessionPage } from '@/components/subpages/index/SessionPage';
import { IndexWelcomePage } from '@/components/subpages/index/WelcomePage';
import { tokenAtom } from '@/states/sessions';

const IndexPage = () => {
  const token = useAtomValue(tokenAtom);
  
  return token ? <IndexSessionPage /> : <IndexWelcomePage />;
};

export default IndexPage;

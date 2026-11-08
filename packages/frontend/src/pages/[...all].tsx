import { Link } from 'react-router-dom';

import { Container } from '@/components/ui/Container';

const NotFoundPage = () => {
  return (
    <Container>
      <h1>このページは存在しません。</h1>
      <p>URLを間違えていないか確認してください。</p>
      <Link to="/">トップページへ戻る</Link>
    </Container>
  );
};

export default NotFoundPage;

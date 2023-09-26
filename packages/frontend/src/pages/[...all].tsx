import { Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <Container>
      <h1 className="fs-2">このページは存在しません。</h1>
      <p>URLを間違えていないか確認してください。</p>
      <Link to="/">トップページへ戻る</Link>
    </Container>
  );
};

export default NotFoundPage;

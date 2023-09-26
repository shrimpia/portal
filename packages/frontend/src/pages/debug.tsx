import { useAtom } from 'jotai';
import { Container, Form, Stack } from 'react-bootstrap';

import { shrimpiaPlusEmulationAtom } from '../states/debug';

const DebugPage = () => {
  const [ shrimpiaPlusEmulation, setShrimpiaPlusEmulation ] = useAtom(shrimpiaPlusEmulationAtom);

  if (import.meta.env.PROD) {
    return (
      <Container>
        <h1 className="fs-3 mb-5">デバッグ</h1>
        <p>開発環境でのみ有効です。</p>
      </Container>
    );
  }

  return (
    <Container>
      <h1 className="fs-3 mb-5">デバッグ</h1>
      <Stack>
        <Form.Group controlId="shrimpiaPlusEmulation">
          <Form.Label>Shrimpia+ エミュレーション</Form.Label>
          <Form.Select value={shrimpiaPlusEmulation} onChange={e => setShrimpiaPlusEmulation(e.target.value as any)}>
            <option value="default">デバッグしない</option>
            <option value="not-member">Shrimpia+ 未参加</option>
            <option value="lite">Shrimpia+ Lite</option>
            <option value="normal">Shrimpia+</option>
            <option value="pro">Shrimpia+ Pro</option>
          </Form.Select>
        </Form.Group>
      </Stack>
    </Container>
  );
};
export default DebugPage;

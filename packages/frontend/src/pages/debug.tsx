import { useAtom, useAtomValue } from 'jotai';
import { useState } from 'react';
import { Container, Form, Stack } from 'react-bootstrap';

import { MfmView } from '@/components/common/MfmView';
import { shrimpiaPlusEmulationAtom } from '@/states/debug';
import { emojisAtom } from '@/states/emojis';

const DebugPage = () => {
  const [shrimpiaPlusEmulation, setShrimpiaPlusEmulation] = useAtom(shrimpiaPlusEmulationAtom);
  const emojis = useAtomValue(emojisAtom);

  const [mfm, setMfm] = useState('**Hello, world!**');

  return (
    <Container>
      <h1 className="fs-3 mb-5">デバッグ</h1>
      <Stack gap={5}>
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

        <pre style={{ height: 256, overflow: 'auto' }}>
          {JSON.stringify(emojis)}
        </pre>

        <Form.Group controlId="mfm">
          <Form.Label>MFM</Form.Label>
          <Form.Control as="textarea" rows={10} value={mfm} onChange={e => setMfm(e.target.value)} />
          <div className="mt-3">
            <MfmView>{mfm}</MfmView>
          </div>
        </Form.Group>
      </Stack>
    </Container>
  );
};
export default DebugPage;

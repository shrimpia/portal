import { useAtom } from 'jotai';
import { useCallback, useMemo, useState } from 'react';
import { Button, Container, Form, Stack } from 'react-bootstrap';

import { MfmView } from '@/components/common/MfmView';
import { Stepper } from '@/components/common/Stepper';
import { useAPI } from '@/services/api';
import { shrimpiaPlusEmulationAtom } from '@/states/debug';

const DebugPage = () => {
  const [shrimpiaPlusEmulation, setShrimpiaPlusEmulation] = useAtom(shrimpiaPlusEmulationAtom);

  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(3);

  const [mfm, setMfm] = useState('**Hello, world!**');

  const api = useAPI();

  const steps = useMemo(() => Array.from({ length: maxStep }, (_, i) => `Step ${i + 1}`), [maxStep]);

  const testNotification = useCallback(() => {
    api.testNotification();
  }, [api]);

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
        
        <Stack gap={3}>
          <h2 className="fs-4">Stepper</h2>
          <Stepper activeStep={step} steps={steps} onChange={i => setStep(i)} />
          <Stack direction="horizontal" gap={2}>
            <Button variant="primary" onClick={() => setStep(step - 1)} disabled={step === 0}>←</Button>
            <Button variant="primary" onClick={() => setStep(step + 1)} disabled={step === maxStep}>→</Button>
          </Stack>
          <Stack direction="horizontal" gap={2}>
            <Button variant="primary" onClick={() => setMaxStep(maxStep - 1)} disabled={maxStep === 0}>maxStep--</Button>
            <Button variant="primary" onClick={() => setMaxStep(maxStep + 1)}>maxStep++</Button>
          </Stack>
        </Stack>

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

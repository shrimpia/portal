import { useAtom } from 'jotai';
import { useMemo, useState } from 'react';

import { MfmView } from '@/components/common/MfmView';
import { Stepper } from '@/components/common/Stepper';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { Select } from '@/components/ui/Select';
import { Stack } from '@/components/ui/Stack';
import { Textarea } from '@/components/ui/Textarea';
import { shrimpiaPlusEmulationAtom } from '@/states/debug';
import { useLoginGuard } from '@/hooks/useLoginGuard';

const DebugPage = () => {
  useLoginGuard();
  const [shrimpiaPlusEmulation, setShrimpiaPlusEmulation] = useAtom(shrimpiaPlusEmulationAtom);

  const [step, setStep] = useState(0);
  const [maxStep, setMaxStep] = useState(3);

  const [mfm, setMfm] = useState('**Hello, world!**');

  const steps = useMemo(() => Array.from({ length: maxStep }, (_, i) => `Step ${i + 1}`), [maxStep]);

  return (
    <Container>
      <h1 className="lu-mb-12">デバッグ</h1>
      <Stack gap={12}>
        <Select title="Shrimpia+ エミュレーション" value={shrimpiaPlusEmulation} onChange={e => setShrimpiaPlusEmulation(e.target.value as any)}>
          <option value="default">デバッグしない</option>
          <option value="not-member">Shrimpia+ 未参加</option>
          <option value="lite">Shrimpia+ Lite</option>
          <option value="normal">Shrimpia+</option>
          <option value="pro">Shrimpia+ Pro</option>
        </Select>
        
        <Stack gap={4}>
          <h2>Stepper</h2>
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

        <div>
          <Textarea title="MFM" rows={10} value={mfm} onChange={e => setMfm(e.target.value)} />
          <div className="lu-mt-4">
            <MfmView>{mfm}</MfmView>
          </div>
        </div>
      </Stack>
    </Container>
  );
};
export default DebugPage;

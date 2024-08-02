import { css } from '@linaria/core';
import { useMemo } from 'react';

export type StepperProp = {
    activeStep: number;
    steps: string[];
    onChange?: (step: number) => void;
};

const stepperStyle = css`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const stepStyle = css`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 0.8rem;

  > .circle {
      display: flex;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      justify-content: center;
      align-items: center;
      font-weight: bold;
      border: 2px solid transparent;
  }

  > .label {
    font-weight: bold;
  }

  &[data-state='todo'] {
    .circle {
      background-color: transparent;
      color: var(--sh-primary);
    }
  }

  &[data-state='active'] {
    .circle {
      background-color: transparent;
      color: var(--sh-primary);
      border-color: var(--sh-primary);
    }
  }

  &[data-state='done'] {
    .circle {
      background-color: var(--sh-primary);
      color: white;
      border-color: var(--sh-primary);
      cursor: pointer;
    }
  }
`;

const lineStyle = css`
  flex: 1;
  border-top: 1px solid var(--bs-border-color);
  margin-top: 15px;

  &[data-state='done'] {
    border-top: 2px solid var(--sh-primary);
  }
`;

const Step: React.FC<{ label: string; i: number; activeStep: number; steps: string[]; onClick?: () => void; }> = (p) => {
  const state = useMemo(() => p.i < p.activeStep ? 'done' : p.i === p.activeStep ? 'active' : 'todo', [p.i, p.activeStep]);

  return (
    <>
      <div className={stepStyle} data-state={state}>
        <div className="circle" role={state === 'done' ? 'button' : undefined} onClick={state === 'done' ? p.onClick : undefined}>
          {state === 'done' ? <i className="bi bi-check2"/> : p.i + 1}
        </div>
        <div className="label">{p.label}</div>
      </div>
      {p.i < p.steps.length - 1 && <div className={lineStyle} data-state={state} />}
    </>
  );
};

export const Stepper: React.FC<StepperProp> = (p) => {
  return (
    <div className={stepperStyle}>
      {p.steps.map((label, i) => <Step key={`${i}-${label}`} label={label} i={i} activeStep={p.activeStep} steps={p.steps} onClick={() => p.onChange?.(i) } />)}
    </div>
  );
};

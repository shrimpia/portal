import { css } from '@linaria/core';
import React from 'react';

import { Button } from '@/components/ui/Button';
import { classNames } from '@/util/class-names';

const commandButtonsStyle = css`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

export type SubmitButtonProp = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SubmitButton: React.FC<SubmitButtonProp> = (p) => {
  return (
    <div className={commandButtonsStyle}>
      <Button variant="primary" type="submit" {...p} className={classNames('lu-px-12', p.className)}>
        <i className="bi bi-arrow-right me"/> {p.children}
      </Button>
    </div>
  );
};

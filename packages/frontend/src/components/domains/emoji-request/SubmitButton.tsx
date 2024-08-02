import { css } from '@linaria/core';
import React from 'react';
import { Button } from 'react-bootstrap';

const commandButtonsStyle = css`
  display: flex;
  justify-content: center;
  margin-top: 50px;
`;

export type SubmitButtonProp = React.ButtonHTMLAttributes<HTMLButtonElement>;

export const SubmitButton: React.FC<SubmitButtonProp> = (p) => {
  return (
    <div className={commandButtonsStyle}>
      <Button type="submit" {...p} className={`px-5 ${p.className}`}>
        <i className="bi bi-arrow-right me"/> {p.children}
      </Button>
    </div>
  );
};

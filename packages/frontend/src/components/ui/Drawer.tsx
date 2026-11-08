import { useId } from 'react';

import { Button } from './Button';
import { useModalDialog } from './Dialog';

import type { ReactNode } from 'react';

export type DrawerProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children?: ReactNode;
};

/**
 * デザインシステムの Drawer (`lu-drawer`)。右端に出る側面のパネル。
 */
export const Drawer: React.FC<DrawerProps> = ({ open, onClose, title, children }) => {
  const titleId = useId();
  const { ref, isBackdropClick } = useModalDialog(open, onClose);

  return (
    <dialog
      ref={ref}
      className="lu-drawer"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget && isBackdropClick(e)) onClose();
      }}
    >
      <div className="lu-stack lu-stack--horizontal lu-stack--justify-between lu-stack--align-center">
        <h2 className="lu-drawer__title" id={titleId}>{title}</h2>
        <Button variant="ghost" size="sm" onClick={onClose}>閉じる</Button>
      </div>
      <div className="lu-drawer__body">{children}</div>
    </dialog>
  );
};

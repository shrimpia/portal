import { useCallback, useEffect, useId, useRef } from 'react';

import type { ReactNode } from 'react';

/**
 * `<dialog>` の開閉を `open` に合わせる。Esc などで閉じたときは `onClose` を呼ぶ。
 */
export const useModalDialog = (open: boolean, onClose: () => void) => {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.addEventListener('close', onClose);
    return () => dialog.removeEventListener('close', onClose);
  }, [onClose]);

  // 背景(::backdrop)のクリックか。ダイアログ自身の余白のクリックは含まない
  const isBackdropClick = useCallback((e: React.MouseEvent<HTMLDialogElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    return e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom;
  }, []);

  return { ref, isBackdropClick };
};

export type DialogProps = {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  /** 右下に並ぶボタン */
  actions?: ReactNode;
  /** false にすると、Esc や背景のクリックでは閉じない */
  dismissible?: boolean;
  children?: ReactNode;
};

/**
 * デザインシステムの Dialog (`lu-dialog`)。ネイティブの `<dialog>` を `showModal()` で開く。
 */
export const Dialog: React.FC<DialogProps> = ({ open, onClose, title, actions, dismissible = true, children }) => {
  const titleId = useId();
  const { ref, isBackdropClick } = useModalDialog(open, onClose);

  return (
    <dialog
      ref={ref}
      className="lu-dialog"
      aria-labelledby={title ? titleId : undefined}
      onCancel={(e) => {
        if (!dismissible) e.preventDefault();
      }}
      onClick={(e) => {
        if (dismissible && e.target === e.currentTarget && isBackdropClick(e)) onClose();
      }}
    >
      {title && <h2 className="lu-dialog__title" id={titleId}>{title}</h2>}
      <div className="lu-dialog__body">{children}</div>
      {actions && <div className="lu-dialog__actions">{actions}</div>}
    </dialog>
  );
};

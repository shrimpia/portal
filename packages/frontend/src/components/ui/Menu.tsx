import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { Button } from './Button';

import type { ComponentPropsWithoutRef, ElementType, HTMLAttributes, ReactNode } from 'react';

import { classNames } from '@/util/class-names';

const MenuContext = createContext<{ close: () => void } | null>(null);

export type MenuProps = {
  /** トリガーのボタンの中身 */
  label: ReactNode;
  /** トリガーのボタンに付ける `aria-label` */
  'aria-label'?: string;
  className?: string;
  children?: ReactNode;
};

/**
 * デザインシステムの Menu (`lu-menu`)。トリガーの下に開く操作の一覧。
 * パネルの外を押したときと Esc キーで閉じる。
 */
export const Menu = ({ label, className, children, ...rest }: MenuProps) => {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      triggerRef.current?.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <MenuContext.Provider value={{ close }}>
      <div ref={rootRef} className={classNames('lu-menu', className)}>
        <Button
          ref={triggerRef}
          aria-haspopup="menu"
          aria-expanded={open}
          aria-label={rest['aria-label']}
          onClick={() => setOpen((v) => !v)}
        >
          {label}
        </Button>
        <div className="lu-menu__panel" role="menu" hidden={!open}>
          {children}
        </div>
      </div>
    </MenuContext.Provider>
  );
};

type ItemOwnProps<T extends ElementType> = {
  as?: T;
  /** 取り消せない操作(ログアウト、削除)。文字が `danger` になる */
  danger?: boolean;
};

export type MenuItemProps<T extends ElementType = 'button'> = ItemOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof ItemOwnProps<T>>;

const Item = <T extends ElementType = 'button'>({ as, danger, className, onClick, ...rest }: MenuItemProps<T>) => {
  const ctx = useContext(MenuContext);
  const Component: ElementType = as ?? 'button';
  return (
    <Component
      type={Component === 'button' ? 'button' : undefined}
      role="menuitem"
      className={classNames('lu-menu__item', danger && 'lu-menu__item--danger', className)}
      onClick={(e: React.MouseEvent) => {
        onClick?.(e);
        ctx?.close();
      }}
      {...rest}
    />
  );
};

const Divider: React.FC = () => <hr className="lu-menu__divider" />;

const Text: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => (
  <div className={classNames('lu-menu__text', className)} {...rest} />
);

Menu.Item = Item;
Menu.Divider = Divider;
Menu.Text = Text;

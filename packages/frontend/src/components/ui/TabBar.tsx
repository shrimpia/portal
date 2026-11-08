import { createContext, useContext } from 'react';

import type { ComponentPropsWithoutRef } from 'react';

import { classNames } from '@/util/class-names';

type TabBarContextValue<T extends string> = {
  value: T;
  onChange: (value: T) => void;
};

const TabBarContext = createContext<TabBarContextValue<any> | null>(null);

export type TabBarProps<T extends string> = Omit<ComponentPropsWithoutRef<'div'>, 'onChange'> & {
  /** 選ばれているタブの値 */
  value: T;
  onChange: (value: T) => void;
};

/**
 * デザインシステムの TabBar (`lu-tabbar`)。表示を切り替えるタブの並び。
 */
export const TabBar = <T extends string>({ value, onChange, className, ...rest }: TabBarProps<T>) => (
  <TabBarContext.Provider value={{ value, onChange }}>
    <div role="tablist" className={classNames('lu-tabbar', className)} {...rest} />
  </TabBarContext.Provider>
);

export type TabProps = Omit<ComponentPropsWithoutRef<'button'>, 'value'> & {
  value: string;
};

const Tab: React.FC<TabProps> = ({ value, className, onClick, ...rest }) => {
  const ctx = useContext(TabBarContext);
  if (!ctx) throw new Error('TabBar.Tab は TabBar の中に置いてください');
  return (
    <button
      type="button"
      role="tab"
      aria-selected={ctx.value === value}
      className={classNames('lu-tabbar__tab', className)}
      onClick={(e) => {
        onClick?.(e);
        ctx.onChange(value);
      }}
      {...rest}
    />
  );
};

TabBar.Tab = Tab;

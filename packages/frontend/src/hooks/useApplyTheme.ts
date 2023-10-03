import { useAtom, useAtomValue } from 'jotai';
import { useLayoutEffect } from 'react';

import { currentThemeAtom, themeAtom } from '@/states/screen';

export const useApplyTheme = () => {
  const theme = useAtomValue(themeAtom);
  const [currentTheme, setCurrentTheme] = useAtom(currentThemeAtom);
 
  useLayoutEffect(() => {
    if (theme === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      const onChange = (e: MediaQueryListEvent) => {
        setCurrentTheme(e.matches ? 'dark' : 'light');
      };
      media.addEventListener('change', onChange);
      setCurrentTheme(media.matches ? 'dark' : 'light');
      return () => {
        media.removeEventListener('change', onChange);
      };
    }
    setCurrentTheme(theme);
  }, [setCurrentTheme, theme]);

  useLayoutEffect(() => {
    const html = document.documentElement as HTMLHtmlElement;
    if (!html) return;

    html.dataset.bsTheme = currentTheme;
  });
};

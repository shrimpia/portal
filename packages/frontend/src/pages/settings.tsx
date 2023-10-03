import { useAtom } from 'jotai';
import { useCallback } from 'react';
import { Container, Form } from 'react-bootstrap';

import type { ThemeType } from '@/types/theme-type';

import { themeAtom } from '@/states/screen';

const SettingsPage = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const updateTheme = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value as ThemeType);
  }, [setTheme]);

  return (
    <Container>
      <h1 className="fs-3 mb-5">設定</h1>
      <h2 className="fs-4">テーマ設定</h2>
      <Form.Check id="system" type="radio" label="システム設定に合わせる" value="system" checked={theme === 'system'} onChange={updateTheme} />
      <Form.Check id="dark" type="radio" label="ダークテーマ" value="dark" checked={theme === 'dark'} onChange={updateTheme} />
      <Form.Check id="light" type="radio" label="ライトテーマ" value="light" checked={theme === 'light'} onChange={updateTheme} />
    </Container>
  );
};

export default SettingsPage;

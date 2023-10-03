import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { Card, Container, Form } from 'react-bootstrap';

import type { ThemeType } from '@/types/theme-type';

import { currentThemeAtom, themeAtom } from '@/states/screen';

const SettingsPage = () => {
  const [theme, setTheme] = useAtom(themeAtom);
  const currentTheme = useAtomValue(currentThemeAtom);
  const updateTheme = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value as ThemeType);
  }, [setTheme]);

  return (
    <Container>
      <h1 className="fs-3 mb-5">設定</h1>
      <Card>
        <Card.Body>
          <Card.Title><i className={`bi bi-${currentTheme === 'light' ? 'sun' : 'moon'}-fill`} /> テーマ設定</Card.Title>
          <Card.Text className="text-muted">ポータル全体に適用されるカラーテーマを設定します。</Card.Text>
          <Form.Check id="system" type="radio" label="システム設定に合わせる" value="system" checked={theme === 'system'} onChange={updateTheme} />
          <Form.Check id="dark" type="radio" label="ダークテーマ" value="dark" checked={theme === 'dark'} onChange={updateTheme} />
          <Form.Check id="light" type="radio" label="ライトテーマ" value="light" checked={theme === 'light'} onChange={updateTheme} />
        </Card.Body>
      </Card>
    </Container>
  );
};

export default SettingsPage;

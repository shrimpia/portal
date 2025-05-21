import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';
import { Card, Container, Form, Stack } from 'react-bootstrap';

import type { ThemeType } from '@/types/theme-type';

import { currentThemeAtom, optoutNewEmojiRequestFormAtom, themeAtom } from '@/states/screen';
import { useLoginGuard } from '@/hooks/useLoginGuard';

const SettingsPage = () => {
  useLoginGuard();
  const [theme, setTheme] = useAtom(themeAtom);
  const currentTheme = useAtomValue(currentThemeAtom);
  const [optoutNewEmojiRequestForm, setOptoutNewEmojiRequestForm] = useAtom(optoutNewEmojiRequestFormAtom);
  const updateTheme = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value as ThemeType);
  }, [setTheme]);

  return (
    <Container>
      <h1 className="fs-3 mb-5">設定</h1>
      <Stack gap={3}>
        <Card>
          <Card.Body>
            <Card.Title><i className={`bi bi-${currentTheme === 'light' ? 'sun' : 'moon'}-fill`} /> テーマ設定</Card.Title>
            <Card.Text className="text-muted">ポータル全体に適用されるカラーテーマを設定します。</Card.Text>
            <Form.Check id="system" type="radio" label="システム設定に合わせる" value="system" checked={theme === 'system'} onChange={updateTheme} />
            <Form.Check id="dark" type="radio" label="ダークテーマ" value="dark" checked={theme === 'dark'} onChange={updateTheme} />
            <Form.Check id="light" type="radio" label="ライトテーマ" value="light" checked={theme === 'light'} onChange={updateTheme} />
          </Card.Body>
        </Card>

        <Card>
          <Card.Body>
            <Card.Title><i className="bi bi-magic" /> オプトアウト設定</Card.Title>
            <Card.Text className="text-muted">
              新機能を差し戻すことができます。<br/>
              これらの設定は、今後の更新で追加/削除される可能性があります。
            </Card.Text>
            <Form.Switch>
              <Form.Check.Input id="optoutNewEmojiRequestForm" type="checkbox" checked={optoutNewEmojiRequestForm} onChange={() => setOptoutNewEmojiRequestForm(!optoutNewEmojiRequestForm)} />
              <Form.Check.Label htmlFor="optoutNewEmojiRequestForm">
                カスタム絵文字の追加申請フォームを従来版に戻す
              </Form.Check.Label>
            </Form.Switch>
          </Card.Body>
        </Card>
      </Stack>
    </Container>
  );
};

export default SettingsPage;

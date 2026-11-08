import { useAtom, useAtomValue } from 'jotai';
import { useCallback } from 'react';

import type { ThemeType } from '@/types/theme-type';

import { Card } from '@/components/ui/Card';
import { Radio } from '@/components/ui/Choice';
import { Container } from '@/components/ui/Container';
import { Stack } from '@/components/ui/Stack';
import { currentThemeAtom, themeAtom } from '@/states/screen';
import { useLoginGuard } from '@/hooks/useLoginGuard';

const SettingsPage = () => {
  useLoginGuard();
  const [theme, setTheme] = useAtom(themeAtom);
  const currentTheme = useAtomValue(currentThemeAtom);
  const updateTheme = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value as ThemeType);
  }, [setTheme]);

  return (
    <Container>
      <h1 className="lu-mb-12">設定</h1>
      <Stack gap={4}>
        <Card>
          <Card.Title><i className={`bi bi-${currentTheme === 'light' ? 'sun' : 'moon'}-fill`} /> テーマ設定</Card.Title>
          <Card.Text className="lu-text-dimmed">ポータル全体に適用されるカラーテーマを設定します。</Card.Text>
          <div role="radiogroup" aria-label="テーマ">
            <Radio name="theme" value="system" checked={theme === 'system'} onChange={updateTheme}>システム設定に合わせる</Radio>
            <Radio name="theme" value="dark" checked={theme === 'dark'} onChange={updateTheme}>ダークテーマ</Radio>
            <Radio name="theme" value="light" checked={theme === 'light'} onChange={updateTheme}>ライトテーマ</Radio>
          </div>
        </Card>
      </Stack>
    </Container>
  );
};

export default SettingsPage;

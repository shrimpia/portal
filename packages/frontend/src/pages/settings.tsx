import { useCallback, useState } from 'react';
import { Alert, Container, Form } from 'react-bootstrap';

const SettingsPage = () => {
  const [theme, setTheme] = useState('system');
  const updateTheme = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTheme(e.target.value);
  }, []);
  return (
    <Container>
      <h1 className="fs-3 mb-5">設定</h1>
      <h2 className="fs-4">テーマ設定</h2>
      <Alert variant="warning">
        <i className="bi bi-exclamation-triangle-fill me-2"></i>
        開発中
      </Alert>
      <Form.Check disabled id="system" type="radio" label="システム設定に合わせる" value="system" checked={theme === 'system'} onChange={updateTheme} />
      <Form.Check disabled id="dark" type="radio" label="ダークテーマ" value="dark" checked={theme === 'dark'} onChange={updateTheme} />
      <Form.Check disabled id="light" type="radio" label="ライトテーマ" value="light" checked={theme === 'light'} onChange={updateTheme} />
    </Container>
  );
};

export default SettingsPage;

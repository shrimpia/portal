import { ErrorBoundary } from "@/components/common/ErrorBoundary";
import { LoadingView } from "@/components/common/LoadingView";
import { MinecraftAccountList } from "@/components/domains/minecraft/MinecraftAccountList";
import { useLoginGuard } from "@/hooks/useLoginGuard";
import { useWithSpinner } from "@/hooks/useWithSpinner";
import { useAPI } from "@/services/api";
import { Suspense, useCallback, useState } from "react";
import { Button, Card, Container, Form, InputGroup, Stack } from "react-bootstrap";

const MinecraftPage = () => {
  useLoginGuard();
  const [code, setCode] = useState('');

  const api = useAPI();
  const withSpinner = useWithSpinner();

  const onCodeInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    // 数字のみを受け付ける
    setCode(e.target.value.replace(/\D/g, ''));
  }, []);

  const handleAuthSubmit = useCallback((e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    withSpinner(async () => {
      try {
        await api.authMinecraft(code);
        alert("認証に成功しました！Minecraftをお楽しみください！");
        location.reload();
      } catch (e) {
        if (e instanceof Error) {
          alert("認証に失敗しました。\nエラー: " + e.message);
        } else {
          alert("謎のエラー");
        }
      }
    });
  }, [api, code, withSpinner]);

  return (
    <Container>
      <h1 className="fs-3 mb-3">Shrimpia Minecraft</h1>
      <p>シュリンピア帝国公式マインクラフトサーバーで遊ぼう。</p>

      <Stack gap={3}>
        <Card>
          <Card.Body>
            <Card.Title>所有アカウント</Card.Title>
              <ErrorBoundary>
                <Suspense fallback={<LoadingView />}>
                  <MinecraftAccountList />
                </Suspense>
              </ErrorBoundary>
          </Card.Body>
        </Card>
        
        <Card>
          <Card.Body>
            <Card.Title>認証方法</Card.Title>
            <Card.Text>
              <a href="https://docs.shrimpia.network/services/minecraft" target="_blank" rel="noreferrer noopener">ドキュメント</a>
              の手順に従って、Minecraftサーバーにログインしてください。<br/>
              サーバーから認証コードが返ってくるので、それを以下のフォームに入力してください。
            </Card.Text>

            <Form onSubmit={handleAuthSubmit}>
              <InputGroup>
                <Form.Control type="text" placeholder="000000" maxLength={6} value={code} onChange={onCodeInput} />
                <Button type="submit" variant="primary" disabled={code.length !== 6}>
                  <i className="bi bi-arrow-right me-2" />
                  認証
                </Button>
              </InputGroup>
            </Form>
          </Card.Body>
        </Card>
      </Stack>
    </Container>
  );
};

export default MinecraftPage;
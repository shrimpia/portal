import { useAPI } from "@/services/api";
import { useMemo, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";

const SurveyPage = () => {
  const [evaluation, setEvaluation] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [withUserId, setWithUserId] = useState(false);

  const api = useAPI();

  const body = useMemo(
    () => `評価: ${evaluation}\nコメント: ${comment}`,
    [evaluation, comment]
  );

  const reset = () => {
    setEvaluation(0);
    setComment("");
    setWithUserId(false);
  };

  const submit = async () => {
    if (evaluation === 0) {
      alert("評価を選択してください");
      return;
    }
    if (comment.length === 0) {
      alert("コメントを入力してください");
      return;
    }

    try {
      await api.createSurveyAnswer('tos_public_comment', body, withUserId);
      alert("送信しました。ご協力ありがとうございました！");
      reset();
    } catch (error) {
      console.error(error);
      alert("送信に失敗しました。");
    }
  };

  return (
    <Container>
      <h1 className="fs-3 mb-3">投書箱（β）</h1>
      <p>投書箱へようこそ。ここでは、シュリンピア帝国の国民から、皇帝へのメッセージを匿名で送信することができます。</p>

      <p>
        現在は、シュリンピアの新たな規約「サーバールール」の草案に対し、パブリックコメントを募集しています。<br/>
        より良いシュリンピアでの暮らしを実現するため、率直なご意見にご協力ください！！！
      </p>
      <ul className="mt-3">
        <li>いただいたご意見は、サーバールールの改善に役立てられます。内容は皇帝以外には公開されません。</li>
        <li>また、ご意見の内容が如何なるものであれど、あなたに不利益が生じることはありません。</li>
      </ul>
      <Button
        variant="link"
        as="a"
        href="https://go.shrimpia.network/tos-beta"
        target="_blank"
        rel="noopener noreferrer"
      >
        サーバールールを確認する
      </Button>
      <Card className="mt-3">
        <Card.Body>
          <Form as="div" className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>評価</Form.Label>
              <div className="sh-star-buttons">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className={`sh-star-button ${star <= evaluation ? "selected" : ""}`}
                    onClick={() => setEvaluation(star)}
                    aria-label={`${star}星`}
                  >
                    <i className={`bi bi-star${star <= evaluation ? "-fill" : ""}`}></i>
                  </button>
                ))}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>コメント</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="思いの丈をお聞かせください"
                maxLength={3000}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check>
                <Form.Check.Input
                  type="checkbox"
                  id="isAnonymous"
                  checked={withUserId}
                  onChange={(e) => setWithUserId(e.target.checked)}
                />
                <Form.Check.Label htmlFor="isAnonymous">
                  ユーザー名を送信する
                </Form.Check.Label>
                <Form.Text muted className="d-block">
                  デフォルトでは、このアンケートは匿名で送信されます。
                </Form.Text>
              </Form.Check>
            </Form.Group>
          </Form>
        </Card.Body>
        <Card.Footer>
          <Button onClick={submit}>送信</Button>
          <Button variant="secondary" className="ms-2" onClick={reset}>
            リセット
          </Button>
        </Card.Footer>
      </Card>
    </Container>
  );
};

export default SurveyPage;

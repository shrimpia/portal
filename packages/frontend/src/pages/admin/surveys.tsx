import { LoadingView } from "@/components/common/LoadingView";
import { MfmView } from "@/components/common/MfmView";
import { AdminContainer } from "@/components/domains/admin/AdminContainer";
import { surveyAnswersAtom } from "@/states/surveys";
import { useAtomValue } from "jotai";
import { Suspense, useMemo, useState } from "react";
import { Button, Card, Form, Stack } from "react-bootstrap";

const convertBody = (body: string) => {
  // 評価: \d+ で始まる行を、星評価に変換する（例: 3 -> ★★★☆☆）
  const lines = body.split("\n");
  const evaluationLine = lines[0];
  const evaluationMatch = evaluationLine.match(/評価:\s*(\d+)/);
  const evaluation = evaluationMatch ? parseInt(evaluationMatch[1]) : 0;
  const evaluationStars = "★".repeat(evaluation) + "☆".repeat(5 - evaluation);
  lines[0] = `評価: ${evaluationStars}`;
  return lines.join("\n");
};

const SurveyList = () => {
  const { data, refetch } = useAtomValue(surveyAnswersAtom);
  const [questionType, setQuestionType] = useState("");
  const questionTypeOptions = [
    { id: "", name: "全て" },
    { id: "tos_public_comment", name: "サーバールールについて" },
    { id: "letter", name: "投書"},
  ];

  const filteredData = useMemo(() => {
    if (!data) return [];
    if (questionType === "") return data;
    
    return data.filter((survey) => survey.question_type === questionType);
  }, [data, questionType]);

  return (
    <>
      <Stack direction="vertical" gap={3}>
        <Stack direction="horizontal" gap={3}>
          <Button variant="primary" onClick={() => refetch()}>
            再取得
          </Button>
          <Form.Select 
            className="w-auto"
            value={questionType}
            onChange={(e) => {
              setQuestionType(e.target.value);
              refetch();
            }}
            >
            {questionTypeOptions.map((option) => (
              <option key={option.id} value={option.id}>
                {option.name}
              </option>
            ))}
            </Form.Select>
        </Stack>
        {filteredData.map((survey) => (
          <Card key={survey.id}>
            <Card.Body>
              <MfmView>
                {convertBody(survey.body)}
              </MfmView>
              <div className="text-muted mt-2">
                <div>回答者: {survey.username ? `@${survey.username}` : <span className="text-muted">匿名希望</span>}</div>
                <div>回答日時: {new Date(survey.created_at).toLocaleString()}</div>
              </div>
            </Card.Body>
          </Card>
        ))}
        {filteredData.length === 0 && (
          <div className="text-muted text-center">
            <i className="bi bi-exclamation-triangle-fill"></i> 
            <span className="ms-2">回答はありません</span>
          </div>
        )}
      </Stack>
    </>
  );
};

const SurveyAnswerPage = () => {
  return (
    <AdminContainer mode="emperor">
      <h1 className="fs-3 mb-5">投書箱の管理</h1>
      <Suspense fallback={<LoadingView />}>
        <SurveyList />
      </Suspense>
    </AdminContainer>
  );
};

export default SurveyAnswerPage;

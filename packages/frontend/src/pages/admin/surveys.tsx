import { LoadingView } from "@/components/common/LoadingView";
import { MfmView } from "@/components/common/MfmView";
import { AdminContainer } from "@/components/domains/admin/AdminContainer";
import { useAPI } from "@/services/api";
import { surveyAnswersAtom } from "@/states/surveys";
import { SurveyAnswer } from "@/types/survey-answer";
import { useAtomValue } from "jotai";
import React, { Suspense, useEffect, useMemo, useState } from "react";
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

const SurveyCard: React.FC<{survey: SurveyAnswer}> = ({ survey }) => {
  const [comment, setComment] = useState("");
  const api = useAPI();

  useEffect(() => {
    setComment(survey.staff_comment);
  }, [survey.staff_comment]);

  const updateStaffComment = async () => {
    if (comment === survey.staff_comment) return;
    await api.admin.addStaffCommentToSurveyAnswer(survey.id, comment);
  };

  return (
    <Card key={survey.id}>
      <Card.Body>
        <MfmView>
          {convertBody(survey.body)}
        </MfmView>
        <div className="text-muted mt-2">
          <div>回答者: {survey.username ? `@${survey.username}` : <span className="text-muted">匿名希望</span>}</div>
          <div>回答日時: {new Date(survey.created_at).toLocaleString()}</div>
        </div>
        <div className="mt-2">
          <textarea
            className="form-control"
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="スタッフのコメント"
            maxLength={3000}
          />
          <Button
            variant="primary"
            className="mt-2"
            onClick={updateStaffComment}
            >更新</Button>
        </div>
      </Card.Body>
    </Card>
  );
}

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
          <SurveyCard
            key={survey.id}
            survey={survey}
            />
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

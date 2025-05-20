import { MfmView } from "@/components/common/MfmView";
import { AdminContainer } from "@/components/domains/admin/AdminContainer";
import { surveyAnswersAtom } from "@/states/surveys";
import { useAtomValue } from "jotai";
import { Button, Card, Stack } from "react-bootstrap";

const SurveyAnswerPage = () => {
  const { data, refetch } = useAtomValue(surveyAnswersAtom);

  return (
    <AdminContainer mode="emperor">
      <h1 className="fs-3 mb-5">投書箱の管理</h1>
      <Button variant="primary" onClick={() => refetch()}>
        アンケート回答を再取得
      </Button>

      <Stack direction="vertical" gap={3}>
        {data?.map((survey) => (
          <Card key={survey.id}>
            <Card.Body>
              <MfmView>
                {survey.body}
              </MfmView>
              <div className="text-muted mt-2">
                <div>回答者: {survey.username ? `@${survey.username}` : <span className="text-muted">匿名希望</span>}</div>
                <div>回答日時: {new Date(survey.created_at).toLocaleString()}</div>
              </div>
            </Card.Body>
          </Card>
        ))}
      </Stack>
    </AdminContainer>
  );
};

export default SurveyAnswerPage;

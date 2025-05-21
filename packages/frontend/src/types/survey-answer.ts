export type SurveyQuestionType = 'tos_public_comment';

export interface SurveyAnswer {
	id: string;
	created_at: string;
	question_type: SurveyQuestionType;
	body: string;
	user_id?: string | null;
    username?: string | null;
	staff_comment: string;
}

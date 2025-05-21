export interface SurveyAnswer {
	id: string;
	created_at: string;
	question_type: string;
	body: string;
	user_id?: string | null;
	staff_comment: string;
}

export interface SurveyAnswerWithUser extends SurveyAnswer {
	username?: string | null;
}

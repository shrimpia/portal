import type { SurveyAnswerWithUser } from '../models/survey-answer';

export class SurveyAnswerRepository {
  /**
	 * アンケート回答を新規追加します。
	 * @param db DBへの参照
	 * @param data 追加するデータ
	 * @returns 追加したレコードのID
	 */
  async create(db: D1Database, data: { body: string, questionType: string, userId?: string | null }) {
    const id = crypto.randomUUID();
    await db.prepare('INSERT INTO survey_answers (id, created_at, question_type, body, user_id) VALUES (?, ?, ?, ?, ?)')
      .bind(id, new Date().toISOString(), data.questionType, data.body, data.userId ?? null)
      .run();
    return id;
  }

  /**
	 * アンケート回答を全て取得します。
	 * @param db DBへの参照
	 * @returns アンケート回答の配列
	 */
  async readAll(db: D1Database) {
    return db.prepare('SELECT survey_answers.*, user.username FROM survey_answers LEFT JOIN user ON survey_answers.user_id = user.id')
      .all<SurveyAnswerWithUser>()
      .then(e => e.results);
  }
}

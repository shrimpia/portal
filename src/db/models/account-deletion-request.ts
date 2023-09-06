export interface AccountDeletionRequest {
	id: number;
	user_id: number;
	comment: string;
	is_completed: boolean;
}

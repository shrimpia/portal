/**
 * Misskeyのユーザー情報
 */
export interface MisskeyUser {
	id: string;
	username: string;
	name: string | null;
	isAdmin: boolean;
	isModerator: boolean;
	avatarUrl: string;

	roles: {
		id: string;
		name: string;
	}[];
}

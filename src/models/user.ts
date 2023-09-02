export interface MisskeyUser {
	id: string;
	username: string;
	name: string | null;
	isAdmin: boolean;
	isModerator: boolean;

	roles: {
		id: string;
		name: string;
	}[];
}

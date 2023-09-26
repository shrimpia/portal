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

	policies: {
    gtlAvailable: boolean,
    ltlAvailable: boolean,
    canPublicNote: boolean,
    canInvite: boolean,
    inviteLimit: number,
    inviteLimitCycle: number,
    inviteExpirationTime: number,
    canManageCustomEmojis: boolean,
    canSearchNotes: boolean,
    canHideAds: boolean,
    driveCapacityMb: number,
    alwaysMarkNsfw: boolean,
    pinLimit: number,
    antennaLimit: number,
    wordMuteLimit: number,
    webhookLimit: number,
    clipLimit: number,
    noteEachClipsLimit: number,
    userListLimit: number,
    userEachUserListsLimit: number,
    rateLimitFactor: number,
	},
}

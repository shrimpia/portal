import { SHRIMPIA_PLUS_ROLE_NAME } from "../const";
import { ShrimpiaPlus } from "../models/shrimpia-plus";
import { MisskeyUser } from "../models/user";

export const getShrimpiaPlus = (user: MisskeyUser): ShrimpiaPlus => {
	const roleNames = user.roles.map(r => r.name);
	console.log(roleNames);
	if (roleNames.includes(SHRIMPIA_PLUS_ROLE_NAME.pro)) return 'pro';
	if (roleNames.includes(SHRIMPIA_PLUS_ROLE_NAME.normal)) return 'normal';
	if (roleNames.includes(SHRIMPIA_PLUS_ROLE_NAME.lite)) return 'lite';
	return 'not-member';
};

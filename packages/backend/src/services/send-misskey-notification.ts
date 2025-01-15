import { callMisskeyApi } from './misskey-api';

// TODO: もっと良い場所に置きたい
const ICON = 'https://media.shrimpia.network/mk-shrimpia/files/cd9e1c60-49e2-41f4-9c87-d80fb71893e4.png';

export const sendMisskeyNotification = async (token: string, header: string, body: string) => {
  await callMisskeyApi('notifications/create', {
    i: token,
    header,
    body,
    icon: ICON,
  });
};

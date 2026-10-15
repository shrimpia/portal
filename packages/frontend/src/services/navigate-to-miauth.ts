import { URL_EMPIRE } from "@/consts";
import { v4 as uuid } from 'uuid';

/** 発行した MiAuth セッション ID を保存する sessionStorage のキー */
export const MIAUTH_SESSION_STORAGE_KEY = 'miauth_session';

/**
 * MiAuthへのリダイレクトを行います。
 * @param callbackTo 認証後に遷移する、シュリンピアポータルの相対パス。
 */
export const navigateToMiAuth = (callbackTo?: string) => {
        const sessionId = uuid();
    // コールバック時に、自分が開始したセッションかどうかを照合するために保存する
    sessionStorage.setItem(MIAUTH_SESSION_STORAGE_KEY, sessionId);
    const query = new URLSearchParams();
    query.set('name', 'シュリンピアポータル');
    const callbackUrl = callbackTo
        ? `${location.origin}/miauth?callback_to=${encodeURIComponent(callbackTo)}`
        : `${location.origin}/miauth`;
    query.set('callback', callbackUrl);
    query.set('permission', 'read:account,write:notifications');
    const url = `${URL_EMPIRE}/miauth/${sessionId}?${query.toString()}`;
    location.href = url;
};
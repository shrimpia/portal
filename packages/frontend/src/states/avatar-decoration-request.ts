import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomWithSuspenseQuery } from 'jotai-tanstack-query';

import { api } from '@/services/api';
import { tokenAtom } from '@/states/sessions';

/** アバターデコレーションリクエストのフィルタのAtom */
export const filterAtom = atomWithStorage<'mine' | 'all'>('avatarDecorationRequest:filter', 'mine');

/** 現在選択しているアバターデコレーションリクエストのIDのAtom*/
export const currentRequestIdAtom = atom<string | null>(null);

/** 選択したファイルのAtom */
export const fileAtom = atom<File | null>(null);

/** 選択したファイルのdata URLのAtom */
export const imgDataUrlAtom = atom<string | null>(null);

/** デコレーション名のAtom */
export const nameAtom = atom<string>('');

/** デコレーション説明のAtom */
export const descriptionAtom = atom<string>('');

/** ガイドライン同意のAtom */
export const agreedToGuidelinesAtom = atom<boolean>(false);

/** テンプレート確認同意のAtom */
export const confirmedTemplateAtom = atom<boolean>(false);

/**
 * アバターデコレーションリクエストの一覧をクエリするAtom
 */
export const avatarDecorationRequestsAtom = atomWithSuspenseQuery((get) => ({
  queryKey: ['avatarDecorationRequests', get(filterAtom), get(tokenAtom)],
  queryFn: async ({ queryKey }) => {
    const filter = queryKey[1] as 'mine' | 'all';
    const token = queryKey[2] as string | null;
    if (!token) return [];
    const requests = await api(token).getAllAvatarDecorationRequests(filter);
    return requests;
  },
}));

/**
 * 管理者ページにおける未処理のアバターデコレーションリクエストの一覧をクエリするAtom
 */
export const adminPendingAvatarDecorationRequestsAtom = atomWithSuspenseQuery((get) => ({
  queryKey: ['adminPendingAvatarDecorationRequests', get(tokenAtom)],
  queryFn: async ({ queryKey }) => {
    const token = queryKey[1] as string | null;
    if (!token) return [];
    const requests = await api(token).admin.getAllPendingAvatarDecorationRequests();
    return requests;
  },
}));

/**
 * 管理者ページにおけるアバターデコレーションリクエストの詳細をクエリするAtom
 */
export const adminCurrentAvatarDecorationRequestAtom = atomWithSuspenseQuery((get) => ({
  queryKey: ['adminCurrentAvatarDecorationRequest', get(tokenAtom), get(currentRequestIdAtom)],
  queryFn: async ({ queryKey }) => {
    const token = queryKey[1] as string | null;
    const id = queryKey[2] as string | null;
    if (!token || !id) return null;
    const req = await api(token).admin.getAvatarDecorationRequest(id);
    return req;
  },
}));

/**
 * アバターデコレーション申請可能枠をクエリするAtom
 */
export const remainingAvatarDecorationRequestLimitAtom = atomWithSuspenseQuery((get) => ({
  queryKey: ['remainingAvatarDecorationRequestLimit', get(tokenAtom)],
  queryFn: async ({ queryKey }) => {
    const token = queryKey[1] as string | null;
    if (!token) return 0;
    const result = await api(token).getRemainingAvatarDecorationRequestLimit();
    return result.limit;
  },
}));

/**
 * 管理画面: アバターデコレーションテンプレート表示の設定を保存するAtom
 */
export const adminAvatarDecorationRequestIsShowingTemplateAtom = atomWithStorage<boolean>('admin:avatarDecorationRequest:isShowingTemplate', true);

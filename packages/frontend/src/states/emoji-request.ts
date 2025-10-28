import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';
import { atomWithInfiniteQuery, atomWithSuspenseQuery } from 'jotai-tanstack-query';

import type { BasicInputFormSchema } from '@/form-schemas/emoji-request/basic-input';
import type { DetailInputAnimatedFormSchema, DetailInputFormSchema, DetailInputIncludingTextFormSchema } from '@/form-schemas/emoji-request/detail-input';
import type { UploadFormSchema } from '@/form-schemas/emoji-request/upload';

import { api } from '@/services/api';
import { tokenAtom } from '@/states/sessions';

export const wizardPages = [{
  label: 'アップロード',
  route: '/emoji-request/new',
}, {
  label: '情報を入力',
  route: '/emoji-request/new/basic',
}, {
  label: '詳細情報を入力',
  route: '/emoji-request/new/detail',
}, {
  label: '確認',
  route: '/emoji-request/new/confirm',
}];

/** 絵文字リクエストのフィルタのAtom */
export const filterAtom = atomWithStorage<'mine' | 'all'>('emojiRequest:filter', 'mine');

/** 現在選択している絵文字リクエストのIDのAtom*/
export const currentRequestIdAtom = atom<string | null>(null);

/** 選択したファイルのAtom */
export const fileAtom = atom<File | null>(null);

/** 選択したファイルのdata URLのAtom */
export const imgDataUrlAtom = atom<string | null>(null);

/** 絵文字名が被っているかどうかの検証状態Atom */
export const emojiNameDuplicationCheckStateAtom = atom<'initial' | 'valid' | 'invalid' | 'loading'>('initial');

/** アップロードフォームのAtom */
export const uploadFormAtom = atom<UploadFormSchema | undefined>(undefined);

/** 基本情報の入力Atom */
export const basicInputFormAtom = atom<BasicInputFormSchema | undefined>(undefined);

/** 詳細情報の入力Atom */
export const detailInputFormAtom = atom<DetailInputFormSchema | undefined>(undefined);

/** テキストを含む場合の情報入力Atom */
export const includingTextInputFormAtom = atom<DetailInputIncludingTextFormSchema | undefined>(undefined);

/** アニメーションする場合の情報入力Atom */
export const animatedInputFormAtom = atom<DetailInputAnimatedFormSchema | undefined>(undefined);

/**
 * 絵文字リクエストの一覧をクエリするAtom
 */
export const emojiRequestsAtom = atomWithInfiniteQuery((get) => ({
  queryKey: ['emojiRequests', get(filterAtom), get(tokenAtom)],
  queryFn: async ({ queryKey, pageParam }) => {
    const filter = queryKey[1] as 'mine' | 'all';
    const token = queryKey[2] as string | null;
    if (!token) return [];
    const emojiRequests = await api(token).getAllEmojiRequests(filter, pageParam as number, 10);
    return emojiRequests;
  },
  getNextPageParam: (lastPage, _, lastPageParam) => lastPage.length >= 10 ? lastPageParam as number + 1 : undefined,
  initialPageParam: 1,
}));

/**
 * 管理者ページにおける未処理の絵文字リクエストの一覧をクエリするAtom
 */
export const adminPendingEmojiRequestsAtom = atomWithSuspenseQuery((get) => ({
  queryKey: ['adminPendingEmojiRequests', get(tokenAtom)],
  queryFn: async ({ queryKey }) => {
    const token = queryKey[1] as string | null;
    if (!token) return [];
    const emojiRequests = await api(token).admin.getAllPendingEmojiRequests();
    return emojiRequests;
  },
}));

/**
 * 管理者ページにおける絵文字リクエストの詳細をクエリするAtom
 */
export const adminCurrentEmojiRequestAtom = atomWithSuspenseQuery((get) => ({
  queryKey: ['adminCurrentEmojiRequest', get(tokenAtom), get(currentRequestIdAtom)],
  queryFn: async ({ queryKey }) => {
    const token = queryKey[1] as string | null;
    const id = queryKey[2] as string | null;
    if (!token || !id) return null;
    const req = await api(token).admin.getEmojiRequest(id);
    return req;
  },
}));


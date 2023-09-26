import { atomWithStorage } from 'jotai/utils';

// なぜか最初だけnullになるので、初期値をlocalStorageから取得する
export const tokenAtom = atomWithStorage<string | null>('token', JSON.parse(localStorage.getItem('token') ?? 'null'));

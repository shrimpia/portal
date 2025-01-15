import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

import type { ThemeType } from '@/types/theme-type';

export const isShowingGlobalSpinnerAtom = atom(false);

export const themeAtom = atomWithStorage<ThemeType>('theme', JSON.parse(localStorage.getItem('theme') ?? '"system"'));

export const optoutNewEmojiRequestFormAtom = atomWithStorage<boolean>('optoutNewEmojiRequestForm', false);

export const currentThemeAtom = atom<'light' | 'dark'>('light');

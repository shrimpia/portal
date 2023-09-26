import { atom } from 'jotai';

import type { ShrimpiaPlus } from '../types/shrimpia-plus';

export const shrimpiaPlusEmulationAtom = atom<ShrimpiaPlus | 'default'>('default');

import { useSetAtom } from 'jotai';

import { isShowingGlobalSpinnerAtom } from '@/states/screen';

export const useWithSpinner = () => {
  const setIsShowingGlobalSpinner = useSetAtom(isShowingGlobalSpinnerAtom);
  return async (callback: () => Promise<void>) => {
    setIsShowingGlobalSpinner(true);
    try {
      await callback();
    } finally {
      setIsShowingGlobalSpinner(false);
    }
  };
};

import { useAtomValue } from 'jotai';

import { Dialog } from '@/components/ui/Dialog';
import { Spinner } from '@/components/ui/Spinner';
import { isShowingGlobalSpinnerAtom } from '@/states/screen';

const noop = () => {};

export const ModalSpinner: React.FC = () => {
  const show = useAtomValue(isShowingGlobalSpinnerAtom);

  return show ? (
    <Dialog open={show} onClose={noop} dismissible={false}>
      <div className="lu-text-center">
        <Spinner />
      </div>
    </Dialog>
  ) : null;
};

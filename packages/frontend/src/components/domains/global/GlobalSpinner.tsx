import { useAtomValue } from 'jotai';
import { Modal, Spinner } from 'react-bootstrap';

import { isShowingGlobalSpinnerAtom } from '../../../states/screen';

export const GlobalSpinner: React.FC = () => {
  const show = useAtomValue(isShowingGlobalSpinnerAtom);

  return show ? (
    <Modal show={show} centered backdrop="static" keyboard={false}>
      <Modal.Body className="text-center">
        <Spinner animation="border" variant="primary" />
      </Modal.Body>
    </Modal>
  ) : null;
};

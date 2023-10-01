import { Spinner, Stack } from 'react-bootstrap';

export const LoadingView: React.FC = () => (
  <Stack className="align-items-center">
    <Spinner variant="primary" />
  </Stack>
);

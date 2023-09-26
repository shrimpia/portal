import { Badge } from 'react-bootstrap';

export type StatusBadgeProps = {
  status: 'pending' | 'approved' | 'rejected';
  className?: string;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const variant = status === 'pending' ? 'warning' : status === 'approved' ? 'success' : 'danger';
  const icon = status === 'pending' ? 'bi-clock' : status === 'approved' ? 'bi-check2' : 'bi-x-lg';

  return (
    <Badge bg={variant} className={`${className} text-dark`}><i className={`bi ${icon}`} /> {status}</Badge>
  );
};

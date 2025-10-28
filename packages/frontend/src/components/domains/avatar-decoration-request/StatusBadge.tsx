import { Badge } from 'react-bootstrap';

export type StatusBadgeProps = {
  status: 'pending' | 'approved' | 'rejected';
  className?: string;
};

const statusMap = {
  approved: {
    variant: 'success',
    icon: 'check2',
    text: '承認',
  },
  rejected: {
    variant: 'danger',
    icon: 'x-lg',
    text: '却下',
  },
  pending: {
    variant: 'warning',
    icon: 'clock',
    text: '審査中',
  },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  const { variant, icon, text } = statusMap[status];

  return (
    <Badge bg={variant} className={className}>
      <i className={`bi bi-${icon}`} /> {text}
    </Badge>
  );
};
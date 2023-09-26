import { Badge } from 'react-bootstrap';

export type StatusBadgeProps = {
  status: 'pending' | 'approved' | 'rejected';
  className?: string;
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className }) => {
  switch (status) {
    case 'approved':
      return (
        <Badge bg="success" className={`${className} text-dark`}>
          <i className="bi bi-check2" /> 承認
        </Badge>
      );
    case 'rejected':
      return (
        <Badge bg="danger" className={`${className} text-`}>
          <i className="bi bi-x-lg" /> 却下
        </Badge>
      );
    case 'pending':
      return (
        <Badge bg="warning" className={`${className} text-dark`}>
          <i className="bi bi-clock" /> 審査中
        </Badge>
      );
    default: 
      return null;
  }
};

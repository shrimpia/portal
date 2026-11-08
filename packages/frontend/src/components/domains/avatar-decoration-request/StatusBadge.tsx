
import { Chip } from '@/components/ui/Chip';
import type { ChipVariant } from '@/components/ui/Chip';

export type StatusBadgeProps = {
  status: 'pending' | 'approved' | 'rejected';
  className?: string;
};

const statusMap: Record<StatusBadgeProps['status'], { variant: ChipVariant; icon: string; text: string }> = {
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
    <Chip variant={variant} className={className}>
      <i className={`bi bi-${icon}`} /> {text}
    </Chip>
  );
};
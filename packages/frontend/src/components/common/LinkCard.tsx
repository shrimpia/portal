import { Link } from 'react-router-dom';

import { Card } from '@/components/ui/Card';
import { Chip } from '@/components/ui/Chip';
import { Stack } from '@/components/ui/Stack';

export type LinkCardProp = {
    title: string;
    to: string;
    icon?: string;
    new?: boolean;
    children?: React.ReactNode;
};

export const LinkCard = (p: LinkCardProp) => {
  return (
    <Card as={Link} to={p.to} link>
      <Stack direction="horizontal" align="center" gap={4}>
        {p.icon && <i className={`${p.icon} sh-app-icon-color`} style={{ fontSize: '2rem', marginInline: 'var(--space-2)' }} />}
        <div>
          <Card.Title>{p.title} {p.new && <Chip style={{ verticalAlign: '0.2rem' }}>NEW</Chip>}</Card.Title>
          {p.children && (
            <Card.Text className="lu-text-dimmed">
              {p.children}
            </Card.Text>
          )}
        </div>
      </Stack>
    </Card>
  );
};

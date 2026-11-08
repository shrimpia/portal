
import { Card } from '@/components/ui/Card';
import { Stack } from '@/components/ui/Stack';

export type LinkCardExternalProp = {
    title: string;
    to: string;
    icon?: string;
    children?: React.ReactNode;
};

export const LinkCardExternal = (p: LinkCardExternalProp) => {
  return (
    <Card as="a" href={p.to} target="_blank" rel="noopener noreferrer" link>
      <Stack direction="horizontal" align="center" gap={4}>
        {p.icon && <i className={`${p.icon} sh-app-icon-color`} style={{ fontSize: '2rem', marginInline: 'var(--space-2)' }} />}
        <div>
          <Card.Title>{p.title}</Card.Title>
          {p.children && (
            <Card.Text className="lu-text-dimmed">
              {p.children}
            </Card.Text>
          )}
        </div>
        <i className="bi bi-box-arrow-up-right lu-ms-auto lu-me-2" />
      </Stack>
    </Card>
  );
};

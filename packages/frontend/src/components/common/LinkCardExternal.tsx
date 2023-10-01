import { Card, Stack } from 'react-bootstrap';

export type LinkCardExternalProp = {
    title: string;
    to: string;
    icon?: string;
    children?: React.ReactNode;
};

export const LinkCardExternal = (p: LinkCardExternalProp) => {
  return (
    <Card as="a" href={p.to} target="_blank" rel="noopener noreferrer" className="border border-0 shadow text-decoration-none sh-card-hover">
      <Stack direction="horizontal" className="align-items-center" gap={3}>
        {p.icon && <i className={`${p.icon} fs-2 ms-4`} style={{ color: 'var(--bs-yellow)' }} />}
        <Card.Body>
          <Card.Title>{p.title}</Card.Title>
          {p.children && (
            <Card.Text className="text-muted">
              {p.children}
            </Card.Text>
          )}
        </Card.Body>
        <i className="bi bi-box-arrow-up-right mx-4" />
      </Stack>
    </Card>
  );
};

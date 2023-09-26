import { Card, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export type LinkCardProp = {
    title: string;
    to: string;
    icon?: string;
    children?: React.ReactNode;
};

export const LinkCard = (p: LinkCardProp) => {
  return (
    <Card as={Link} to={p.to} className="border border-0 shadow text-decoration-none">
      <Stack direction="horizontal" className="align-items-center" gap={3}>
        {p.icon && <i className={`${p.icon} fs-2 ms-4`} style={{ color: 'var(--bs-yellow)' }} />}
        <Card.Body>
          <Card.Title>{p.title}</Card.Title>
          {p.children && (
            <Card.Text className="text-secondary">
              {p.children}
            </Card.Text>
          )}
        </Card.Body>
      </Stack>
    </Card>
  );
};

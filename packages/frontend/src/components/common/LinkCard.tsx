import { Badge, Card, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export type LinkCardProp = {
    title: string;
    to: string;
    icon?: string;
    new?: boolean;
    children?: React.ReactNode;
};

export const LinkCard = (p: LinkCardProp) => {
  return (
    <Card as={Link} to={p.to} className="border border-0 shadow text-decoration-none sh-card-hover">
      <Stack direction="horizontal" className="align-items-center" gap={3}>
        {p.icon && <i className={`${p.icon} fs-2 ms-4 sh-app-icon-color`} />}
        <Card.Body>
          <Card.Title>{p.title} {p.new && <Badge style={{ fontSize: '0.7rem', verticalAlign: '0.3rem' }}>NEW</Badge>}</Card.Title>
          {p.children && (
            <Card.Text className="text-muted">
              {p.children}
            </Card.Text>
          )}
        </Card.Body>
      </Stack>
    </Card>
  );
};

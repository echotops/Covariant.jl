import { Link } from 'react-router-dom';

export default function Ref({ to, children }) {
    return (
        <Link className="ref-link" to={to}>
            <code>{children}</code>
        </Link>
    );
}

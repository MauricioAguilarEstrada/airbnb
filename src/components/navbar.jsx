import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">ReservaApp</Link>
      <div className="navbar-links">
        <Link to="/">Buscar</Link>
        <Link to="/create">Publicar Propiedad</Link>
      </div>
    </nav>
  );
}
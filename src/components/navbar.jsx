import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();
  
  // Leemos si hay un usuario activo
  const user = localStorage.getItem('user');

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    if (value.trim()) {
      navigate(`/?search=${encodeURIComponent(value)}`);
    } else {
      navigate(`/`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('userId'); // Importante: limpiar también el ID para seguridad
    window.location.href = '/login'; // Redirige y limpia el estado visual
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">Earthbnb</Link>
      <div className="navbar-links">
        
        {isSearchOpen ? (
          <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input 
              type="text" 
              placeholder="Ej. Cancún o Cabaña..." 
              value={searchQuery}
              onChange={handleInputChange}
              autoFocus
              style={{ padding: '0.4rem 1rem', borderRadius: '20px', border: '1px solid #ddd', outline: 'none', width: '200px' }}
            />
            <button 
              type="button" 
              onClick={() => { setIsSearchOpen(false); setSearchQuery(''); navigate('/'); }} 
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#717171', fontSize: '1.2rem' }}
            >✕</button>
          </form>
        ) : (
          <button onClick={() => setIsSearchOpen(true)} style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', color: '#717171' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        )}

        {/* Lógica condicional: Solo si 'user' existe mostramos la opción de publicar y el botón de salir */}
        {user ? (
          <>
            <Link to="/create">Publicar Propiedad</Link>
            <Link to="/mis-viajes" style={{ marginRight: '1rem', color: '#333', textDecoration: 'none', fontWeight: '500' }}>
                Mis Viajes
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', gap: '15px', borderLeft: '1px solid #ddd', paddingLeft: '15px' }}>
              <span style={{ fontSize: '0.9rem', color: '#717171', fontWeight: '500' }}>{user}</span>
              <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--primary)', fontWeight: '600', fontSize: '0.9rem' }}>
                Salir
              </button>
            </div>
          </>
        ) : (
          <Link to="/login" style={{ borderLeft: '1px solid #ddd', paddingLeft: '15px', color: 'var(--primary)', fontWeight: '600' }}>
            Iniciar Sesión
          </Link>
        )}
      </div>
    </nav>
  );
}
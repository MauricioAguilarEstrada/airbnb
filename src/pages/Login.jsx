import { useState } from 'react';
import { loginUser } from '../services/api';

export default function Login() {
  const [nombre, setNombre] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Llamada real al backend en Python
      const userData = await loginUser({ nombre, password });
      
      // Guardamos tanto el nombre como el ID correctamente
      localStorage.setItem('user', userData.nombre);
      localStorage.setItem('userId', userData.id); // <-- CORRECCIÓN AQUÍ
      
      window.location.href = '/'; 
    } catch (err) {
      setError('Credenciales incorrectas. Intenta nuevamente.');
    }
  };

  return (
    <div className="container" style={{ maxWidth: '400px', marginTop: '4rem' }}>
      <div className="card-panel">
        <h2 style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--text-main)' }}>Iniciar Sesión</h2>
        
        {error && <p style={{ color: '#e53e3e', marginBottom: '1rem', fontSize: '0.9rem', textAlign: 'center' }}>{error}</p>}
        
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Nombre de usuario</label>
            <input 
              type="text" 
              required 
              placeholder="Ej. Sofia Ruiz"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>
          
          <div className="form-group">
            <label>Contraseña</label>
            <input 
              type="password" 
              required 
              placeholder="••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          
          <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}
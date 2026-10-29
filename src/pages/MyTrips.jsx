import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserReservations, cancelReservation } from '../services/api';

export default function MyTrips() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) {
      navigate('/login');
      return;
    }

    getUserReservations(userId)
      .then(data => {
        setReservations(Array.isArray(data) ? data : []);
        setLoading(false);
      })
      .catch(error => {
        console.error(error);
        setLoading(false);
      });
  }, [navigate]);

  const handleCancel = async (reservaId) => {
    if (window.confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
      try {
        await cancelReservation(reservaId);
        // Actualizamos el estado localmente para reflejar el cambio inmediato
        setReservations(prev => prev.map(res => 
          res.id === reservaId ? { ...res, estado: 'cancelada' } : res
        ));
      } catch (error) {
        alert("Hubo un error al cancelar la reserva.");
      }
    }
  };

  if (loading) return <div className="container">Cargando tus viajes...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 className="page-title">Mis Viajes</h1>
      
      {reservations.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {reservations.map(res => (
            <div key={res.id} className="card-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: res.estado === 'cancelada' ? 0.7 : 1 }}>
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', textDecoration: res.estado === 'cancelada' ? 'line-through' : 'none' }}>
                  {res.propiedad_nombre}
                </h3>
                <p style={{ margin: 0, color: '#555' }}>
                  <strong>Llegada:</strong> {res.fecha_ingreso} | <strong>Salida:</strong> {res.fecha_salida}
                </p>
                <p style={{ margin: '0.5rem 0 0 0' }}>
                  Estado: <span style={{ color: res.estado === 'cancelada' ? '#e53e3e' : '#28a745', fontWeight: 'bold' }}>
                    {res.estado.toUpperCase()}
                  </span>
                </p>
              </div>
              <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: 0, color: res.estado === 'cancelada' ? '#717171' : 'var(--primary-color)' }}>
                  ${res.precio_total} MXN
                </p>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  <Link to={`/property/${res.propiedad_id}`} className="btn btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}>
                    Ver Propiedad
                  </Link>
                  {res.estado !== 'cancelada' && (
                    <button onClick={() => handleCancel(res.id)} className="btn btn-danger" style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem', width: 'auto' }}>
                      Cancelar
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="card-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ fontSize: '1.1rem', color: '#717171' }}>Aún no tienes viajes programados.</p>
          <Link to="/" className="btn btn-primary" style={{ display: 'inline-block', marginTop: '1rem', width: 'auto' }}>
            Explorar propiedades
          </Link>
        </div>
      )}
    </div>
  );
}
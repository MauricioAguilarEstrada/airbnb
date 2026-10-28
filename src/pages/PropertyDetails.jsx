import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProperties, updatePropertyRating, deleteProperty } from '../services/api';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [newRating, setNewRating] = useState(5);

  useEffect(() => {
    getProperties().then(data => {
      const found = data.find(p => p.id === Number(id));
      setProperty(found);
    });
  }, [id]);

  const handleAddReview = async () => {
    const currentTotal = property.rating * property.reviews;
    const newAverage = (currentTotal + newRating) / (property.reviews + 1);
    await updatePropertyRating(id, parseFloat(newAverage.toFixed(1)));
    setProperty(prev => ({
      ...prev, rating: parseFloat(newAverage.toFixed(1)), reviews: prev.reviews + 1
    }));
  };
  
  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta propiedad?')) {
      await deleteProperty(id);
      navigate('/');
    }
  };

  if (!property) return <div className="container">Cargando propiedad...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <button onClick={() => navigate('/')} className="btn btn-outline">← Volver al inicio</button>

      <h1 className="page-title">{property.title}</h1>
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>📍 {property.location} | <span style={{ fontWeight: '600' }}>💰 ${property.price} / noche</span></p>
      
      <div className="card-panel">
        <h3>Calificación actual</h3>
        <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>
          ⭐ {property.rating} <span style={{ fontSize: '1rem', color: '#717171' }}>({property.reviews} reseñas)</span>
        </p>

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #dddddd', paddingTop: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Dejar una reseña</h4>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))} style={{ width: 'auto' }}>
              {[1, 2, 3, 4, 5].map(num => (
                <option key={num} value={num}>{num} Estrellas</option>
              ))}
            </select>
            <button onClick={handleAddReview} className="btn btn-primary" style={{ width: 'auto' }}>
              Enviar calificación
            </button>
          </div>
        </div>
      </div>

      <div className="danger-zone">
        <h3>Zona de Peligro</h3>
        <p style={{ marginBottom: '1rem' }}>Al eliminar esta propiedad, se borrará de la base de datos permanentemente.</p>
        <button onClick={handleDelete} className="btn btn-danger" style={{ width: 'auto' }}>
          Eliminar Propiedad
        </button>
      </div>
    </div>
  );
}
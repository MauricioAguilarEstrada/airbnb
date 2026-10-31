import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
// Asegúrate de incluir createReservation en la importación
import { getPropertyById, updatePropertyRating, deleteProperty, createReservation } from '../services/api';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  
  // Estados del formulario de reseña
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");

  // Estados del formulario de reserva
  const [fechaIngreso, setFechaIngreso] = useState("");
  const [fechaSalida, setFechaSalida] = useState("");
  const [huespedes, setHuespedes] = useState(1);
  
  // Verificamos si hay alguien logueado y obtenemos su ID
  const currentUser = localStorage.getItem('user');
  const currentUserId = localStorage.getItem('userId');

  useEffect(() => {
    getPropertyById(id)
      .then(data => setProperty(data))
      .catch(error => {
        console.error(error);
        navigate('/');
      });
  }, [id, navigate]);

  // FUNCIÓN PARA RESERVAR
  const handleReservation = async (e) => {
    e.preventDefault();
    
    if (!currentUser || !currentUserId) {
      alert("Debes iniciar sesión para poder reservar.");
      navigate('/login');
      return;
    }

    const f1 = new Date(fechaIngreso);
    const f2 = new Date(fechaSalida);
    const diffTime = f2 - f1;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      alert("La fecha de salida debe ser posterior a la fecha de llegada.");
      return;
    }

    // Calculamos el precio total (Noches * Precio por noche)
    const precioTotal = diffDays * property.price;

    const reservationData = {
      propiedad_id: id,
      usuario_id: currentUserId,
      fecha_ingreso: fechaIngreso,
      fecha_salida: fechaSalida,
      huespedes: Number(huespedes),
      precio_total: precioTotal
    };

    try {
      await createReservation(reservationData);
      alert(`¡Reserva confirmada con éxito por ${diffDays} noches!\nTotal a pagar: $${precioTotal} MXN`);
      navigate('/');
    } catch (error) {
      console.error(error);
      alert("Hubo un error al procesar tu reserva.");
    }
  };

  const handleAddReview = async () => {
    if (!newComment.trim()) {
      alert("Por favor, escribe un comentario.");
      return;
    }

    const currentReviews = property.reviews || 0; 
    const currentTotal = property.rating * currentReviews;
    const newAverage = (currentTotal + newRating) / (currentReviews + 1);
    const finalAverage = parseFloat(newAverage.toFixed(1));
    
    const reviewPayload = {
      rating: finalAverage,
      estrellas: newRating,
      comentario: newComment,
      usuario: currentUser
    };

    try {
      await updatePropertyRating(id, reviewPayload);
      
      setProperty(prev => ({
        ...prev, 
        rating: finalAverage, 
        reviews: currentReviews + 1,
        comments: [...(prev.comments || []), { usuario: currentUser, estrellas: newRating, comentario: newComment }]
      }));
      
      setNewComment(""); 
      setNewRating(5);
    } catch (error) {
      alert("Hubo un error al enviar la reseña.");
    }
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
      <p style={{ fontSize: '1.1rem', marginBottom: '2rem' }}>
        📍 {property.location} | <span style={{ fontWeight: '600' }}>💰 ${property.price} / noche</span>
      </p>

      {/* BLOQUE NUEVO: FORMULARIO DE RESERVA */}
      <div style={{ padding: '1.5rem', backgroundColor: '#f0f4f8', border: '2px solid #007bff', borderRadius: '12px', marginBottom: '2.5rem' }}>
        <h3 style={{ marginTop: 0, color: '#0056b3' }}>📅 Reservar esta propiedad</h3>
        <form onSubmit={handleReservation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold' }}>Llegada:</label>
              <input type="date" required value={fechaIngreso} onChange={(e) => setFechaIngreso(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ fontWeight: 'bold' }}>Salida:</label>
              <input type="date" required value={fechaSalida} onChange={(e) => setFechaSalida(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }} />
            </div>
          </div>

          <div>
            <label style={{ fontWeight: 'bold' }}>Huéspedes:</label>
            <input type="number" min="1" required value={huespedes} onChange={(e) => setHuespedes(e.target.value)} style={{ width: '100%', padding: '0.6rem', borderRadius: '6px', border: '1px solid #ccc' }} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem', fontSize: '1.1rem', padding: '0.8rem' }}>
            Confirmar Reserva
          </button>
        </form>
      </div>
      
      {/* RESTO DE LA PÁGINA */}
      <div className="card-panel">
        <h3>Calificación actual</h3>
        <p style={{ fontSize: '1.5rem', margin: '1rem 0' }}>
          ⭐ {property.rating} <span style={{ fontSize: '1rem', color: '#717171' }}>({property.reviews || 0} reseñas)</span>
        </p>

        <div style={{ marginTop: '1.5rem', borderTop: '1px solid #dddddd', paddingTop: '1.5rem' }}>
          <h4 style={{ marginBottom: '1rem' }}>Dejar una reseña</h4>
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <textarea 
                placeholder="Escribe tu comentario sobre este lugar..." value={newComment} onChange={(e) => setNewComment(e.target.value)}
                style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'inherit' }}
              />
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <select value={newRating} onChange={(e) => setNewRating(Number(e.target.value))} style={{ padding: '0.5rem', borderRadius: '4px' }}>
                  {[1, 2, 3, 4, 5].map(num => (
                    <option key={num} value={num}>{num} Estrellas</option>
                  ))}
                </select>
                <button onClick={handleAddReview} className="btn btn-primary" style={{ width: 'auto' }}>Publicar reseña</button>
              </div>
            </div>
          ) : (
            <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px', border: '1px solid #eee' }}>
              Debes iniciar sesión para compartir tu experiencia.
            </div>
          )}
        </div>

        {(property.comments && property.comments.length > 0) && (
          <div style={{ marginTop: '2.5rem' }}>
            <h4>Comentarios de otros huéspedes</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
              {property.comments.map((c, index) => (
                <div key={index} style={{ padding: '1rem', border: '1px solid #eee', borderRadius: '8px', backgroundColor: '#fafafa' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <strong style={{ color: '#333' }}>{c.usuario}</strong>
                    <span style={{ color: '#f5b041' }}>{'⭐'.repeat(c.estrellas)}</span>
                  </div>
                  <p style={{ margin: 0, color: '#555', lineHeight: '1.4' }}>{c.comentario}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {currentUserId === property.anfitrion_id && (
        <div className="danger-zone" style={{ marginTop: '2rem' }}>
          <h3>Zona de Peligro</h3>
          <p style={{ marginBottom: '1rem' }}>Al eliminar esta propiedad, se borrará de la base de datos permanentemente.</p>
          <button onClick={handleDelete} className="btn btn-danger" style={{ width: 'auto' }}>Eliminar Propiedad</button>
        </div>
      )}
    </div>
  );
}
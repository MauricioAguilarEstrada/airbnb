import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../services/api';

export default function CreateProperty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', 
    description: '', 
    price: '', 
    location: '', 
    photoUrl: '', 
    amenities: []
  });

  // Estado independiente para manejar la lista de habitaciones (inicia con 1)
  const [habitaciones, setHabitaciones] = useState([
    { tipo: 'Sencilla', capacidad: 2 }
  ]);

  useEffect(() => {
    const userId = localStorage.getItem('userId');
    if (!userId) navigate('/login');
  }, [navigate]);

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, value] }));
    } else {
      setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== value) }));
    }
  };

  // Funciones para manejar la lista dinámica de habitaciones
  const agregarHabitacion = () => {
    setHabitaciones([...habitaciones, { tipo: 'Sencilla', capacidad: 2 }]);
  };

  const eliminarHabitacion = (index) => {
    setHabitaciones(habitaciones.filter((_, i) => i !== index));
  };

  const actualizarHabitacion = (index, campo, valor) => {
    const nuevasHabitaciones = [...habitaciones];
    // Convertir a número si el campo es capacidad
    nuevasHabitaciones[index][campo] = campo === 'capacidad' ? Number(valor) : valor;
    setHabitaciones(nuevasHabitaciones);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    if (!userId) return navigate('/login');

    if (habitaciones.length === 0) {
      alert("Debes agregar al menos una habitación.");
      return;
    }

    try {
      await createProperty({ 
        ...formData, 
        price: Number(formData.price),
        habitaciones: habitaciones, // Enviamos el arreglo de objetos directamente
        anfitrion_id: userId 
      });
      navigate('/');
    } catch (error) {
      console.error("Error al publicar:", error);
      alert("Hubo un problema al crear la propiedad. Intenta nuevamente.");
    }
  };

  return (
    <div className="container" style={{ maxWidth: '700px' }}>
      <h1 className="page-title">Publicar Nueva Propiedad</h1>
      
      <form onSubmit={handleSubmit} className="card-panel">
        <div className="form-group">
          <label>Título de la propiedad:</label>
          <input type="text" required value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Descripción:</label>
          <textarea 
            placeholder="Describe qué hace especial a este lugar..." required 
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})}
            style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '80px', fontFamily: 'inherit' }}
          />
        </div>

        <div className="form-group">
          <label>Ubicación:</label>
          <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Precio por noche (MXN):</label>
          <input type="number" required min="1" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
        </div>

        {/* SECTOR DINÁMICO DE HABITACIONES */}
        <div className="form-group" style={{ backgroundColor: '#f8f9fa', padding: '1rem', borderRadius: '8px', border: '1px solid #eee' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <label style={{ margin: 0, fontWeight: 'bold' }}>Habitaciones:</label>
            <button type="button" onClick={agregarHabitacion} className="btn btn-outline" style={{ padding: '0.3rem 0.8rem', fontSize: '0.9rem' }}>
              + Añadir Habitación
            </button>
          </div>
          
          {habitaciones.map((hab, index) => (
            <div key={index} style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <div style={{ flex: 1 }}>
                <select 
                  value={hab.tipo} 
                  onChange={(e) => actualizarHabitacion(index, 'tipo', e.target.value)}
                  style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
                >
                  <option value="Sencilla">Sencilla</option>
                  <option value="Doble">Doble</option>
                  <option value="Suite">Suite</option>
                  <option value="Familiar">Familiar</option>
                </select>
              </div>
              <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>Capacidad:</span>
                <input 
                  type="number" min="1" required value={hab.capacidad} 
                  onChange={(e) => actualizarHabitacion(index, 'capacidad', e.target.value)}
                  style={{ width: '80px', padding: '0.5rem' }}
                />
              </div>
              {habitaciones.length > 1 && (
                <button type="button" onClick={() => eliminarHabitacion(index)} style={{ color: '#e53e3e', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}>
                  X
                </button>
              )}
            </div>
          ))}
        </div>

        <div className="form-group">
          <label>URL de la Foto principal:</label>
          <input type="url" placeholder="https://images.unsplash.com/photo-..." value={formData.photoUrl} onChange={(e) => setFormData({...formData, photoUrl: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Amenidades:</label>
          <div className="amenities-list">
            <label className="amenity-checkbox"><input type="checkbox" value="WiFi" onChange={handleAmenityChange} /> WiFi</label>
            <label className="amenity-checkbox"><input type="checkbox" value="Piscina" onChange={handleAmenityChange} /> Piscina</label>
            <label className="amenity-checkbox"><input type="checkbox" value="Estacionamiento" onChange={handleAmenityChange} /> Estacionamiento</label>
          </div>
        </div>

        <button type="submit" className="btn btn-primary" style={{ marginTop: '1rem' }}>Registrar Propiedad</button>
      </form>
    </div>
  );
}
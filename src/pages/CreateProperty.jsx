import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createProperty } from '../services/api';

export default function CreateProperty() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '', price: '', location: '', photoUrl: '', amenities: []
  });

  const handleAmenityChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFormData(prev => ({ ...prev, amenities: [...prev.amenities, value] }));
    } else {
      setFormData(prev => ({ ...prev, amenities: prev.amenities.filter(a => a !== value) }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createProperty({ ...formData, price: Number(formData.price) });
    navigate('/');
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
          <label>Ubicación:</label>
          <input type="text" required value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
        </div>

        <div className="form-group">
          <label>Precio por noche (MXN):</label>
          <input type="number" required min="1" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} />
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
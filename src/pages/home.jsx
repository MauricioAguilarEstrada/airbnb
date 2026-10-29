import { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { getProperties } from '../services/api';

export default function Home() {
  const [properties, setProperties] = useState([]);
  const [maxPrice, setMaxPrice] = useState(5000);
  const [amenity, setAmenity] = useState('');
  
  const [searchParams] = useSearchParams();
  const query = (searchParams.get('search') || '').toLowerCase();

  useEffect(() => {
    getProperties()
      .then(data => {
        if (Array.isArray(data)) {
          setProperties(data);
        } else {
          console.error("El backend devolvió un error o formato incorrecto:", data);
        }
      })
      .catch(error => {
        console.error("Error al intentar obtener las propiedades:", error);
      });
  }, []);

  const filteredProperties = properties.filter(p => {
    const safeTitle = p.title || "";
    const safeLocation = p.location || "";
    const safeAmenities = Array.isArray(p.amenities) ? p.amenities : [];

    const matchPrice = (p.price || 0) <= maxPrice;
    const matchAmenity = amenity === '' ? true : safeAmenities.includes(amenity);
    
    const matchQuery = query === '' 
      ? true 
      : safeTitle.toLowerCase().includes(query) || safeLocation.toLowerCase().includes(query);
    
    return matchPrice && matchAmenity && matchQuery;
  });

  return (
    <div className="container">
      
      <div className="filter-bar">
        <div className="filter-group">
          <label>Precio máx. (${maxPrice})</label>
          <input 
            type="range" min="500" max="5000" step="100"
            value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} 
          />
        </div>
        <div className="filter-group">
          <label>Amenidades</label>
          <select value={amenity} onChange={(e) => setAmenity(e.target.value)}>
            <option value="">Todas las opciones</option>
            <option value="WiFi">WiFi</option>
            <option value="Piscina">Piscina</option>
            <option value="Estacionamiento">Estacionamiento</option>
          </select>
        </div>
      </div>

      <div className="property-grid">
        {filteredProperties.length > 0 ? (
          filteredProperties.map(p => (
            <Link to={`/property/${p.id}`} key={p.id} className="property-card">
              <div className="card-img-wrapper">
                <img 
                  src={p.photoUrl || "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=800&q=80"} 
                  alt={p.title || "Propiedad"} 
                />
              </div>
              <div className="card-info">
                <div className="card-header">
                  <span className="card-location">{p.location || "Sin ubicación"}</span>
                  <span className="card-rating">★ {p.rating || 0}</span>
                </div>
                <span className="card-title">{p.title || "Propiedad"}</span>
                <span className="card-price"><span>${p.price || 0} MXN</span> noche</span>
              </div>
            </Link>
          ))
        ) : (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1', color: '#717171' }}>
            No encontramos propiedades para mostrar.
          </p>
        )}
      </div>
    </div>
  );
}
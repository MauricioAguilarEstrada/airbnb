const API_URL = 'https://reserva-backend-7acc.onrender.com/api/propiedades';

export const getProperties = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) throw new Error('Error al obtener las propiedades');
  return await response.json();
};

export const createProperty = async (propertyData) => {
  const response = await fetch('${API_URL}/api/propiedades', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(propertyData),
  });
  if (!response.ok) throw new Error('Error al crear la propiedad');
  return await response.json();
};

export const updatePropertyRating = async (id, reviewPayload) => {
  const response = await fetch(`${API_URL}/api/propiedades/${id}/calificar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reviewPayload), // Mandamos todo el paquete
  });
  
  if (!response.ok) throw new Error('Error al actualizar la calificación');
  return await response.json();
};

export const deleteProperty = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: 'DELETE',
  });
  return await response.json();
};

export const loginUser = async (credentials) => {
  const response = await fetch('${API_URL}/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });
  if (!response.ok) throw new Error('Credenciales inválidas');
  return await response.json();
};

export const getPropertyById = async (id) => {
  const response = await fetch(`${API_URL}api/propiedades/${id}`);
  if (!response.ok) throw new Error('Error al cargar la propiedad');
  return await response.json();
};

// Crear una nueva reserva
export const createReservation = async (reservationData) => {
  const response = await fetch('${API_URL}/api/reservas', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reservationData),
  });
  
  if (!response.ok) throw new Error('Error al confirmar la reserva');
  return await response.json();
};

// Obtener el historial de reservas de un usuario
export const getUserReservations = async (userId) => {
  const response = await fetch(`${API_URL}/api/reservas/usuario/${userId}`);
  
  if (!response.ok) throw new Error('Error al obtener el historial');
  return await response.json();
};

// Cancelar una reserva
export const cancelReservation = async (reservaId) => {
  const response = await fetch(`${API_URL}/api/reservas/${reservaId}/cancelar`, {
    method: 'PUT',
  });
  
  if (!response.ok) throw new Error('Error al cancelar la reserva');
  return await response.json();
};
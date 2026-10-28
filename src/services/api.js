let mockProperties = [
  { id: 1, title: "Villa con Vista al Mar", price: 1200, location: "Cancún", rating: 4.8, reviews: 12, amenities: ["WiFi", "Piscina"], photoUrl: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=800&q=80" },
  { id: 2, title: "Cabaña en el Bosque", price: 800, location: "Tuxtla Gutiérrez", rating: 4.5, reviews: 5, amenities: ["Estacionamiento"], photoUrl: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=800&q=80" },
  { id: 3, title: "Loft céntrico", price: 1500, location: "Ciudad de México", rating: 4.9, reviews: 24, amenities: ["WiFi"], photoUrl: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80" }
];

export const getProperties = async () => [...mockProperties];
export const createProperty = async (property) => {
  const newProperty = { ...property, id: Date.now(), rating: 0, reviews: 0 };
  mockProperties.push(newProperty);
  return newProperty;
};
export const updatePropertyRating = async (id, newRating) => {
  const index = mockProperties.findIndex(p => p.id === Number(id));
  if (index !== -1) {
    mockProperties[index].rating = newRating;
    mockProperties[index].reviews += 1;
    return mockProperties[index];
  }
};
export const deleteProperty = async (id) => {
  mockProperties = mockProperties.filter(p => p.id !== Number(id));
  return true;
};
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import CreateProperty from './pages/CreateProperty';
import PropertyDetails from './pages/PropertyDetails';
import Login from './pages/Login'; // <-- 1. Importa el componente
import MyTrips from './pages/MyTrips'; 

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateProperty />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/login" element={<Login />} /> {/* <-- 2. Añade la ruta */}
        <Route path="/mis-viajes" element={<MyTrips />} />
      </Routes>
    </BrowserRouter>
  );
}
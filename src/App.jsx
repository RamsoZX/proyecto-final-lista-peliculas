import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ItemDetail from './pages/ItemDetail';
import ItemForm from './pages/ItemForm';

function App() {
  return (
    <>
      <Navbar />
      
      {/* Aseguramos que el contenido ocupe al menos el alto de la pantalla */}
      <main className="min-vh-100">
        <Routes>
          {/* Ruteo Estático: Página Principal */}
          <Route path="/" element={<Home />} />
          
          {/* Ruteo Estático: Formulario de Creación (luego lo adaptaremos a Edición) */}
          <Route path="/crear" element={<ItemForm />} />
          
          {/* Ruteo Dinámico: Detalle de un ítem. El :id es el parámetro dinámico. */}
          <Route path="/pelicula/:id" element={<ItemDetail />} />

          {/* Opcional pero recomendado: Manejo de ruta no encontrada (404) */}
          <Route path="*" element={<div className="container mt-5"><h1>404 - Página no encontrada</h1></div>} />
        </Routes>
      </main>

      <Footer />
    </>
  )
}

export default App;
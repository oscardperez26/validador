// src/pages/Home.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';

/**
 * Home:
 * Pantalla inicial que muestra las dos opciones:
 *  1. Ir a "Base" (actualizar base de datos)
 *  2. Ir a "Consultar precio" (escáner + detalle)
 */
const Home: React.FC = () => {
  return (
    <div className="responsive-container">
      {/* Reutilizamos el mismo Header en todas las páginas */}
      <Header />
        <div className='home-page'>
        <h2>Seleccione una opción</h2>
        {/* El contenedor ahora será Flexbox para organizar los botones */}
        <div className='home-button-container'>
            <Link to="/consulta">
                <button className="nav-button">Consultar precio</button>
            </Link>
            <Link to="/base">
                <button className="nav-button">Base</button>
            </Link>

        </div>
        </div>
    </div>
  );
};

export default Home;

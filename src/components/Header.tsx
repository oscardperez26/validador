/**
 * Componente Header
 * Muestra el título principal de la aplicación.
 */
import React from 'react';
import logokoajs from '../assets/logo-koaj.png';

const Header: React.FC = () => {
  return (
    <header className="app-header">
      <div className="logo-header">
        <img src={logokoajs} alt="Logo KOAJ" />

      </div>
      {/* Título principal */}
      <h1>Validador de Precios</h1>
    </header>
  );
};

export default Header;

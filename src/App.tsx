

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import ConsultaPage from './pages/ConsultaPage';
import BasePage  from './pages/BasePage';


const App: React.FC = () => {
  console.log('base');
  
  return (

      <Routes>
        {/* Ruta principal: menú con opciones */}
        <Route path="/" element={<Home />} />

        {/* Ruta para consultar precio (tu lógica actual) */}
        <Route path="/consulta" element={<ConsultaPage />} />

        {/* Ruta para la sección "Base" (login + upload Excel) */}
        <Route path="/base" element={<BasePage />} />
      </Routes>
  );
};



export default App;


/**
 * ============================================================
 *  PROYECTO: Validador de Precios - KOAJ / Permoda
 *  VERSIÓN BASE: v1_frontend_base
 *  AUTOR: Oscar Daniel Pérez Vargas
 *  FECHA: 2025-09-15
 *
 *  DESCRIPCIÓN GENERAL:
 *  ------------------------------------------------------------
 *  Esta aplicación tiene como objetivo validar precios
 *  leyendo códigos de barras desde una PDA empresarial.
 *  Muestra la información del producto (referencia, color,
 *  talla, etc.) y el precio correspondiente.
 *
 *  ALCANCE Y ESTRUCTURA:
 *  ------------------------------------------------------------
 *  - Esta aplicación se desarrolla en una **sola vista**.
 *  - No se utilizan rutas, navegación ni múltiples páginas.
 *  - Todo se maneja dentro del mismo layout principal.
 *  - Los componentes (como encabezado, lector y resultado)
 *    se renderizan en esta misma pantalla y se actualizan
 *    dinámicamente mediante estados.
 *
 *  TECNOLOGÍAS BASE:
 *  ------------------------------------------------------------
 *  - React + TypeScript
 *  - CSS propio (modo oscuro moderno)
 *  - Arquitectura modular de componentes
 *
 *  
 * ============================================================
 */

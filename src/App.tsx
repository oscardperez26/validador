/**
 * App principal
 * Combina los componentes y maneja la búsqueda de productos.
 * 
 * Flujo:
 * - El usuario ingresa un código (ScannerInput)
 * - App busca el producto en products.json
 * - Si lo encuentra, se muestra en ProductCard
 */

import React, { useState } from 'react';
import Header from './components/Header';
import ScannerInput from './components/ScannerInput';
import ProductCard from './components/ProductCard';
import { getProductBycod } from './services/api';


const App: React.FC = () => {
  // Estado para almacenar el producto encontrado
  const [product, setProduct] = useState<any>(null);

  /**
   * handleSearch:
   * Busca el código dentro del JSON local
   */
const handleSearch = async (code: string) => {
  try {
    const data = await getProductBycod(code); // consulta el backend
    setProduct(data); // actualiza el estado
  } catch (error) {
    console.error('Error buscando producto:', error);
    setProduct(null);
  }
};


  return (
    // Contenedor principal centrado
    <div style={{ width: '100%', maxWidth: '500px' }}>
      <Header />
      <ScannerInput onSearch={handleSearch} />
      <ProductCard product={product} />
    </div>
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

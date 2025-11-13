
import React, { useState } from 'react';
//import ReactDOM from 'react-dom/client';
import Header from '../components/Header';
import ScannerInput from '../components/ScannerInput';
import ProductCard from '../components/ProductCard';
import { getProductBycod } from '../services/api';
/**
 * ConsultaPage:
 * Esta página contiene la lógica de:
 *  - Escanear / escribir código de barras
 *  - Consultar el backend
 *  - Mostrar los datos del producto
 */
const ConsultaPage: React.FC = () => {
  // Estado para almacenar el producto encontrado
  const [product, setProduct] = useState<any>(null);
    console.log('consulta');
    
  /**
   * handleSearch:
   * Recibe el código, llama al backend y actualiza el estado.
   */
    const handleSearch = async (code: string) => {
  try {
    const data = await getProductBycod(code); // consulta el backend
    console.log("Producto recibido:", data);
    setProduct(data); // actualiza el estado
  } catch (error) {
    console.error('Error buscando producto:', error);
    setProduct(null);
  }
};


  return (
    // Contenedor principal centrado
    <div  className='responsive-container'>
      <Header />
      <ScannerInput onSearch={handleSearch} />
      <ProductCard product={product} />
      <p className='card-footer' style={{ marginTop: '40px' }}>
        <a href="/" className='display-incio'> volver a inicio</a>
      </p>
    </div>
  );
};
export default ConsultaPage;
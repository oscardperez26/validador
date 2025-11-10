/**
 * Componente ProductCard
 * Muestra los detalles del producto encontrado.
 * 
 * Props:
 * - product: objeto con la información del producto o null si no se encuentra.
 */

import React from 'react';

interface Product {
  codbarras: string;
  referencia: string;
  color: string;
  talla: string;
  nuevo_precio: number;
  imagenes_productos: string;
}

interface Props {
  product: Product | null;
}

const ProductCard: React.FC<Props> = ({ product }) => {
  // Si no hay producto, mostramos un mensaje de aviso
  if (!product) {
    return (
      <p style={{ marginTop: '20px', textAlign: 'center', color: '#888' }}>
        Ingrese un código válido o escanee un producto.
      </p>
    );
  }

  // Si el producto existe, mostramos su información
  return (
   <div className="card">
    <div className="card-content">
      <img src={product.imagenes_productos} alt={product.referencia} className="product-image" />

      <div className="card-info">
        <div className="info-row">
          <span className="title-card">referencia</span>
          <span className="description-card">{product.referencia}</span>
        </div>
        <div className="info-row">
          <span className="title-card">Código</span>
          <span className="description-card">{product.codbarras}</span>
        </div>
        <div className="info-row">
          <span className="title-card">Color</span>
          <span className="description-card">{product.color}</span>
        </div>
        <div className="info-row">
          <span className="title-card">Talla</span>
          <span className="description-card">{product.talla}</span>
        </div>
      </div>
    </div>

    <div className="card-footer">
      <span className="price-label">precio de venta  :</span>
      <span className="price-value">${product.nuevo_precio.toLocaleString()}</span>
    </div>
  </div>);
};

export default ProductCard;

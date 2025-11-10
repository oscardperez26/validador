/**
 * api.ts
 * Servicio para consumir la API del backend.
 */

const BASE_URL = 'http://localhost:5000/api';

export const getProductBycod = async (ean: string) => {
  try {
    const response = await fetch(`${BASE_URL}/products/${ean}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error consultando producto:', error);
    return null;
  }
};

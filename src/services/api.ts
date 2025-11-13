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
/**
 * uploadBaseFile
 *
 * Envía un archivo Excel/CSV al backend para actualizar la base de datos.
 *
 * Parámetros:
 *  - file: archivo seleccionado en el input (File)
 *  - user: usuario con el que se logueó en BasePage (ej: "admin")
 *  - pass: clave (ej: "admin123")
 *
 * Lo que hace:
 *  - Construye un FormData con el archivo.
 *  - Agrega un encabezado Authorization con Basic Auth.
 *  - Llama a: POST /api/upload-xlsx en el backend.
 *  - Espera que el backend responda algo como: { ok: true, total: 123 }
 */

export const uploadBaseFile = async (
  file: File,
  user: string,
  pass: string
): Promise<{ ok: boolean; total: number }> => {
  const formData = new FormData();
  formData.append('file', file); // "file" es el nombre del campo que leerá multer en el backend

  // Basic Auth: "Basic base64(user:pass)"
  const authHeader = 'Basic ' + btoa(`${user}:${pass}`);

  const res = await fetch(`${BASE_URL}/upload-xlsx`, {
    method: 'POST',
    headers: {
      Authorization: authHeader,
      // Importante: NO poner 'Content-Type' cuando usamos FormData.
      // El navegador se encarga de poner el boundary correcto.
    },
    body: formData,
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(txt || 'Error al subir archivo');
  }

  // Ejemplo de respuesta esperada: { ok: true, total: 50 }
  return res.json();
};

/**
 * src/server.ts
 * Servidor Express que expone endpoint para productos
 */

import express from "express";
import cors from "cors";
import dotenv from 'dotenv';
import productsRouter from "./routes/products";

import uploadRouter from './routes/upload';




/* ------------------------------------------------*/
dotenv.config();
const app = express();

// Middleware para permitir peticiones desde el frontend (Vite)

/*app.use(cors({
  origin: ['http://localhost:5173'], // frontend
  credentials: false
}));*/
app.use(cors()); // Permitir todas las conexiones (ajustar en producción)


// Para poder leer JSON en otros endpoints (por si necesitas)
app.use(express.json());

/**
 * Aquí conectamos la URL base `/api/products`
 * con el router definido en `routes/products.ts`.
 *
 * Esto significa que:
 *  - GET /api/products/:ean
 *    será manejado por router.get("/:ean", ...) en products.ts
 */


// Rutas
app.use('/api/products', productsRouter);
app.use('/api/upload-xlsx', uploadRouter);
// Levantar servidor
const PORT = 5000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

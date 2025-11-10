/**
 * src/server.ts
 * Servidor Express que expone endpoint para productos
 */

import express from "express";
import cors from "cors";
import productsRouter from "./routes/products";

const app = express();

// Middlewares
app.use(cors({ origin: '*' })); // permite todas las conexiones       // Permite que el frontend acceda a la API
app.use(express.json()); // Parseo de JSON automáticamente

// Rutas
app.use("/api/products", productsRouter);

// Levantar servidor
const PORT = 5000;
app.listen(PORT,'0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

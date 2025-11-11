/**
 * src/db.ts
 * Configuración de conexión a PostgreSQL usando pg Pool
 */

import { Pool } from "pg";

// Configuración de la base de datos
export const pool = new Pool({
  user: "postgres",         // Usuario PostgreSQL
  host: "localhost",           // Servidor (IP o localhost)
  database: "permoda",         // Base de datos
  password: "admin1234",   // Contraseña
  port: 5432,                  // Puerto por defecto PostgreSQL
});

// Test de conexión
pool.connect((err, client, release) => {
  if (err) {
    console.error("Error conectando a PostgreSQL:", err);
  } else {
    console.log("Conectado a PostgreSQL");
    release();
  }
});

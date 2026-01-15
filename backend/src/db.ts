import { Pool } from "pg";

// Si NO hay DATABASE_URL, no intentamos conectar (ideal para Render si no usas DB)
const DATABASE_URL = process.env.DATABASE_URL;

export const pool = DATABASE_URL
  ? new Pool({
      connectionString: DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // útil si tu DB es externa/Render
    })
  : null;

// Test de conexión SOLO si hay DB configurada
if (pool) {
  pool.connect((err, client, release) => {
    if (err) {
      console.error("Error conectando a PostgreSQL:", err);
    } else {
      console.log("Conectado a PostgreSQL");
      release();
    }
  });
} else {
  console.log("PostgreSQL desactivado (sin DATABASE_URL)");
}

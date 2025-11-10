/**
 * src/routes/products.ts
 * Endpoint para consultar productos por EAN-13 (CODBARRAS)
 */

import { Router, Request, Response } from "express";
import { pool } from "../db";

const router = Router();

/**
 * GET /api/products/:ean
 * Busca un producto por su código de barras EAN-13
 */
router.get("/:ean", async (req: Request, res: Response) => {
  const ean = req.params.ean;

 try {
    // Consulta a la base de datos, incluyendo nuevo_precio
    const result = await pool.query(
      `SELECT codbarras AS codbarras,
              referencia AS referencia,
              descripcion,
              talla,
              color,
              departamento,
              linea,
              nuevo_precio
       FROM products
       WHERE codbarras = $1`,
      [ean]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Error consultando producto:", err);
    res.status(500).json({ error: "Error al consultar producto" });
  }
});

export default router;

import { Router, Request, Response } from "express";
import { getProductByEan } from "../sheets";

const router = Router();

router.get("/:ean", async (req: Request, res: Response) => {
  const ean = req.params.ean;

  try {
    const product = await getProductByEan(ean);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.json(product);
  } catch (err) {
    console.error("Error consultando producto en Sheets:", err);
    res.status(500).json({ error: "Error al consultar producto" });
  }
});

export default router;

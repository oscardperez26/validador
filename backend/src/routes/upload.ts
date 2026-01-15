// backend/src/routes/upload.ts

/**
 * Ruta para subir un archivo Excel/CSV y actualizar la base de productos.
 *
 * FLUJO:
 *  1. Recibe el archivo Excel desde el frontend (campo "file").
 *  2. Lo convierte en filas con XLSX.
 *  3. TRUNCATE a products_stg.
 *  4. Inserta cada fila del Excel en products_stg (todo como TEXT).
 *  5. Ejecuta el INSERT ... SELECT ... ON CONFLICT que ya usas
 *     para poblar/actualizar la tabla final products.
 */

import { Router, Request, Response, NextFunction } from 'express';
import multer from 'multer';
import XLSX from 'xlsx';
import { pool } from '../db';

const router = Router();

// Multer en memoria: guarda el archivo en RAM (req.file.buffer)
const upload = multer();

/**
 * Middleware de autenticación BASIC muy simple.
 * Solo acepta usuario "admin" y clave "admin123".
 * Esto coincide con el login que hicimos en el frontend.
 */
function basicAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization || '';

  if (!header.startsWith('Basic ')) {
    return res.status(401).send('Falta autenticación');
  }

  const base64 = header.split(' ')[1];
  const [user, pass] = Buffer.from(base64, 'base64').toString('utf8').split(':');

  if (user !== 'admin' || pass !== 'admin123') {
    return res.status(401).send('Credenciales inválidas');
  }

  return next();
}

/**
 * POST /api/upload-xlsx
 *
 * El frontend envía:
 *  - Authorization: Basic <base64(admin:admin123)>
 *  - body: multipart/form-data con un campo "file"
 *
 * El backend:
 *  - Lee la primera hoja del Excel.
 *  - Inserta filas en products_stg.
 *  - Ejecuta el INSERT ... SELECT ... ON CONFLICT para actualizar products.
 */
router.post(
  '/',
  basicAuth,
  upload.single('file'), // el campo "file" debe coincidir con formData.append('file', file)
  async (req: Request, res: Response) => {
    // 1. Validar que venga un archivo
    if (!req.file) {
      return res.status(400).send('Archivo requerido');
    }

    try {
      // 2. Leer el Excel desde el buffer
      const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });

      // Tomamos la PRIMERA hoja del libro
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      // 3. Convertir esa hoja en un arreglo de objetos:
      //    cada objeto = una fila, con keys = encabezados del Excel.
        const rows: any[] = XLSX.utils.sheet_to_json(sheet, {
        defval: null,
        raw: false,  //  clave: usar el valor formateado como texto
        });

      if (!rows.length) {
        return res.status(400).send('El archivo está vacío');
      }

      // 4. Conectarnos a Postgres
      const client = await pool.connect();

      try {
        // Iniciamos una transacción para que todo sea atómico
        await client.query('BEGIN');

        // 4.1 Limpiamos la tabla staging antes de cargar los nuevos datos
        await client.query('TRUNCATE TABLE products_stg;');

        let staged = 0;

        // 4.2 Insertamos cada fila del Excel en products_stg
        for (const row of rows) {
          // Sacamos cada campo del objeto "row".
          // IMPORTANTE:
          //  El nombre debe coincidir con el encabezado del Excel:
          //   codbarras, referencia, codigo, descripcion, talla, color, ...
          const codbarras = row.codbarras != null ? String(row.codbarras).trim() : '';

          // Sin codbarras no podemos identificar el producto, así que lo saltamos
          if (!codbarras) {
            continue;
          }

          const referencia           = row.referencia != null ? String(row.referencia) : null;
          const codigo               = row.codigo != null ? String(row.codigo) : null;
          const descripcion          = row.descripcion != null ? String(row.descripcion) : null;
          const talla                = row.talla != null ? String(row.talla) : null;
          const color                = row.color != null ? String(row.color) : null;
          const departamento         = row.departamento != null ? String(row.departamento) : null;
          const seccion              = row.seccion != null ? String(row.seccion) : null;
          const marca                = row.marca != null ? String(row.marca) : null;
          const linea                = row.linea != null ? String(row.linea) : null;
          const temporada            = row.temporada != null ? String(row.temporada) : null;
          const genero               = row.genero != null ? String(row.genero) : null;
          const concepto             = row.concepto != null ? String(row.concepto) : null;
          const estilo_de_vida       = row.estilo_de_vida != null ? String(row.estilo_de_vida) : null;
          const clasificacion_produc = row.clasificacion_produc != null ? String(row.clasificacion_produc) : null;
          const caracteristica_fit   = row.caracteristica_fit != null ? String(row.caracteristica_fit) : null;
          const estilo_silueta       = row.estilo_silueta != null ? String(row.estilo_silueta) : null;
          const tipo_estampado       = row.tipo_estampado != null ? String(row.tipo_estampado) : null;

          // Campos numéricos en staging también los guardamos como TEXT.
          // Ej: "249.900", "100", etc. Ya los limpiarás en el INSERT ... SELECT.
          const bruto            = row.bruto != null ? String(row.bruto) : null;
          const nuevo_precio     = row.nuevo_precio != null ? String(row.nuevo_precio) : null;
          const antiguedad       = row.antiguedad != null ? String(row.antiguedad) : null;
          const observacion      = row.observacion != null ? String(row.observacion) : null;
          const inventario_tiendas = row.inventario_tiendas != null ? String(row.inventario_tiendas) : null;

          // Insertamos la fila en la tabla staging products_stg
          await client.query(
            `
              INSERT INTO products_stg (
                codbarras,
                referencia,
                codigo,
                descripcion,
                talla,
                color,
                departamento,
                seccion,
                marca,
                linea,
                temporada,
                genero,
                concepto,
                estilo_de_vida,
                clasificacion_produc,
                caracteristica_fit,
                estilo_silueta,
                tipo_estampado,
                bruto,
                nuevo_precio,
                observacion,
                antiguedad,
                observacion,
                inventario_tiendas
              )
              VALUES (
                $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,
                $11,$12,$13,$14,$15,$16,$17,$18,$19,$20,
                $21,$22,$23
              );
            `,
            [
              codbarras,
              referencia,
              codigo,
              descripcion,
              talla,
              color,
              departamento,
              seccion,
              marca,
              linea,
              temporada,
              genero,
              concepto,
              estilo_de_vida,
              clasificacion_produc,
              caracteristica_fit,
              estilo_silueta,
              tipo_estampado,
              bruto,
              nuevo_precio,
              observacion,
              antiguedad,
              observacion,
              inventario_tiendas,
            ]
          );

          staged += 1;
        }

        // 4.3 Ahora que products_stg ya tiene los datos crudos,
        //     ejecutamos TU query para poblar/actualizar products.
        await client.query(`
          INSERT INTO products (
            codbarras,
            referencia,
            codigo,
            descripcion,
            talla,
            color,
            departamento,
            seccion,
            marca,
            linea,
            temporada,
            genero,
            concepto,
            estilo_de_vida,
            clasificacion_produc,
            caracteristica_fit,
            estilo_silueta,
            tipo_estampado,
            bruto,
            nuevo_precio,
            observacion,
            antiguedad,
            observacion,
            inventario_tiendas
          )
          SELECT
            TRIM(codbarras),
            TRIM(referencia),
            TRIM(codigo),
            TRIM(descripcion),
            TRIM(talla),
            TRIM(color),
            TRIM(departamento),
            TRIM(seccion),
            TRIM(marca),
            TRIM(linea),
            TRIM(temporada),
            TRIM(genero),
            TRIM(concepto),
            TRIM(estilo_de_vida),
            TRIM(clasificacion_produc),
            TRIM(caracteristica_fit),
            TRIM(estilo_silueta),
            TRIM(tipo_estampado),
            NULLIF(TRIM(bruto), '')::NUMERIC(12,2),
            NULLIF(regexp_replace(TRIM(nuevo_precio), '[^0-9]', '', 'g'), '')::NUMERIC(12,0),
            NULLIF(TRIM(antiguedad), '')::NUMERIC(12,2),
            NULLIF(TRIM(observacion), ''),
            NULLIF(TRIM(inventario_tiendas), '')::INTEGER
          FROM products_stg
          WHERE
            codbarras IS NOT NULL
            AND TRIM(codbarras) <> ''
          ON CONFLICT (codbarras) DO UPDATE
          SET
            referencia           = EXCLUDED.referencia,
            codigo               = EXCLUDED.codigo,
            descripcion          = EXCLUDED.descripcion,
            talla                = EXCLUDED.talla,
            color                = EXCLUDED.color,
            departamento         = EXCLUDED.departamento,
            seccion              = EXCLUDED.seccion,
            marca                = EXCLUDED.marca,
            linea                = EXCLUDED.linea,
            temporada            = EXCLUDED.temporada,
            genero               = EXCLUDED.genero,
            concepto             = EXCLUDED.concepto,
            estilo_de_vida       = EXCLUDED.estilo_de_vida,
            clasificacion_produc = EXCLUDED.clasificacion_produc,
            caracteristica_fit   = EXCLUDED.caracteristica_fit,
            estilo_silueta       = EXCLUDED.estilo_silueta,
            tipo_estampado       = EXCLUDED.tipo_estampado,
            bruto                = EXCLUDED.bruto,
            nuevo_precio         = EXCLUDED.nuevo_precio,
            observacion          = EXCLUDED.observacion,
            antiguedad           = EXCLUDED.antiguedad,
            observacion          = EXCLUDED.observacion,
            inventario_tiendas   = EXCLUDED.inventario_tiendas;
        `);

        // Si todo sale bien, confirmamos la transacción
        await client.query('COMMIT');

        // Devolvemos cuántas filas se cargaron a staging (aprox filas procesadas)
        return res.json({ ok: true, total: staged });
      } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error procesando archivo:', err);
        return res.status(500).send('Error procesando archivo');
      } finally {
        client.release();
      }
    } catch (err) {
      console.error('Error general en upload:', err);
      return res.status(500).send('Error interno');
    }
  }
);

export default router;

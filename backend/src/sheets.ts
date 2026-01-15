import fs from "fs";
import path from "path";
import { google } from "googleapis";

const SPREADSHEET_ID = "1nJ2sq4oqkRAvG80b3zZuS6qP1g728WNVjdmQGQjHkLs";
const PRODUCTS_RANGE = "products!A:W";
const IMAGES_RANGE = "imagenes_productos!A:D";

function norm(v: any) {
  return String(v ?? "").trim();
}

let productsByEan = new Map<string, any>();
let imageByRef = new Map<string, string>();
let lastLoaded = 0;

const REFRESH_MS = 5 * 60 * 1000; // 5 minutos

async function loadFromSheets() {
  const now = Date.now();
  if (now - lastLoaded < REFRESH_MS && productsByEan.size > 0) return;

  const credsPath =
    process.env.GOOGLE_SA_PATH ||
    path.resolve(process.cwd(), "credentials", "service-account.json");

  if (!fs.existsSync(credsPath)) {
    throw new Error(
      `No se encontro service-account.json. Path probado: ${credsPath}. ` +
      `Configura GOOGLE_SA_PATH o crea credentials/service-account.json`
    );
  }

  const creds = JSON.parse(fs.readFileSync(credsPath, "utf8"));

  const auth = new google.auth.JWT({
    email: creds.client_email,
    key: creds.private_key,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  const [pRes, iRes] = await Promise.all([
    sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: PRODUCTS_RANGE }),
    sheets.spreadsheets.values.get({ spreadsheetId: SPREADSHEET_ID, range: IMAGES_RANGE }),
  ]);

  // products
  const pValues = (pRes.data.values ?? []) as any[][];
  const pHeaders = (pValues[0] ?? []).map(norm);
  const pRows = pValues.slice(1);

  const newProducts = new Map<string, any>();
  for (const row of pRows) {
    const obj: any = {};
    pHeaders.forEach((h, idx) => (obj[h] = row[idx]));
    const ean = norm(obj["codbarras"]);
    if (ean) newProducts.set(ean, obj);
  }

  // images
  const iValues = (iRes.data.values ?? []) as any[][];
  const iHeaders = (iValues[0] ?? []).map(norm);
  const iRows = iValues.slice(1);

  const refIndex = iHeaders.indexOf("referencia");
  const imgIndex = iHeaders.indexOf("image");

  const newImages = new Map<string, string>();
  for (const row of iRows) {
    const ref = norm(row[refIndex]);
    const img = norm(row[imgIndex]);
    if (ref) newImages.set(ref, img);
  }

  productsByEan = newProducts;
  imageByRef = newImages;
  lastLoaded = now;

  console.log(`Sheets cargado. products=${productsByEan.size}, images=${imageByRef.size}`);
}

export async function getProductByEan(ean: string) {
  await loadFromSheets();
  const p = productsByEan.get(norm(ean));
  if (!p) return null;

  const ref = norm(p["referencia"]);
  return {
    codbarras: norm(p["codbarras"]),
    referencia: ref,
    descripcion: norm(p["descripcion"]),
    talla: norm(p["talla"]),
    color: norm(p["color"]),
    departamento: norm(p["departamento"]),
    linea: norm(p["linea"]),
    nuevo_precio: norm(p["nuevo_precio"]),
    observacion: norm(p["observacion"]),
    genero: norm(p["genero"]),
    image: imageByRef.get(ref) ?? null,
  };
}

/**
 * fragments/scrape-rss.ts
 * Lee feeds RSS/Atom y devuelve los artículos recientes
 * Versión: 1.1.0
 *
 * No requiere ninguna llave de acceso — los feeds RSS son públicos.
 */

export interface ArticuloRSS {
  id: string;       // GUID único del artículo (para deduplicación)
  titulo: string;
  contenido: string;
  url: string;
  fecha: string;
  fuente: string;   // Nombre del feed
}

/**
 * scrapeRSS — lee uno o varios feeds RSS y devuelve artículos recientes
 */
export async function scrapeRSS(
  feeds: string | string[],
  opciones: {
    maxArticulosPorFeed?: number;  // Default: 10
    horasAtras?: number;           // Solo artículos de las últimas N horas. Default: 24
  } = {}
): Promise<ArticuloRSS[]> {
  const {
    maxArticulosPorFeed = 10,
    horasAtras = 24,
  } = opciones;

  const urls = Array.isArray(feeds) ? feeds : [feeds];
  const corteDeHora = new Date(Date.now() - horasAtras * 60 * 60 * 1000);
  const resultados: ArticuloRSS[] = [];

  for (const url of urls) {
    try {
      const articulos = await leerFeed(url, maxArticulosPorFeed, corteDeHora);
      resultados.push(...articulos);
    } catch (error) {
      // Registrar el error pero continuar con los demás feeds
      console.error(`[scrape-rss] Error leyendo feed ${url}:`, error);
    }
  }

  // Ordenar por fecha más reciente primero
  return resultados.sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );
}

async function leerFeed(
  url: string,
  maxArticulos: number,
  corteDeHora: Date
): Promise<ArticuloRSS[]> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; AgentBot/1.0)",
      "Accept": "application/rss+xml, application/xml, text/xml, */*",
    },
    // Timeout de 10 segundos
    signal: AbortSignal.timeout(10_000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status} al leer ${url}`);
  }

  const xml = await response.text();
  const nombreFeed = extraerNombreFeed(xml) ?? new URL(url).hostname;

  const articulos = parsearXML(xml, nombreFeed, url);

  // Filtrar por fecha y limitar cantidad
  return articulos
    .filter((a) => new Date(a.fecha) >= corteDeHora)
    .slice(0, maxArticulos);
}

/** Parsea RSS 2.0 y Atom 1.0 */
function parsearXML(xml: string, nombreFeed: string, feedUrl: string): ArticuloRSS[] {
  const articulos: ArticuloRSS[] = [];

  // Detectar si es Atom o RSS
  const esAtom = xml.includes("<feed") && xml.includes("xmlns");

  if (esAtom) {
    // Parser Atom
    const entradas = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/gi)];
    for (const entrada of entradas) {
      const bloque = entrada[1];
      const id = extraerTag(bloque, "id") ?? extraerAtributo(bloque, "link", "href") ?? "";
      const titulo = limpiarHTML(extraerTag(bloque, "title") ?? "");
      const contenido = limpiarHTML(
        extraerTag(bloque, "content") ?? extraerTag(bloque, "summary") ?? ""
      );
      const url = extraerAtributo(bloque, "link", "href") ?? feedUrl;
      const fecha = extraerTag(bloque, "updated") ?? extraerTag(bloque, "published") ?? "";

      if (titulo && fecha) {
        articulos.push({ id: id || generarId(titulo), titulo, contenido, url, fecha, fuente: nombreFeed });
      }
    }
  } else {
    // Parser RSS 2.0
    const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)];
    for (const item of items) {
      const bloque = item[1];
      const id = extraerTag(bloque, "guid") ?? extraerTag(bloque, "link") ?? "";
      const titulo = limpiarHTML(extraerTag(bloque, "title") ?? "");
      const contenido = limpiarHTML(
        extraerTag(bloque, "description") ?? extraerTag(bloque, "content:encoded") ?? ""
      );
      const url = extraerTag(bloque, "link") ?? feedUrl;
      const fecha = extraerTag(bloque, "pubDate") ?? "";

      if (titulo && fecha) {
        articulos.push({ id: id || generarId(titulo), titulo, contenido, url, fecha, fuente: nombreFeed });
      }
    }
  }

  return articulos;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

function extraerTag(xml: string, tag: string): string | null {
  const match = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return match ? match[1].trim() : null;
}

function extraerAtributo(xml: string, tag: string, atributo: string): string | null {
  const match = xml.match(new RegExp(`<${tag}[^>]*${atributo}="([^"]*)"`, "i"));
  return match ? match[1] : null;
}

function extraerNombreFeed(xml: string): string | null {
  return extraerTag(xml, "title");
}

function limpiarHTML(texto: string): string {
  return texto
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1") // Extraer CDATA
    .replace(/<[^>]+>/g, " ")                        // Quitar tags HTML
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#?\w+;/g, " ")                        // Otras entidades HTML
    .replace(/\s+/g, " ")
    .trim();
}

function generarId(texto: string): string {
  // Hash simple para generar un ID reproducible
  let hash = 0;
  for (let i = 0; i < texto.length; i++) {
    hash = (hash << 5) - hash + texto.charCodeAt(i);
    hash |= 0;
  }
  return `rss-${Math.abs(hash)}`;
}

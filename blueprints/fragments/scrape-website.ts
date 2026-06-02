/**
 * fragments/scrape-website.ts
 * Extrae texto de páginas web públicas sin necesidad de headless browser
 * Versión: 1.1.0
 *
 * Para sitios con JavaScript dinámico (SPAs), usar scrape-apify.ts en su lugar.
 */

export interface ResultadoScrape {
  id: string;
  titulo: string;
  contenido: string;
  url: string;
  fecha: string;
}

/**
 * scrapeWebsite — extrae el contenido textual de una URL
 */
export async function scrapeWebsite(
  urls: string | string[],
  opciones: {
    selectorContenido?: string; // Hint de qué sección buscar ("article", "main", etc.)
    maxCaracteres?: number;     // Default: 3000
  } = {}
): Promise<ResultadoScrape[]> {
  const { maxCaracteres = 3000 } = opciones;
  const lista = Array.isArray(urls) ? urls : [urls];
  const resultados: ResultadoScrape[] = [];

  for (const url of lista) {
    try {
      const resultado = await fetchPagina(url, maxCaracteres);
      if (resultado) resultados.push(resultado);
    } catch (error) {
      console.error(`[scrape-website] Error en ${url}:`, error);
    }
  }

  return resultados;
}

async function fetchPagina(url: string, maxCaracteres: number): Promise<ResultadoScrape | null> {
  const response = await fetch(url, {
    headers: {
      "User-Agent": "Mozilla/5.0 (compatible; AgentBot/1.0)",
      Accept: "text/html",
    },
    signal: AbortSignal.timeout(15_000),
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }

  const html = await response.text();
  const titulo = extraerTitulo(html);
  const contenido = extraerTexto(html, maxCaracteres);
  const fecha = new Date().toISOString();
  const id = `web-${hashSimple(url)}`;

  if (!contenido) return null;

  return { id, titulo, contenido, url, fecha };
}

// ─── Helpers de extracción ───────────────────────────────────────────────────

function extraerTitulo(html: string): string {
  const match = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  return limpiarTexto(match?.[1] ?? "Sin título");
}

function extraerTexto(html: string, maxCaracteres: number): string {
  // Quitar scripts, styles, nav, footer, aside
  const limpio = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<nav[\s\S]*?<\/nav>/gi, "")
    .replace(/<footer[\s\S]*?<\/footer>/gi, "")
    .replace(/<aside[\s\S]*?<\/aside>/gi, "")
    .replace(/<header[\s\S]*?<\/header>/gi, "")
    .replace(/<[^>]+>/g, " ")       // Quitar tags restantes
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&#\d+;/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();

  return limpio.slice(0, maxCaracteres);
}

function limpiarTexto(texto: string): string {
  return texto.replace(/\s+/g, " ").trim();
}

function hashSimple(texto: string): number {
  let h = 0;
  for (let i = 0; i < texto.length; i++) {
    h = (h << 5) - h + texto.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

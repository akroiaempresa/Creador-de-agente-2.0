/**
 * fragments/save-notion.ts
 * Guarda resultados en una base de datos de Notion
 * Versión: 1.1.0
 *
 * Requiere: NOTION_TOKEN y NOTION_DATABASE_ID en .dev.vars
 */

export interface EntradaNotion {
  titulo: string;
  contenido: string;
  fecha?: string;     // ISO string. Default: ahora
  etiquetas?: string[];
  url?: string;       // URL de fuente (si aplica)
}

/**
 * guardarEnNotion — crea una nueva página en una base de datos de Notion
 */
export async function guardarEnNotion(
  entrada: EntradaNotion,
  token: string,
  databaseId: string
): Promise<string> {
  // Validaciones
  if (!token || token.startsWith("PEGA_AQUI")) {
    throw new Error("NOTION_TOKEN no configurado. Revisa tu .dev.vars");
  }
  if (!databaseId || databaseId.startsWith("PEGA_AQUI")) {
    throw new Error("NOTION_DATABASE_ID no configurado. Revisa tu .dev.vars");
  }

  const fecha = entrada.fecha ?? new Date().toISOString().split("T")[0];

  // Construir el body de la página
  const body: Record<string, unknown> = {
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: entrada.titulo.slice(0, 2000) } }],
      },
      Fecha: {
        date: { start: fecha },
      },
    },
    children: [
      {
        object: "block",
        type: "paragraph",
        paragraph: {
          rich_text: [
            {
              type: "text",
              text: { content: entrada.contenido.slice(0, 2000) },
            },
          ],
        },
      },
    ],
  };

  // Agregar etiquetas si existen
  if (entrada.etiquetas && entrada.etiquetas.length > 0) {
    (body.properties as Record<string, unknown>)["Etiquetas"] = {
      multi_select: entrada.etiquetas.map((e) => ({ name: e })),
    };
  }

  // Agregar URL si existe
  if (entrada.url) {
    (body.properties as Record<string, unknown>)["URL"] = {
      url: entrada.url,
    };
  }

  const response = await fetch("https://api.notion.com/v1/pages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      "Notion-Version": "2022-06-28",
    },
    body: JSON.stringify(body),
    signal: AbortSignal.timeout(10_000),
  });

  const data = await response.json() as { id?: string; message?: string; object?: string };

  if (!response.ok || data.object === "error") {
    throw new Error(`Error de Notion: ${data.message ?? response.statusText}`);
  }

  const pageId = data.id ?? "desconocido";
  console.log(`[save-notion] Página creada: ${pageId}`);
  return pageId;
}

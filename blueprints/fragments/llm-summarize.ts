/**
 * fragments/llm-summarize.ts
 * Procesa y resume información usando OpenAI
 * Versión: 1.1.0
 */

import OpenAI from "openai";

export interface ItemParaProcesar {
  id: string;
  titulo?: string;
  contenido: string;
  url?: string;
  fecha?: string;
}

export interface OpcionesProcesamiento {
  idioma?: string;           // Default: "español"
  estilo?: string;           // Default: "claro y directo"
  longitudMaxima?: number;   // Caracteres max del resumen. Default: 800
  promptPersonalizado?: string; // Reemplaza el prompt por defecto si se provee
}

/**
 * resumirConIA — procesa una lista de ítems y devuelve un resumen en texto
 */
export async function resumirConIA(
  items: ItemParaProcesar[],
  apiKey: string,
  opciones: OpcionesProcesamiento = {}
): Promise<string> {
  const {
    idioma = "español",
    estilo = "claro y directo",
    longitudMaxima = 800,
    promptPersonalizado,
  } = opciones;

  if (items.length === 0) {
    return "No hay contenido nuevo para resumir.";
  }

  const client = new OpenAI({ apiKey });

  // Preparar el contenido a enviar
  const contenidoFormateado = items
    .map((item, i) => {
      const partes = [`[${i + 1}]`];
      if (item.titulo) partes.push(`Título: ${item.titulo}`);
      if (item.fecha) partes.push(`Fecha: ${item.fecha}`);
      if (item.url) partes.push(`URL: ${item.url}`);
      partes.push(`Contenido: ${item.contenido.slice(0, 2000)}`); // Limitar para no exceder tokens
      return partes.join("\n");
    })
    .join("\n\n---\n\n");

  const prompt =
    promptPersonalizado ??
    `Eres un asistente que resume información de forma ${estilo}.
     
Analiza los siguientes ${items.length} elemento(s) y entrega:
1. Un resumen ejecutivo (máximo 3 oraciones)
2. Los 3-5 puntos más importantes (como lista)
3. Una conclusión o recomendación breve (si aplica)

Responde siempre en ${idioma}.
El resumen total no debe exceder ${longitudMaxima} caracteres.

CONTENIDO A ANALIZAR:
${contenidoFormateado}`;

  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",  // Modelo eficiente y económico
      max_tokens: 600,
      temperature: 0.4,
      messages: [{ role: "user", content: prompt }],
    });

    const resultado = response.choices[0]?.message?.content;
    if (!resultado) throw new Error("OpenAI devolvió respuesta vacía");

    return resultado.trim();

  } catch (error: unknown) {
    if (error instanceof OpenAI.APIError) {
      // Errores conocidos de la API
      if (error.status === 429) {
        throw new Error("Límite de uso de OpenAI alcanzado. Intenta en unos minutos.");
      }
      if (error.status === 401) {
        throw new Error("Llave de acceso de OpenAI inválida. Verifica tu OPENAI_API_KEY.");
      }
    }
    throw new Error(`Error al procesar con IA: ${String(error)}`);
  }
}

/**
 * clasificarConIA — clasifica ítems por importancia (alta / media / baja)
 * Útil para agentes de monitoreo de emails o alertas
 */
export async function clasificarConIA(
  items: ItemParaProcesar[],
  apiKey: string,
  criterio: string
): Promise<Array<ItemParaProcesar & { importancia: "alta" | "media" | "baja"; razon: string }>> {
  if (items.length === 0) return [];

  const client = new OpenAI({ apiKey });

  const prompt = `Clasifica cada ítem según este criterio: "${criterio}"

Responde SOLO con un JSON array con este formato exacto (sin explicaciones adicionales):
[
  { "id": "id_del_item", "importancia": "alta|media|baja", "razon": "razón en 1 oración" }
]

ÍTEMS:
${items.map((item) => `ID: ${item.id}\nTítulo: ${item.titulo ?? "(sin título)"}\nContenido: ${item.contenido.slice(0, 500)}`).join("\n---\n")}`;

  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    max_tokens: 800,
    temperature: 0.2,
    messages: [{ role: "user", content: prompt }],
  });

  const texto = response.choices[0]?.message?.content ?? "[]";

  try {
    // Limpiar posibles backticks de markdown
    const limpio = texto.replace(/```json|```/g, "").trim();
    const clasificaciones = JSON.parse(limpio) as Array<{
      id: string;
      importancia: "alta" | "media" | "baja";
      razon: string;
    }>;

    // Combinar clasificaciones con los ítems originales
    return items.map((item) => {
      const clasificacion = clasificaciones.find((c) => c.id === item.id);
      return {
        ...item,
        importancia: clasificacion?.importancia ?? "media",
        razon: clasificacion?.razon ?? "Sin clasificar",
      };
    });
  } catch {
    // Si el JSON falla, devolver todos como media importancia
    console.error("[llm-summarize] Error parsing clasificación JSON:", texto);
    return items.map((item) => ({
      ...item,
      importancia: "media" as const,
      razon: "Error al clasificar",
    }));
  }
}

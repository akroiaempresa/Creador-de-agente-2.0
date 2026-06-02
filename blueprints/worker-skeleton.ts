/**
 * worker-skeleton.ts
 * Base para cualquier agente en Cloudflare Workers + Agents SDK
 * Versión: 1.1.0
 *
 * Instrucciones para Claude Code al generar el agente:
 *   1. Copia este archivo como src/index.ts
 *   2. Reemplaza los comentarios TODO con la lógica específica del agente
 *   3. Combina los fragments de blueprints/fragments/ según lo que necesite
 */

import { Agent } from "agents";

// ─── Tipos de entorno (llaves de acceso) ────────────────────────────────────
export interface Env {
  // Siempre presentes
  OPENAI_API_KEY: string;

  // Agregar según los servicios que use el agente:
  // PUSHOVER_TOKEN: string;
  // PUSHOVER_USER: string;
  // NOTION_TOKEN: string;
  // NOTION_DATABASE_ID: string;
  // APIFY_TOKEN: string;

  // Almacenamiento interno del agente (para que "recuerde" entre ejecuciones)
  AGENT_STORAGE: DurableObjectNamespace;
}

// ─── Estado que el agente recuerda entre ejecuciones ────────────────────────
interface AgentState {
  lastRunAt: string | null;
  processedIds: string[];  // IDs ya procesados (evita repetir)
  runCount: number;
}

// ─── Clase principal del agente ─────────────────────────────────────────────
export class MiAgente extends Agent<Env, AgentState> {

  // Estado inicial (primera vez que corre)
  initialState: AgentState = {
    lastRunAt: null,
    processedIds: [],
    runCount: 0,
  };

  /**
   * onRequest — maneja las peticiones HTTP al agente
   * POST /run  → dispara el agente manualmente (para testing)
   * GET  /status → devuelve estado actual del agente
   */
  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);

    // Endpoint de disparo manual
    if (request.method === "POST" && url.pathname === "/run") {
      try {
        await this.ejecutar();
        return Response.json({
          ok: true,
          message: "Agente ejecutado correctamente",
          runCount: this.state.runCount,
          lastRunAt: this.state.lastRunAt,
        });
      } catch (error) {
        console.error("[Agente] Error al ejecutar:", error);
        return Response.json(
          { ok: false, error: String(error) },
          { status: 500 }
        );
      }
    }

    // Endpoint de estado
    if (request.method === "GET" && url.pathname === "/status") {
      return Response.json({
        ok: true,
        state: this.state,
      });
    }

    return Response.json({ ok: false, error: "Ruta no encontrada" }, { status: 404 });
  }

  /**
   * ejecutar — lógica principal del agente
   * Esta función se llama tanto desde el cron como desde POST /run
   */
  async ejecutar(): Promise<void> {
    console.log(`[Agente] Iniciando ejecución #${this.state.runCount + 1}`);

    // 1. RECOPILAR — obtener información de la fuente
    const datos = await this.recopilar();
    if (!datos || datos.length === 0) {
      console.log("[Agente] No hay datos nuevos que procesar.");
      return;
    }

    // Filtrar los que ya fueron procesados antes
    const nuevos = datos.filter(
      (item) => !this.state.processedIds.includes(item.id)
    );

    if (nuevos.length === 0) {
      console.log("[Agente] Todos los datos ya fueron procesados anteriormente.");
      return;
    }

    console.log(`[Agente] ${nuevos.length} elemento(s) nuevos para procesar.`);

    // 2. PROCESAR — analizar / resumir / clasificar con IA
    const resultado = await this.procesar(nuevos);

    // 3. GUARDAR — persistir el resultado (si aplica)
    await this.guardar(resultado);

    // 4. NOTIFICAR — avisar al usuario
    await this.notificar(resultado);

    // 5. ACTUALIZAR ESTADO — recordar qué ya se procesó
    this.setState({
      lastRunAt: new Date().toISOString(),
      processedIds: [
        ...this.state.processedIds,
        ...nuevos.map((item) => item.id),
      ].slice(-500), // Guardar solo los últimos 500 IDs para no crecer sin límite
      runCount: this.state.runCount + 1,
    });

    console.log(`[Agente] Ejecución completada. Total histórico: ${this.state.runCount + 1}`);
  }

  /**
   * recopilar — busca información de la fuente configurada
   * TODO: reemplazar con el fragment correspondiente (scrape-rss, scrape-website, etc.)
   */
  async recopilar(): Promise<Array<{ id: string; contenido: string; titulo?: string }>> {
    // EJEMPLO: reemplazar con lógica real
    // import { scrapeRSS } from "./pipeline/scrape";
    // return scrapeRSS("https://ejemplo.com/feed.xml");
    throw new Error("TODO: implementar recopilar() con el fragment correspondiente");
  }

  /**
   * procesar — analiza los datos con IA
   * TODO: reemplazar con llamada a OpenAI o lógica personalizada
   */
  async procesar(
    items: Array<{ id: string; contenido: string; titulo?: string }>
  ): Promise<string> {
    // EJEMPLO: reemplazar con lógica real
    // import { resumirConIA } from "./pipeline/process";
    // return resumirConIA(items, this.env.OPENAI_API_KEY);
    throw new Error("TODO: implementar procesar() con el fragment llm-summarize");
  }

  /**
   * guardar — persiste el resultado (Notion, Sheets, etc.)
   * Puede dejarse vacío si el agente solo notifica
   */
  async guardar(_resultado: string): Promise<void> {
    // EJEMPLO: reemplazar con lógica real
    // import { guardarEnNotion } from "./pipeline/save";
    // await guardarEnNotion(resultado, this.env.NOTION_TOKEN, this.env.NOTION_DATABASE_ID);

    // Si no se usa guardado, dejar este método vacío (no lanzar error)
    console.log("[Agente] Paso de guardado omitido (no configurado).");
  }

  /**
   * notificar — avisa al usuario con el resultado
   * TODO: reemplazar con el fragment de notificación correspondiente
   */
  async notificar(_resultado: string): Promise<void> {
    // EJEMPLO: reemplazar con lógica real
    // import { notificarPushover } from "./pipeline/notify";
    // await notificarPushover(resultado, this.env.PUSHOVER_TOKEN, this.env.PUSHOVER_USER);
    throw new Error("TODO: implementar notificar() con el fragment notify-pushover");
  }
}

// ─── Handler principal del Worker ───────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // Rutear al agente según el ID (un agente por usuario)
    const id = env.AGENT_STORAGE.idFromName("agente-principal");
    const stub = env.AGENT_STORAGE.get(id);
    return stub.fetch(request);
  },

  // Cron: se ejecuta en el horario definido en wrangler.jsonc
  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    const id = env.AGENT_STORAGE.idFromName("agente-principal");
    const stub = env.AGENT_STORAGE.get(id);
    // Dispara el endpoint /run internamente
    await stub.fetch(
      new Request("https://agente-interno/run", { method: "POST" })
    );
  },
};

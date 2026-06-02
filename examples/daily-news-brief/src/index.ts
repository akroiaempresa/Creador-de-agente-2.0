/**
 * examples/daily-news-brief/src/index.ts
 *
 * AGENTE: Daily News Brief
 * Lee feeds RSS de noticias que te interesan, las resume con IA
 * y te manda un resumen al celular cada mañana.
 *
 * Variables necesarias en .dev.vars:
 *   OPENAI_API_KEY=...
 *   PUSHOVER_TOKEN=...
 *   PUSHOVER_USER=...
 *
 * Cron: todos los días a las 8am Ciudad de México (14:00 UTC)
 */

import { Agent } from "agents";
import { scrapeRSS } from "./pipeline/scrape";
import { resumirConIA } from "./pipeline/process";
import { notificarPushover } from "./pipeline/notify";

export interface Env {
  OPENAI_API_KEY: string;
  PUSHOVER_TOKEN: string;
  PUSHOVER_USER: string;
  AGENT_STORAGE: DurableObjectNamespace;
}

interface Estado {
  lastRunAt: string | null;
  idsVistos: string[];
  runCount: number;
}

// ── Configura aquí tus fuentes de noticias ─────────────────────────────────
const FEEDS = [
  "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/portada",
  "https://rss.nytimes.com/services/xml/rss/nyt/Technology.xml",
  // Agrega los feeds que quieras aquí
];

// ── Agente principal ────────────────────────────────────────────────────────
export class DailyNewsBrief extends Agent<Env, Estado> {
  initialState: Estado = {
    lastRunAt: null,
    idsVistos: [],
    runCount: 0,
  };

  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/run") {
      try {
        await this.ejecutar();
        return Response.json({ ok: true, runCount: this.state.runCount });
      } catch (error) {
        console.error("[DailyNewsBrief] Error:", error);
        return Response.json({ ok: false, error: String(error) }, { status: 500 });
      }
    }

    if (request.method === "GET" && url.pathname === "/status") {
      return Response.json({ ok: true, state: this.state });
    }

    return Response.json({ error: "Ruta no encontrada" }, { status: 404 });
  }

  async ejecutar(): Promise<void> {
    console.log("[DailyNewsBrief] Iniciando...");

    // 1. Leer feeds
    const articulos = await scrapeRSS(FEEDS, { maxArticulosPorFeed: 5, horasAtras: 25 });

    // 2. Filtrar ya vistos
    const nuevos = articulos.filter((a) => !this.state.idsVistos.includes(a.id));

    if (nuevos.length === 0) {
      console.log("[DailyNewsBrief] Sin noticias nuevas.");
      await notificarPushover(
        "Sin noticias nuevas en las últimas 24h.",
        this.env.PUSHOVER_TOKEN,
        this.env.PUSHOVER_USER,
        { titulo: "📰 Daily Brief" }
      );
      return;
    }

    // 3. Resumir con IA
    const resumen = await resumirConIA(nuevos, this.env.OPENAI_API_KEY, {
      promptPersonalizado: `Resume las siguientes ${nuevos.length} noticias del día en español.
Sé conciso y directo. Formato:
📰 RESUMEN DEL DÍA (${new Date().toLocaleDateString("es-MX")})

[bullet points con las noticias más importantes]

⚡ Para destacar: [1 sola frase de lo más relevante]

NOTICIAS:
${nuevos.map((a) => `- ${a.titulo}: ${a.contenido.slice(0, 300)}`).join("\n")}`,
    });

    // 4. Notificar
    await notificarPushover(resumen, this.env.PUSHOVER_TOKEN, this.env.PUSHOVER_USER, {
      titulo: `📰 Brief ${new Date().toLocaleDateString("es-MX")}`,
      prioridad: 0,
    });

    // 5. Actualizar estado
    this.setState({
      lastRunAt: new Date().toISOString(),
      idsVistos: [...this.state.idsVistos, ...nuevos.map((a) => a.id)].slice(-1000),
      runCount: this.state.runCount + 1,
    });

    console.log(`[DailyNewsBrief] Listo. ${nuevos.length} noticias procesadas.`);
  }
}

// ── Worker handler ──────────────────────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const id = env.AGENT_STORAGE.idFromName("daily-news-brief");
    return env.AGENT_STORAGE.get(id).fetch(request);
  },

  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    const id = env.AGENT_STORAGE.idFromName("daily-news-brief");
    await env.AGENT_STORAGE.get(id).fetch(
      new Request("https://interno/run", { method: "POST" })
    );
  },
};

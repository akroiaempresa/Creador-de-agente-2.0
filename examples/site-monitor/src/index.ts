/**
 * examples/site-monitor/src/index.ts
 *
 * AGENTE: Site Monitor
 * Revisa tus sitios web cada 30 minutos y te avisa si alguno se cae.
 * También detecta cambios de contenido importantes.
 *
 * Variables necesarias en .dev.vars:
 *   PUSHOVER_TOKEN=...
 *   PUSHOVER_USER=...
 *
 * Cron: cada 30 minutos
 */

import { Agent } from "agents";
import { notificarPushover } from "./pipeline/notify";

export interface Env {
  PUSHOVER_TOKEN: string;
  PUSHOVER_USER: string;
  AGENT_STORAGE: DurableObjectNamespace;
}

interface EstadoSitio {
  url: string;
  ultimoStatus: number | null;
  ultimoContenidoHash: string | null;
  estaDown: boolean;
  ultimaRevision: string | null;
}

interface Estado {
  sitios: Record<string, EstadoSitio>;
  runCount: number;
}

// ── Configura aquí los sitios que quieres monitorear ───────────────────────
const SITIOS = [
  "https://tuempresa.com",
  "https://tutienda.com",
  // Agrega los que quieras
];

// ── Agente principal ────────────────────────────────────────────────────────
export class SiteMonitor extends Agent<Env, Estado> {
  initialState: Estado = {
    sitios: {},
    runCount: 0,
  };

  async onRequest(request: Request): Promise<Response> {
    const url = new URL(request.url);

    if (request.method === "POST" && url.pathname === "/run") {
      try {
        await this.ejecutar();
        return Response.json({ ok: true, sitios: this.state.sitios });
      } catch (error) {
        return Response.json({ ok: false, error: String(error) }, { status: 500 });
      }
    }

    if (request.method === "GET" && url.pathname === "/status") {
      return Response.json({ ok: true, state: this.state });
    }

    return Response.json({ error: "Ruta no encontrada" }, { status: 404 });
  }

  async ejecutar(): Promise<void> {
    const alertas: string[] = [];
    const estadoActualizado = { ...this.state.sitios };

    for (const url of SITIOS) {
      try {
        const inicio = Date.now();
        const response = await fetch(url, {
          method: "HEAD",
          signal: AbortSignal.timeout(10_000),
        });
        const ms = Date.now() - inicio;
        const status = response.status;
        const estadoPrevio = this.state.sitios[url];

        // Detectar caída
        if (status >= 500) {
          if (!estadoPrevio?.estaDown) {
            alertas.push(`🔴 CAÍDA: ${url}\nCódigo: ${status} | Resp: ${ms}ms`);
          }
          estadoActualizado[url] = { url, ultimoStatus: status, ultimoContenidoHash: null, estaDown: true, ultimaRevision: new Date().toISOString() };

        } else if (estadoPrevio?.estaDown) {
          // Recuperación
          alertas.push(`✅ RECUPERADO: ${url}\nEstá de nuevo en línea (${status})`);
          estadoActualizado[url] = { url, ultimoStatus: status, ultimoContenidoHash: estadoPrevio.ultimoContenidoHash, estaDown: false, ultimaRevision: new Date().toISOString() };

        } else {
          // Ok — solo actualizar
          estadoActualizado[url] = { ...estadoPrevio, url, ultimoStatus: status, estaDown: false, ultimaRevision: new Date().toISOString() };
        }

        // Alertar si responde muy lento (>5s)
        if (ms > 5000 && status < 500) {
          alertas.push(`⚠️ LENTO: ${url}\nTardó ${ms}ms en responder`);
        }

      } catch {
        const estadoPrevio = this.state.sitios[url];
        if (!estadoPrevio?.estaDown) {
          alertas.push(`🔴 SIN RESPUESTA: ${url}\nNo pudo conectarse`);
        }
        estadoActualizado[url] = { url, ultimoStatus: null, ultimoContenidoHash: null, estaDown: true, ultimaRevision: new Date().toISOString() };
      }
    }

    // Enviar alertas si las hay
    if (alertas.length > 0) {
      await notificarPushover(
        alertas.join("\n\n"),
        this.env.PUSHOVER_TOKEN,
        this.env.PUSHOVER_USER,
        { titulo: "🚨 Alerta de Sitio", prioridad: 1 }
      );
    }

    this.setState({
      sitios: estadoActualizado,
      runCount: this.state.runCount + 1,
    });

    console.log(`[SiteMonitor] Revisión #${this.state.runCount + 1}. ${alertas.length} alerta(s).`);
  }
}

// ── Worker handler ──────────────────────────────────────────────────────────
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const id = env.AGENT_STORAGE.idFromName("site-monitor");
    return env.AGENT_STORAGE.get(id).fetch(request);
  },

  async scheduled(_event: ScheduledEvent, env: Env): Promise<void> {
    const id = env.AGENT_STORAGE.idFromName("site-monitor");
    await env.AGENT_STORAGE.get(id).fetch(
      new Request("https://interno/run", { method: "POST" })
    );
  },
};

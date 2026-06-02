/**
 * fragments/notify-pushover.ts
 * Envía notificaciones push al celular via Pushover
 * Versión: 1.1.0
 *
 * Requiere: PUSHOVER_TOKEN y PUSHOVER_USER en .dev.vars
 * Costo: $4.99 una vez (app iOS/Android). Sin suscripción mensual.
 */

export type PrioridadPushover = -2 | -1 | 0 | 1;
// -2 = silenciosa, -1 = baja, 0 = normal, 1 = alta (vibra siempre)

export interface OpcionesPushover {
  titulo?: string;
  prioridad?: PrioridadPushover;
  url?: string;              // Link al que va el botón "Abrir"
  urlTitulo?: string;        // Texto del botón (default: "Abrir")
  sonido?: string;           // Sonido de Pushover (default: el configurado en app)
  reintentos?: number;       // Default: 2
}

/**
 * notificarPushover — envía un mensaje push al celular del usuario
 */
export async function notificarPushover(
  mensaje: string,
  token: string,
  userKey: string,
  opciones: OpcionesPushover = {}
): Promise<void> {
  const {
    titulo = "Tu Agente de IA",
    prioridad = 0,
    url,
    urlTitulo = "Abrir",
    sonido,
    reintentos = 2,
  } = opciones;

  // Validaciones previas (fallar rápido con mensajes claros)
  if (!token || token === "PEGA_AQUI_TU_TOKEN_DE_PUSHOVER") {
    throw new Error("PUSHOVER_TOKEN no configurado. Revisa tu .dev.vars");
  }
  if (!userKey || userKey === "PEGA_AQUI_TU_USUARIO_DE_PUSHOVER") {
    throw new Error("PUSHOVER_USER no configurado. Revisa tu .dev.vars");
  }

  // Pushover tiene un límite de 1024 caracteres por mensaje
  const mensajeTruncado = mensaje.length > 1000
    ? mensaje.slice(0, 997) + "..."
    : mensaje;

  const body: Record<string, string> = {
    token,
    user: userKey,
    message: mensajeTruncado,
    title: titulo,
    priority: String(prioridad),
  };

  if (url) {
    body.url = url;
    body.url_title = urlTitulo;
  }
  if (sonido) {
    body.sound = sonido;
  }

  // Intentar con reintentos en caso de error de red
  let ultimoError: Error | null = null;

  for (let intento = 1; intento <= reintentos + 1; intento++) {
    try {
      const response = await fetch("https://api.pushover.net/1/messages.json", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(8_000),
      });

      const data = await response.json() as { status: number; errors?: string[] };

      if (data.status !== 1) {
        const errores = data.errors?.join(", ") ?? "Error desconocido";
        throw new Error(`Pushover rechazó el mensaje: ${errores}`);
      }

      console.log(`[notify-pushover] Notificación enviada: "${titulo}"`);
      return; // Éxito

    } catch (error) {
      ultimoError = error instanceof Error ? error : new Error(String(error));

      if (intento <= reintentos) {
        console.warn(`[notify-pushover] Intento ${intento} fallido, reintentando...`);
        // Esperar antes de reintentar (backoff simple)
        await new Promise((r) => setTimeout(r, 1000 * intento));
      }
    }
  }

  throw new Error(`No se pudo enviar la notificación después de ${reintentos + 1} intentos. Último error: ${ultimoError?.message}`);
}

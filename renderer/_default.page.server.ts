import { dangerouslySkipEscape, escapeInject } from "vite-plugin-ssr/server";
import type { ServerHTML, ServerMeta } from "./types";

export function render(ctx: any) {
  const meta: ReturnType<ServerMeta> =
    ctx.exportsAll.serverMeta[0].exportValue();
  const documentHtml = escapeInject`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${meta.title || "Vite SSR app"}</title>
        <meta name="description" content="${
          meta.description || "Vite SSR app"
        }">
        <meta name="viewport" content="width=device-width, initial-scale=1">
      </head>
      <body>
        <div id="app">${dangerouslySkipEscape(
          (ctx.exportsAll.serverHTML[0].exportValue as ServerHTML)()
        )}</div>
      </body>
    </html>`;
  return { documentHtml };
}

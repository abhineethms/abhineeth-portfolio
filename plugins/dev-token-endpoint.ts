import type { Plugin } from "vite";
import { mintToken } from "../api/_mint";

/**
 * Serves POST /api/token during `vite dev` so the voice agent works on localhost.
 * In production the same path is the Vercel function in api/token.ts.
 * `apply: "serve"` guarantees this never ends up in a build. No rate limit here;
 * that only matters on the public endpoint.
 */
export function abhiaiDevTokenEndpoint(env: Record<string, string>): Plugin {
  return {
    name: "abhiai-dev-token-endpoint",
    apply: "serve",
    configureServer(server) {
      server.middlewares.use("/api/token", (req, res) => {
        void (async () => {
          if (req.method !== "POST") {
            res.statusCode = 405;
            res.end();
            return;
          }
          try {
            const result = await mintToken(env);
            console.log(`[abhiai] token minted for ${result.room_name}`);
            res.setHeader("content-type", "application/json");
            res.end(JSON.stringify(result));
          } catch (err) {
            console.error("[abhiai] token mint failed:", err);
            res.statusCode = 500;
            res.end(JSON.stringify({ error: String(err) }));
          }
        })();
      });
    },
  };
}

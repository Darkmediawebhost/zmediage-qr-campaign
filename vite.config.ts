import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv, type Plugin } from 'vite';

// Runs api/lead.ts inside `vite dev`, so the form works locally exactly as it does on Vercel.
function devApi(): Plugin {
  return {
    name: 'dev-api',
    configureServer(server) {
      Object.assign(process.env, loadEnv('development', process.cwd(), ''));
      server.middlewares.use('/api/lead', async (req, res) => {
        const chunks: Buffer[] = [];
        for await (const c of req) chunks.push(c as Buffer);
        const mod = await server.ssrLoadModule('/api/lead.ts');
        const response: Response = await mod.POST(
          new Request(`http://${req.headers.host}/api/lead`, {
            method: req.method,
            headers: req.headers as Record<string, string>,
            body: req.method === 'POST' ? Buffer.concat(chunks) : undefined,
          }),
        );
        res.statusCode = response.status;
        res.setHeader('content-type', 'application/json');
        res.end(await response.text());
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), tailwindcss(), devApi()],
});

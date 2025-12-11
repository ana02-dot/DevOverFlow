import express from "express";
import { createServer as createViteServer } from "vite";
import { spawn } from "node:child_process";
import { createServer } from "node:http";

const app = express();
app.use(express.json());

// Start the .NET backend in the background
const backendProcess = spawn("bash", ["-c", "cd backend && dotnet watch run --urls http://0.0.0.0:5001"], {
  stdio: "inherit",
});

backendProcess.on("error", (error) => {
  console.error("Failed to start .NET backend:", error);
  process.exit(1);
});

// Proxy /api requests to the .NET backend
app.use('/api', async (req, res, next) => {
  const backendUrl = `http://localhost:5001/api${req.url}`;
  
  try {
    const response = await fetch(backendUrl, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        ...Object.fromEntries(
          Object.entries(req.headers)
            .filter(([key]) => !['host', 'connection'].includes(key.toLowerCase()))
        ),
      },
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      res.status(response.status).json(data);
    } else {
      const text = await response.text();
      res.status(response.status).send(text);
    }
  } catch (error) {
    console.error('API Proxy error:', error);
    res.status(502).json({ error: 'Backend unavailable' });
  }
});

// Setup Vite dev server
async function startViteServer() {
  const vite = await createViteServer({
    server: {
      middlewareMode: true,
      hmr: {
        server: createServer(app),
      },
    },
  });

  app.use(vite.middlewares);

  return vite;
}

const server = createServer(app);

startViteServer().then(() => {
  server.listen(5000, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:5000');
  });
});

process.on("SIGINT", () => {
  backendProcess.kill("SIGINT");
  process.exit();
});

process.on("SIGTERM", () => {
  backendProcess.kill("SIGTERM");
  process.exit();
});


import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import generateImageHandler from "./api/generate-image.js";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for image generation (using the same handler as Vercel)
app.post("/api/generate-image", async (req: Request, res: Response) => {
  // We wrap the Vercel handler in an Express-compatible way
  return generateImageHandler(req, res);
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // In production, serve static files from dist
    app.use(express.static("dist"));
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();


import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { fal } from "@fal-ai/client";

dotenv.config();

// fal.ai FLUX image-to-image: reference image + text prompt -> new scene.
const FAL_MODEL = "fal-ai/flux/dev/image-to-image";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '50mb' }));
  app.use(express.urlencoded({ limit: '50mb', extended: true }));

  // Health check route
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", env: process.env.NODE_ENV });
  });

  // Backend route for image generation to keep API_KEY secure
  const generateMemeHandler = async (req: Request, res: Response) => {
    try {
      const { prompt, logoBase64 } = req.body;
      const apiKey = process.env.FAL_KEY || process.env.FAL_API_KEY;

      if (!apiKey) {
        console.error("FAL_KEY is missing from environment");
        return res.status(500).json({ error: "API key not configured on the server" });
      }

      if (!logoBase64) {
        return res.status(400).json({ error: "Reference image is required" });
      }

      fal.config({ credentials: apiKey });

      const result = await fal.subscribe(FAL_MODEL, {
        input: {
          prompt,
          image_url: `data:image/png;base64,${logoBase64}`,
          strength: 0.85,
          num_images: 1,
          output_format: "png",
        },
      });

      const imageUrl = (result as any)?.data?.images?.[0]?.url;
      if (!imageUrl) {
        throw new Error("No image returned from fal.ai");
      }

      const imgResponse = await fetch(imageUrl);
      if (!imgResponse.ok) {
        throw new Error(`Failed to download generated image (${imgResponse.status})`);
      }
      const arrayBuffer = await imgResponse.arrayBuffer();
      const base64Data = Buffer.from(arrayBuffer).toString("base64");

      res.status(200).json({ base64: base64Data });
    } catch (error: any) {
      console.error("fal.ai generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate image" });
    }
  };

  app.post("/api/generate-meme", generateMemeHandler);
  app.post("/api/generate-meme/", generateMemeHandler);

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

startServer().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});


import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// OpenAI initialization
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// API route for image generation
app.post("/api/generate-image", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  try {
    // The user asked for "gpt-image-1-mini low quality".
    // Since that model doesn't exist, we use dall-e-2 which is the lower resolution/quality option.
    const response = await openai.images.generate({
      model: "dall-e-2", // Lower quality/mini model
      prompt: prompt,
      n: 1,
      size: "256x256", // Low resolution as requested
    });

    if (response.data && response.data[0].url) {
      res.json({ url: response.data[0].url });
    } else {
      throw new Error("No image URL returned from OpenAI");
    }
  } catch (error: any) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
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

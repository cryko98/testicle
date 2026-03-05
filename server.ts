
import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// API route for image generation
app.post("/api/generate-image", async (req: Request, res: Response) => {
  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Try to find the API key in a case-insensitive way
  const apiKey = process.env.OPENAI_API_KEY || process.env.openai_api_key;
  
  console.log("Checking API key:", apiKey ? "Found (masked)" : "Not found");
  
  if (!apiKey) {
    console.error("OpenAI API key is missing. Checked: OPENAI_API_KEY and openai_api_key");
    return res.status(500).json({ 
      error: "OpenAI API key is missing. Please set OPENAI_API_KEY in your environment variables." 
    });
  }

    try {
    // Initialize OpenAI inside the handler to avoid top-level issues
    const openai = new OpenAI({
      apiKey: apiKey,
      dangerouslyAllowBrowser: true,
    });

    // Switching to dall-e-3 for much better prompt adherence and scene generation.
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json",
    });

    if (response.data && response.data[0].b64_json) {
      res.json({ b64: response.data[0].b64_json });
    } else {
      throw new Error("No image data returned from OpenAI");
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

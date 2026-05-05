
import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

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
      const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;

      if (!apiKey) {
        console.error("GEMINI_API_KEY is missing from environment");
        return res.status(500).json({ error: "API key not configured on the server" });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-image",
        contents: {
          parts: [
            ...(logoBase64 ? [{
              inlineData: {
                data: logoBase64,
                mimeType: "image/png"
              }
            }] : []),
            { text: prompt }
          ],
        },
      });

      let base64Data = "";
      const parts = response.candidates?.[0]?.content?.parts || [];
      for (const part of parts) {
        if (part.inlineData?.data) {
          base64Data = part.inlineData.data;
          break;
        }
      }

      if (!base64Data) {
        throw new Error("No image data returned from Gemini");
      }

      res.status(200).json({ base64: base64Data });
    } catch (error: any) {
      console.error("Gemini generation error:", error);
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

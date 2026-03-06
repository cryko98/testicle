
import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Backend route for image generation to keep API_KEY secure
app.post("/api/generate-meme", async (req: Request, res: Response) => {
  try {
    const { prompt, logoBase64 } = req.body;
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "API_KEY is not configured on the server" });
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
    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData?.data) {
        base64Data = part.inlineData.data;
        break;
      }
    }

    if (!base64Data) {
      throw new Error("No image data returned from Gemini");
    }

    res.json({ base64: base64Data });
  } catch (error: any) {
    console.error("Gemini generation error:", error);
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

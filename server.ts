
import express, { Request, Response } from "express";
import { createServer as createViteServer } from "vite";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";

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

  // Meme generation with Gemini AI (using legolcsóbb Flash model)
  const generateMemeHandler = async (req: Request, res: Response) => {
    try {
      const { prompt, logoBase64 } = req.body;
      const apiKey = process.env.GEMINI_API_KEY;

      if (!apiKey) {
        return res.status(500).json({ error: "API key not configured on server" });
      }

      if (!logoBase64) {
        return res.status(400).json({ error: "Logo image is required" });
      }

      const client = new GoogleGenerativeAI(apiKey);
      const model = client.getGenerativeModel({ model: "gemini-1.5-flash" });

      const safePrompt = (prompt || "celebrating").replace(/testicle|nutsack|scrotum|penis|dick|cock|balls|sack|nut/gi, "character");

      const fullPrompt = `You are a meme generator. Using the provided yellow logo image as the character's head, create a stick figure meme.

REQUIREMENTS:
1. The character's HEAD must be the provided image
2. The body must be a simple stick figure with:
   - Yellow lines (#fbbf24) on black background (#000000)
   - Thin stick arms and legs
3. The scene: The character is ${safePrompt}
4. Style: Crude, hand-drawn, MS Paint aesthetic
5. NO other colors besides yellow and black
6. NO text, NO gradients, NO 3D effects

Generate a single stick figure meme image with the provided logo as the head.`;

      const imageData = {
        inlineData: {
          data: logoBase64,
          mimeType: "image/jpeg" as const,
        },
      };

      const response = await model.generateContent([imageData as any, fullPrompt]);
      const responseText = response.response.text();

      // Extract image from response
      let base64Data = "";

      // Check if response contains image data
      const imageParts = response.response.candidates?.[0]?.content?.parts?.filter(
        (part: any) => part.inlineData?.data
      ) || [];

      if (imageParts.length > 0 && imageParts[0]) {
        const part = imageParts[0] as any;
        base64Data = part.inlineData?.data || "";
      }

      if (!base64Data) {
        // Fallback: try to parse response text for image data
        const match = responseText.match(/base64,(.*?)["'\s]/);
        if (match) {
          base64Data = match[1];
        }
      }

      if (!base64Data) {
        throw new Error("No image generated - try a different prompt");
      }

      res.status(200).json({ base64: base64Data });
    } catch (error: any) {
      console.error("Meme generation error:", error);
      res.status(500).json({ error: error.message || "Failed to generate meme" });
    }
  };

  app.post("/api/generate-meme", generateMemeHandler);
  app.post("/api/generate-meme/", generateMemeHandler);

  // Vite middleware for development
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

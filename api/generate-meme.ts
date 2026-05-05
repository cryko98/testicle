import type { VercelRequest, VercelResponse } from "@vercel/node";
import { GoogleGenAI } from "@google/genai";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    return res.status(200).json({ base64: base64Data });
  } catch (error: any) {
    console.error("Gemini generation error:", error);
    return res.status(500).json({ error: error.message || "Failed to generate image" });
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "10mb",
    },
  },
};

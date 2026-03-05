import { GoogleGenAI } from "@google/genai";

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Use the Gemini API key from the environment
  const apiKey = process.env.GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error("Gemini API key is missing.");
    return res.status(500).json({ 
      error: "Gemini API key is missing." 
    });
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      contents: {
        parts: [
          {
            text: prompt,
          },
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

    if (base64Data) {
      res.status(200).json({ b64: base64Data });
    } else {
      throw new Error("No image data returned from Gemini");
    }
  } catch (error: any) {
    console.error("Gemini error:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
}

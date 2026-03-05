import OpenAI from "openai";

export default async function handler(req: any, res: any) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: "Prompt is required" });
  }

  // Try to find the API key in a case-insensitive way
  const apiKey = process.env.OPENAI_API_KEY || process.env.openai_api_key;
  
  if (!apiKey) {
    console.error("OpenAI API key is missing.");
    return res.status(500).json({ 
      error: "OpenAI API key is missing. Please set OPENAI_API_KEY in your Vercel Environment Variables and REDEPLOY." 
    });
  }

  try {
    const openai = new OpenAI({
      apiKey: apiKey,
    });

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "b64_json",
    });

    if (response.data && response.data[0].b64_json) {
      res.status(200).json({ b64: response.data[0].b64_json });
    } else {
      throw new Error("No image data returned from OpenAI");
    }
  } catch (error: any) {
    console.error("OpenAI error:", error);
    res.status(500).json({ error: error.message || "Failed to generate image" });
  }
}

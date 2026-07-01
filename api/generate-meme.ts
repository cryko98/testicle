import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fal } from "@fal-ai/client";

// fal.ai FLUX image-to-image: uses the reference image (character head) as a
// base and the text prompt to produce a new scene in the same style.
const FAL_MODEL = "fal-ai/flux/dev/image-to-image";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    // The reference image (character head) is passed as a data URI. `strength`
    // is kept high so the prompt drives the new scene while the yellow-on-black
    // doodle style of the reference is preserved.
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

    // Fetch the generated image and return it as base64 so the frontend
    // contract ({ base64 }) stays unchanged and the canvas stays untainted.
    const imgResponse = await fetch(imageUrl);
    if (!imgResponse.ok) {
      throw new Error(`Failed to download generated image (${imgResponse.status})`);
    }
    const arrayBuffer = await imgResponse.arrayBuffer();
    const base64Data = Buffer.from(arrayBuffer).toString("base64");

    return res.status(200).json({ base64: base64Data });
  } catch (error: any) {
    console.error("fal.ai generation error:", error);
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

import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { generateres } from "@/lib/gemini";
import { PassThrough } from "stream";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const textPrompt = (formData.get("promt") as string) || "";

    let fileUrl: string | undefined;

    if (file) {
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadRes: UploadApiResponse = await new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
          { resource_type: "auto", folder: "healthmate_reports", use_filename: true },
          (error, result) => {
            if (error) return reject(error);
            if (!result) return reject(new Error("No result from Cloudinary"));
            resolve(result);
          }
        );

        const bufferStream = new PassThrough();
        bufferStream.end(buffer);
        bufferStream.pipe(stream);
      });

      fileUrl = uploadRes.secure_url;
    }

    // HealthMate AI prompt
    const fullPrompt =
      "You are a HealthMate AI assistant. Only answer health-related questions or analyze medical reports.\n" +
      textPrompt +
      (fileUrl ? `\n\nAnalyze this file: ${fileUrl}` : "");

    const result = await generateres({ promt: fullPrompt });

    return new Response(JSON.stringify({ result }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("POST /healthmate Error:", err);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

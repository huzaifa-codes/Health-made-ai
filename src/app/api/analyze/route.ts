// app/api/analyze/route.ts
import { NextResponse } from "next/server";
import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { GoogleGenerativeAI } from "@google/generative-ai";

// ✅ PDF-parse fix for ESM
import * as pdfParseModule from "pdf-parse";
const pdfParse = pdfParseModule as unknown as (data: Buffer) => Promise<{ text: string }>;

// ----------------------
// Cloudinary Config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

// ----------------------
// Gemini AI Init
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// ----------------------
// TypeScript Types
type GeminiInput =
  | { text: string }
  | { inlineData: { mimeType: string; data: string } };

// ----------------------
// POST Handler
export async function POST(req: Request) {
  try {
    const contentType = req.headers.get("content-type") || "";
    let fileUrl: string = "";
    let pdfText: string = "";

    // ----------------------
    // 1️⃣ Handle FormData Upload
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file") as File;

      if (!file)
        return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const isPDF = file.name.toLowerCase().endsWith(".pdf");
      const isImage = /\.(jpg|jpeg|png|webp)$/i.test(file.name);

      if (!isPDF && !isImage)
        return NextResponse.json(
          { error: "Unsupported file type. Upload PDF or Image." },
          { status: 400 }
        );

    if (isImage) {
  // 🌐 Skip Cloudinary upload for testing
  fileUrl = "https://dummyimage.com/600x400/000/fff";
}
 else if (isPDF) {
        // Extract PDF text
        const pdfData = await pdfParse(buffer);
        pdfText = pdfData.text;
      }
    } else {
      // ----------------------
      // 2️⃣ Handle JSON input (fileUrl)
      const body = await req.json();
      if (!body.fileUrl)
        return NextResponse.json({ error: "fileUrl required" }, { status: 400 });

      fileUrl = body.fileUrl;

      if (fileUrl.toLowerCase().endsWith(".pdf")) {
        const pdfResp = await fetch(fileUrl);
        const pdfBuffer = Buffer.from(await pdfResp.arrayBuffer());
        const pdfData = await pdfParse(pdfBuffer);
        pdfText = pdfData.text;
      }
    }

    // ----------------------
    // Prepare Gemini Input
    const promptText = `
Analyze this medical report and provide:
1️⃣ English Summary
2️⃣ Roman Urdu Summary
3️⃣ Abnormal values explanation
4️⃣ 3 Doctor questions
5️⃣ Diet & lifestyle tips
6️⃣ Disclaimer: AI is not a doctor.
`;

    let geminiInput: GeminiInput[] = [];

    if (pdfText) {
      // PDF: Split into chunks if large
      const maxChunkSize = 2000;
      const chunks: string[] = [];
      for (let i = 0; i < pdfText.length; i += maxChunkSize) {
        chunks.push(pdfText.slice(i, i + maxChunkSize));
      }
      geminiInput = chunks.map(chunk => ({ text: `Medical Report Text:\n${chunk}` }));
      geminiInput.push({ text: promptText });
    } else if (fileUrl) {
      // Image: fetch and convert to base64
      const imgResp = await fetch(fileUrl);
      const imgBuffer = Buffer.from(await imgResp.arrayBuffer());
      const base64 = imgBuffer.toString("base64");

      geminiInput = [
        { inlineData: { mimeType: "image/jpeg", data: base64 } },
        { text: promptText },
      ];
    }

    // ----------------------
    // Call Gemini AI
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(geminiInput);
    const outputText: string = result.response.text();

    // ----------------------
    // Return Response
    return NextResponse.json({
      success: true,
      output: outputText,
      fileUrl: fileUrl || null,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "AI Analysis failed";
    console.error("Analyze API error:", err);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

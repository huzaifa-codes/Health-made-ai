import { GoogleGenerativeAI } from "@google/generative-ai";

async function testGemini() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const result = await model.generateContent("Hello Gemini!");
  console.log(result.response.text());
}

testGemini().catch(console.error);

// lib/gemini.js
const API_KEY = "AIzaSyBJhy_JSB6zOTnWeVHeukvEv2agDJf_wHw";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;


export async function generateres(prevUser) {
  // Prepare content parts
  const parts = [{ text: prevUser.promt }];

  if (prevUser.data && prevUser.mime_type) {
    parts.push({
      inline_data: {
        mime_type: prevUser.mime_type,
        data: prevUser.data,
      },
    });
  }

  const requestOptions = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Gemini expects contents as array of objects with parts
      contents: [{ parts }],
    }),
  };

  try {
    const response = await fetch(API_URL, requestOptions);
    const data = await response.json();

    const Apiresponce = data?.candidates?.[0]?.content?.parts?.[0]?.text
      ?.replace(/\*\*(.*?)\*\*/g, "$1")
      ?.trim();

    return Apiresponce || "No valid response received.";
  } catch (err) {
    console.error("Gemini API Error:", err);
    return "Something went wrong!";
  }
}

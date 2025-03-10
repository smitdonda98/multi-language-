// pages/api/translate.js
import translate from "google-translate-api";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { text, targetLanguage } = req.body;

  try {
    // Translate the text using google-translate-api
    const result = await translate(text, { to: targetLanguage });
    res.status(200).json({ translatedText: result.text });
  } catch (error) {
    console.error("Translation error:", error);
    res.status(500).json({ error: "Translation failed" });
  }
}

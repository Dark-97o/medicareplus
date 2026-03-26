/**
 * Cloudflare Worker: Groq AI Symptom Triage
 * Deploy this at: https://groqda.subhranilbaul2017.workers.dev
 *
 * Required Cloudflare Worker Secret:
 *   GROQ_API_KEY  → your Groq API key from console.groq.com
 *
 * Expected Request (from frontend):
 *   POST / with JSON body: { "message": "<symptom text>" }
 *
 * Response JSON:
 *   { "specialization": "Cardiology", "disease_brief": "..." }
 */

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
  "Content-Type": "application/json",
};

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Only POST requests are accepted." }),
        { status: 405, headers: CORS_HEADERS }
      );
    }

    // Parse incoming body
    let message = "";
    try {
      const body = await request.json();
      message = body.message || body.symptoms || "";
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body." }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    if (!message.trim()) {
      return new Response(
        JSON.stringify({ error: "Empty symptoms provided." }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Call the Groq API
    let groqResponse;
    try {
      groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: [
            {
              role: "system",
              content: `You are a medical triage assistant. Given a patient's symptoms, you must:
1. Identify the most likely medical specialization needed (e.g., Cardiology, Neurology, Orthopedics, Dermatology, Pediatrics, Oncology, Psychiatry, Endocrinology, Urology, or General Physician).
2. Provide a brief, clear disease assessment in 2-3 sentences.

You MUST respond with ONLY a valid JSON object in this exact format, no preamble, no markdown:
{
  "specialization": "<specialty name>",
  "disease_brief": "<2-3 sentence assessment>"
}`
            },
            {
              role: "user",
              content: `Patient symptoms: ${message}`
            }
          ],
          temperature: 0.3,
          max_tokens: 256,
        }),
      });
    } catch (fetchErr) {
      return new Response(
        JSON.stringify({ error: "Failed to reach Groq API.", detail: fetchErr.message }),
        { status: 502, headers: CORS_HEADERS }
      );
    }

    if (!groqResponse.ok) {
      const errText = await groqResponse.text();
      return new Response(
        JSON.stringify({ error: `Groq API returned ${groqResponse.status}`, detail: errText }),
        { status: 502, headers: CORS_HEADERS }
      );
    }

    // Parse Groq response
    const groqData = await groqResponse.json();
    const rawContent = groqData?.choices?.[0]?.message?.content || "";

    // Extract JSON from the model's reply (strip any markdown fences)
    let parsed = null;
    try {
      // Remove potential ```json ... ``` wrapping
      const cleaned = rawContent.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback: return raw text as disease_brief with general specialization
      return new Response(
        JSON.stringify({
          specialization: "General Physician",
          disease_brief: rawContent || "Unable to parse AI response.",
        }),
        { status: 200, headers: CORS_HEADERS }
      );
    }

    return new Response(
      JSON.stringify({
        specialization: parsed.specialization || "General Physician",
        disease_brief: parsed.disease_brief || rawContent,
      }),
      { status: 200, headers: CORS_HEADERS }
    );
  },
};

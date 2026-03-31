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
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: CORS_HEADERS });
    }

    if (request.method !== "POST") {
      return new Response(
        JSON.stringify({ error: "Only POST requests are accepted." }),
        { status: 405, headers: CORS_HEADERS }
      );
    }

    let inputData = {};
    try {
      inputData = await request.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body." }),
        { status: 400, headers: CORS_HEADERS }
      );
    }

    // Determine the interaction mode: 
    // 1. "chat" (messages array provided)
    // 2. "triage" (only single message/symptoms provided)
    
    let messages = [];
    let isTriageMode = false;

    if (inputData.messages && Array.isArray(inputData.messages)) {
      messages = inputData.messages;
    } else {
      isTriageMode = true;
      const userText = inputData.message || inputData.symptoms || "";
      if (!userText.trim()) {
        return new Response(
          JSON.stringify({ error: "Empty input provided." }),
          { status: 400, headers: CORS_HEADERS }
        );
      }
      messages = [
        {
          role: "system",
          content: `You are a medical triage assistant. Identify specialty and provide brief assessment context. 
          Return ONLY JSON: {"specialization": "...", "disease_brief": "..."}`
        },
        { role: "user", content: `Symptoms: ${userText}` }
      ];
    }

    // Call Groq API
    try {
      const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "llama3-8b-8192",
          messages: messages,
          temperature: isTriageMode ? 0.3 : 0.7,
          max_tokens: 512,
        }),
      });

      if (!groqResponse.ok) {
        const err = await groqResponse.json();
        return new Response(JSON.stringify({ error: "Groq API error", details: err }), { status: 502, headers: CORS_HEADERS });
      }

      const groqData = await groqResponse.json();
      const content = groqData.choices[0].message.content;

      // If it looks like triage JSON, try to parse it to ensure reliability
      if (isTriageMode) {
        try {
          const cleaned = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
          const parsed = JSON.parse(cleaned);
          return new Response(JSON.stringify(parsed), { status: 200, headers: CORS_HEADERS });
        } catch {
          return new Response(JSON.stringify({ specialization: "General Physician", disease_brief: content }), { status: 200, headers: CORS_HEADERS });
        }
      }

      // Default: Return the full content as a response (standard chat format)
      return new Response(JSON.stringify({ response: content, choices: groqData.choices }), { status: 200, headers: CORS_HEADERS });

    } catch (err) {
      return new Response(JSON.stringify({ error: "Worker Internal Failure", detail: err.message }), { status: 500, headers: CORS_HEADERS });
    }
  },
};

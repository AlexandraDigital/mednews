/**
 * Cloudflare Pages Function: /functions/api/news.js
 * 
 * Deploy this in your project's /functions/api/news.js
 * Set GROQ_API_KEY in Cloudflare Pages → Settings → Environment Variables
 */

export async function onRequestPost(context) {
  const { request, env } = context;

  const GROQ_API_KEY = env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    return new Response(
      JSON.stringify({ error: "GROQ_API_KEY environment variable is not set." }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: "Invalid request body." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const { query } = body;

  if (!query) {
    return new Response(
      JSON.stringify({ error: "Missing query field." }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  const systemPrompt = `You are a medical technology news analyst. The user wants the latest news on a medical technology topic.

Based on your knowledge, respond ONLY with valid JSON (no markdown, no backticks, no extra text) in this exact structure:
{
  "summary": "A 2-3 paragraph plain-language overview of the latest developments. Written for a general audience — clear, engaging, no jargon.",
  "items": [
    {
      "headline": "Short punchy headline",
      "description": "1-2 sentence plain English description of what's happening and why it matters.",
      "tags": ["tag1", "tag2"],
      "isHot": true,
      "isNew": false
    }
  ]
}

Return 4-6 items. Tags should be 1-2 words. isHot = major breakthrough or high impact. isNew = very recent development.`;

  const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 1200,
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Find the latest news and developments about: ${query}` },
      ],
    }),
  });

  if (!groqResponse.ok) {
    const errText = await groqResponse.text();
    return new Response(
      JSON.stringify({ error: `Groq API error: ${errText}` }),
      { status: groqResponse.status, headers: { "Content-Type": "application/json" } }
    );
  }

  const groqData = await groqResponse.json();
  const rawText = groqData.choices?.[0]?.message?.content || "";

  let parsed;
  try {
    const clean = rawText.replace(/```json|```/g, "").trim();
    parsed = JSON.parse(clean);
  } catch {
    return new Response(
      JSON.stringify({ error: "Failed to parse model response as JSON.", raw: rawText }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }

  return new Response(JSON.stringify(parsed), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
    },
  });
}

// Handle CORS preflight
export async function onRequestOptions() {
  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

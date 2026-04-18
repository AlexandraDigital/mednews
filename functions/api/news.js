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

  const systemPrompt = `You are a senior medical technology analyst with deep knowledge of clinical research, biotech, and health innovation. The user wants an in-depth briefing on a medical technology topic.

Respond ONLY with valid JSON (no markdown, no backticks, no extra text) in this exact structure:
{
  "summary": "A detailed 4-5 paragraph overview of the current landscape. Cover: what the technology is and how it works, the most significant recent developments, key players (companies, research institutions, clinical trials), real-world impact and patient outcomes where relevant, and what the next 1-2 years might look like. Use clear language accessible to an educated non-specialist — you can use medical/technical terms but briefly explain them. Be specific: cite actual studies, trial phases, approval statuses, statistics, and named organizations where possible.",
  "items": [
    {
      "headline": "Specific, informative headline",
      "description": "3-4 sentences covering: what exactly happened or was discovered, the methodology or mechanism involved, who conducted it or which organization is behind it, and why it matters clinically or commercially.",
      "impact": "1-2 sentences on the broader significance — who benefits, what problem it solves, or what barrier it breaks.",
      "source": "Name of journal, institution, company, or publication (e.g. Nature Medicine, FDA, Mayo Clinic, NEJM, Stanford Medicine)",
      "sourceType": "One of: journal | institution | company | agency | conference",
      "url": "A real, specific URL where the user can read more. Use the actual homepage or search page of the source — e.g. https://www.nejm.org, https://www.fda.gov/news-events, https://pubmed.ncbi.nlm.nih.gov/?term=<relevant+search+terms>, https://www.nature.com/nm/, https://clinicaltrials.gov/search?term=<relevant+terms>. Never invent article URLs. Use search or index pages that will actually work.",
      "tags": ["tag1", "tag2", "tag3"],
      "isHot": true,
      "isNew": false
    }
  ]
}

Return 8-10 items. Be specific and factual. Tags should be 1-2 words. isHot = major breakthrough or high clinical/commercial impact. isNew = very recent development.`;

  const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      max_tokens: 3000,
      temperature: 0.7,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Give me an in-depth briefing on the latest developments in: ${query}` },
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

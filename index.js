export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // Secure AI proxy placeholder. Put provider credentials in Worker secrets,
    // never in public JavaScript. Replace this block with your chosen AI API.
    if (url.pathname === "/api/chat" && request.method === "POST") {
      try {
        const body = await request.json();
        const message = String(body.message || "").trim();
        if (!message) return Response.json({ error: "Message is required." }, { status: 400 });

        // Backend integration point:
        // const apiKey = env.AI_API_KEY;
        // Call your provider here and return { reply, usage }.
        return Response.json({
          reply: "NEXUS backend is ready. Connect your AI provider in /api/chat using a Worker secret.",
          usage: { prompt_tokens: 0, completion_tokens: 0, total_tokens: 0 }
        });
      } catch {
        return Response.json({ error: "Invalid request." }, { status: 400 });
      }
    }

    return env.ASSETS.fetch(request);
  }
};
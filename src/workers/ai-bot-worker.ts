export default {
  async fetch(request: Request) {
    if (request.method === "POST") {
      const { prompt } = await request.json();
      // Replace with your AI API endpoint and key
      const apiUrl = "https://api.openai.com/v1/chat/completions";
      const apiKey = "YOUR_OPENAI_API_KEY";
      const res = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: prompt }],
        }),
      });
      const data = await res.json();
      return new Response(
        JSON.stringify({ answer: data.choices[0].message.content }),
        { headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response("Not found", { status: 404 });
  },
};

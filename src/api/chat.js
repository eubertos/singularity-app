export default async function handler(req, res) {
    const { messages } = req.body;
  
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
      }),
    });
  
    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "No response.";
  
    res.status(200).json({ reply });
  }
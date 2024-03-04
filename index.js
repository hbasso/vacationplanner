const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 8000;

// Make sure to replace 'your-api-key-here' with your actual OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
  res.json("Welcome to my vacation planner!", req);
});

app.get("/vacationplan", async (req, res) => {
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: "You are a helpful assistant." }],
      model: "gpt-3.5-turbo",
    });

    res.json({
      response: completion.choices[0].message.content,
    });
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

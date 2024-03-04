const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 8000;

// Make sure to replace 'your-api-key-here' with your actual OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.get("/", (req, res) => {
  const userMessage = req?.body?.message;
  if (userMessage) {
    res.json("Welcome to my vacation planner", userMessage);
  }
  res.json("Welcome to my vacation planner");
});

app.get("/test/:location", (req, res) => {
  const location = req.params.location;
  const body = req.body.message;
  res.json(location, body);
});

app.get("/testbody", (req, res) => {
  res.json({ requestBody: req.body });
});

app.get("/vacationplan", async (req, res) => {
  try {
    // const userMessage = req?.body?.message;
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "plan me a vacation to austin" },
        // { role: "user", content: userMessage },
      ],
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

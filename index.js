const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 8000;

// Make sure to replace 'your-api-key-here' with your actual OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

app.get("/", (req, res) => {
  const userMessage = req?.body?.message;
  if (userMessage) {
    res.json("Welcome to my vacation planner", userMessage);
  }
  res.json("Welcome to my vacation planner");
});

app.get("/test/:location", (req, res) => {
  const location = req.params.location;
  res.json(location);
});

app.post("/testbody", (req, res) => {
  try {
    const requestBody = req.body.message;
    res.json({ requestBody });
  } catch (error) {
    console.error("Error:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.post("/vacationplan", async (req, res) => {
  try {
    const userMessage = req.body.message;

    const completion = await openai.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "You are a vacation planner, please use the following test to plan a vacation for the user. Format the response as a JSON object with the following data structure: { day1: 'Day 1 itinerary details', day2: 'Day 2 itinerary details', ...add more days as needed }.",
        },
        { role: "user", content: userMessage },
      ],
      model: "gpt-3.5-turbo",
    });

    const formattedResponse = JSON.stringify(
      { response: completion.choices[0].message.content },
      null,
      2
    );

    res.json({
      formattedResponse,
    });
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

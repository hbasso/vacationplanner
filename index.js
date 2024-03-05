const express = require("express");
const OpenAI = require("openai");

const app = express();
const PORT = process.env.PORT || 8000;

// Make sure to replace 'your-api-key-here' with your actual OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

app.use(express.json());

app.get("/", (req, res) => {
  res.json("Welcome to my vacation planner");
});

app.get("/vacationplan", async (req, res) => {
  try {
    const location = req.query.location;
    const days = req.query.days;
    const interests = req.query.interests;

    const userMessage = `I want to go on vacation to ${location}, my interests include ${interests}`;

    const completion = await openai.chat.completions.create({
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a vacation planner, please use the following test to plan a vacation for the user. Format the response as a JSON object with the following data structure: { day1: 'Day 1 itinerary details', day2: 'Day 2 itinerary details', ...you will return this for ${days} ammount of days }.`,
        },
        { role: "user", content: userMessage },
      ],
      model: "gpt-3.5-turbo",
    });

    const itineraryData = JSON.parse(completion.choices[0].message.content);

    res.json({
      itineraryData,
    });
  } catch (error) {
    console.error("Error from OpenAI:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

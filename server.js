const express = require("express");
const OpenAI = require("openai");
const cors = require("cors");
require("dotenv").config();

// Create an instance of the Express application
const app = express();

// Define the port on which the server will listen
const PORT = process.env.PORT || 3000;

// Enable Cross-Origin Resource Sharing (CORS) for all routes
app.use(cors());
app.use(express.json());

// Define the route for text completion
app.post("/complete-text", async (req, res) => {
  // Initialize the OpenAI API client
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  // Extract the user input from the request query parameters

  const userInput = req.body;
  console.log("userInput", userInput);

  // Validate the user input
  if (!userInput) {
    return res.status(400).send("Missing input query parameter.");
  }

  try {
    // Send a request to the OpenAI API to complete the text
    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: userInput.prompt }],
      model: "gpt-3.5-turbo",
    });

    // Extract the completion text from the API response
    const completion = chatCompletion?.choices?.[0].message?.content;

    console.log("completion", completion);

    // Send the completion text back to the client
    res.json({ completion });
  } catch (error) {
    console.error(error);

    // Send a 500 Internal Server Error response to the client
    res.status(500).send("Internal Server Error");
  }
});

// Start the server and listen on the specified port
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

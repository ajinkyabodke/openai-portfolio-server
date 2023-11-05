// @ts-check
const express = require("express");

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
  // const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  // Extract the user input from the request query parameters

  const userInput = req.body;

  // Validate the user input
  if (!userInput) {
    return res.status(400).send("Missing input query parameter.");
  }

  try {
    const chatCompletionResponse = await getOpenAIRespone([
      { role: "user", content: userInput.prompt },
    ]);

    // Extract the completion text from the API response
    const chatCompletionResponseAsJSON = await chatCompletionResponse.json();
    console.log("🟢 response from openai : ", chatCompletionResponseAsJSON);

    const output = chatCompletionResponseAsJSON?.choices[0].message?.content;
    console.log("⚪️ output as html : ", output);

    // console.log("completion", completion);

    // Send the completion text back to the client
    return res.status(200).json({ success: true });
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

const getOpenAIRespone = (messages) =>
  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + process.env.OPENAI_API_KEY,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages,
    }),
  });
// const myprompt = `Give me html and css Create a professional portfolio website with the following details:\nTemplate: Professional\nHeader Position: top\nInclude Photo: No\nProfessional Summary: \nExperience: \nEducation: \nSkills: \nContact: GitHub - , LinkedIn - , Twitter - \nColors: Primary - , Secondary - , Background - \nFont: \nFont Size: `

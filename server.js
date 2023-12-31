// @ts-check
const express = require("express");

const cors = require("cors");
const { default: axios } = require("axios");
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
    console.log("Sending prompt to OPENAI");
    const chatCompletionResponseAsJSON = await getOpenAIResponseNEW([
      {
        role: "system",
        content: `
        - Convert user request using HTML and Tailwind CSS.
        - Follow user’s instructions to the point.
        - Do not start or end with any syntax, just give me the HTML that will go inside the <body> tag, but do NOT include <body> tag.
        - Do not response with any other text or formatting (even markdown code-blocks) around the html (like \`\`\` html), only raw html.
        - Use only tailwind classes, no custom classes or css.`,
      },
      { role: "user", content: userInput.prompt+"\n keep the Main title black always!" },
    ]);

    // Extract the completion text from the API response
    // const chatCompletionResponseAsJSON = await chatCompletionResponse.json();
    console.log("🟢 response from openai : ", chatCompletionResponseAsJSON);

    const output = chatCompletionResponseAsJSON?.choices[0].message?.content;
    const completeHtml = FIRST_PART_HTML + output + SECOND_PART_HTML;

    // console.log("completion", completion);

    // Send the completion text back to the client
    return res.status(200).json({ success: true, output: completeHtml });
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
const getOpenAIResponseNEW = async (messages) => {
  const apiUrl = "https://api.openai.com/v1/chat/completions";
  const headers = {
    "Content-Type": "application/json",
    Authorization: "Bearer " + process.env.OPENAI_API_KEY,
  };

  const data = {
    model: "gpt-4-1106-preview",
    messages,
  };
  const res = await axios.post(apiUrl, data, { headers });
  return res.data;
};
const getOpenAIResponseOLD = (messages) =>
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
const FIRST_PART_HTML = `<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Folio</title>
    <link href="https://cdn.tailwindcss.com" rel="stylesheet">
 
</head>

<body>`;

const SECOND_PART_HTML = `</body></html>`;

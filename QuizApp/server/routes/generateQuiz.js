const express = require('express');
const router = express.Router();
const { OpenAIApi } = require('openai'); // Only import OpenAIApi from openai package
require('dotenv').config();  // Ensure environment variables are loaded

const openai = new OpenAIApi(process.env.OPENAI_API_KEY); // Instantiate OpenAIApi directly with apiKey

router.post('/generate-quiz', async (req, res) => {
  const { topic, numberOfQuestions } = req.body;

  if (!topic || !numberOfQuestions) {
    return res.status(400).json({ error: 'Topic and number of questions are required' });
  }

  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: `Generate a quiz on the topic "${topic}" with ${numberOfQuestions} questions. Each question should have multiple options, including one correct answer.`,
      max_tokens: 2000,
    });

    const quizData = response.data.choices[0].text;
    res.json({ quiz: quizData });
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;

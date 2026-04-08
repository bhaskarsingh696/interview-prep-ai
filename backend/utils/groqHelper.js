const Groq = require('groq-sdk');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

// Generate interview questions
const generateQuestions = async (topic, difficulty, count = 5) => {
  const prompt = `You are an expert technical interviewer. Generate ${count} interview questions for the following:
Topic: ${topic}
Difficulty: ${difficulty}

Return ONLY a JSON array like this (no extra text):
[
  {
    "id": 1,
    "question": "question text here",
    "type": "technical",
    "expectedPoints": ["point1", "point2", "point3"]
  }
]`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.7,
    max_tokens: 2000
  });

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\[[\s\S]*\]/);
  if (!jsonMatch) throw new Error('Invalid response from AI');
  return JSON.parse(jsonMatch[0]);
};

// Evaluate user answer
const evaluateAnswer = async (question, userAnswer, topic) => {
  const prompt = `You are an expert technical interviewer evaluating a candidate's answer.

Question: ${question}
Candidate's Answer: ${userAnswer}
Topic: ${topic}

Evaluate the answer and return ONLY a JSON object like this (no extra text):
{
  "score": 8,
  "maxScore": 10,
  "feedback": "detailed feedback here",
  "strengths": ["strength1", "strength2"],
  "improvements": ["improvement1", "improvement2"],
  "modelAnswer": "brief ideal answer here"
}`;

  const response = await groq.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [{ role: 'user', content: prompt }],
    temperature: 0.5,
    max_tokens: 1000
  });

  const content = response.choices[0].message.content;
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('Invalid response from AI');
  return JSON.parse(jsonMatch[0]);
};

module.exports = { generateQuestions, evaluateAnswer };
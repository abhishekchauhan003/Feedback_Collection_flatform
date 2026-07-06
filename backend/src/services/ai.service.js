const axios = require('axios');
const { aiApiKey, aiProvider } = require('../config/env');

const buildPrompt = ({ rating, selectedTags, businessType, customerComment, language = 'en' }) => {
  let prompt = `Business Type: ${businessType}\nRating: ${rating}/5\n\nExperience:\n`;
  selectedTags.forEach(tag => { prompt += `- ${tag}\n`; });
  if (customerComment) {
    prompt += `\nCustomer note: ${customerComment}\n`;
  }
  prompt += `\nTask: Generate 3 concise and natural review drafts. Do not invent experiences that the customer did not provide. Use ${language} language.`;
  return prompt;
};

const generateWithGemini = async (prompt) => {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${aiApiKey}`;
  const response = await axios.post(url, {
    contents: [{ parts: [{ text: prompt }] }],
  });
  const text = response.data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const drafts = text.split('\n').filter(line => line.trim() !== '').slice(0, 3);
  return drafts;
};

const generateWithOpenAI = async (prompt) => {
  const url = 'https://api.openai.com/v1/chat/completions';
  const response = await axios.post(url, {
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
    max_tokens: 200,
    temperature: 0.7,
    n: 1,
  }, {
    headers: { Authorization: `Bearer ${aiApiKey}` },
  });
  const content = response.data.choices?.[0]?.message?.content || '';
  const drafts = content.split('\n').filter(line => line.trim() !== '').slice(0, 3);
  return drafts;
};

exports.generateDrafts = async (input) => {
  const prompt = buildPrompt(input);
  let drafts = [];
  if (aiProvider === 'gemini') {
    drafts = await generateWithGemini(prompt);
  } else if (aiProvider === 'openai') {
    drafts = await generateWithOpenAI(prompt);
  } else {
    throw new Error('Unsupported AI provider');
  }

  while (drafts.length < 3) {
    drafts.push('Great experience. Would recommend.');
  }
  drafts = drafts.map(d => d.replace(/^\d+\.\s*/, '').trim());
  return drafts.slice(0, 3);
};
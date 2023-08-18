const { Configuration, OpenAIApi } = require("openai");
const { GPT_API_KEY } = require("../constants");

const configuration = new Configuration({
  apiKey: GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

const askGPT = async (prompt, maxTokens) => {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    max_tokens: maxTokens,
  });

  return response.data.choices[0].text.trim();
};

module.exports = askGPT;

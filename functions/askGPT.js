const { Configuration, OpenAIApi } = require("openai");
const { GPT_API_KEY } = require("../constants");

const configuration = new Configuration({
  apiKey: GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

const askGPT = async (prompt, maxTokens) => {
  console.log("Asking GPT ...");
  console.log("Prompt : ", prompt)
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-4-1106-preview",
      messages: [{ role: "user", content: prompt }],
      max_tokens: maxTokens,
    });

    // Check Error
    if (response.data.error) {
      console.error(
        `Erreur lors de la génération de texte : ${response.data.error}`
      );
      return null;
    }
    console.log("GPT response : ", response.data.choices[0].message.content);
    return response.data.choices[0].message.content.trim();
  } catch (err) {
    console.error(`Erreur lors de la génération de texte : ${err.stack}`);
    return null;
  }
};

module.exports = askGPT;

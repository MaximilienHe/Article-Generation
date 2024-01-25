const { Configuration, OpenAIApi } = require("openai");
const { GPT_API_KEY } = require("../constants");

const configuration = new Configuration({
  apiKey: GPT_API_KEY,
});
const openai = new OpenAIApi(configuration);

const askGPT = async (prompt, maxTokens) => {
  console.log("Asking GPT ...");
  try {
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: maxTokens,
    });
  } catch (err) {
    console.error(`Erreur lors de la génération de texte : ${err.stack}`);
    console.log("Réponse de GPT : " + response)
    return null;
  }

  console.log("Response from GPT : " + response);

  // Check Error
  if (response.data.error) {
    console.error(
      `Erreur lors de la génération de texte : ${response.data.error}`
    );
    return null;
  }

  return response.data.choices[0].text.trim();
};

module.exports = askGPT;

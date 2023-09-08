const generateArticle = require("./generateArticle");
const pause = require("./pause");
const getRandomPause = require("./getRandomPause");

const generateAllArticles = async (products, delayInMinutes, postStatus) => {
  for (let product of products) {
    // Générez l'article pour ce produit
    const response = await generateArticle("POST", product.title, 0, postStatus);
    console.log("Valeur de la réponse : ", response);
    // Calculer la durée de la pause
    // delayInMinutes est le délai fixe
    // getRandomPause() renvoie une valeur aléatoire entre 1 et 5 minutes
    if (response) {
      const totalDelayInMilliseconds = (delayInMinutes + getRandomPause()) * 60 * 1000;
      // Appliquer la pause
      await pause(totalDelayInMilliseconds);
    }

  }
};

module.exports = generateAllArticles;

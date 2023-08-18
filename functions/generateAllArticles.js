const generateArticle = require("./generateArticle");
const pause = require("./pause");
const getRandomPause = require("./getRandomPause");

const generateAllArticles = async (products, delayInMinutes, postStatus) => {
  for (let product of products) {
    // Générez l'article pour ce produit
    await generateArticle("POST", product.title, 0, postStatus);

    // Calculer la durée de la pause
    // delayInMinutes est le délai fixe
    // getRandomPause() renvoie une valeur aléatoire entre 1 et 5 minutes
    const totalDelayInMilliseconds = (delayInMinutes + getRandomPause()) * 60 * 1000;

    // Appliquer la pause
    await pause(totalDelayInMilliseconds);
  }
};

module.exports = generateAllArticles;

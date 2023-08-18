const generateArticle = require("./generateArticle");
const pause = require("./pause");

const generateAllArticles = async (products) => {
  for (let product of products) {
    // Générez l'article pour ce produit
    await generateArticle("POST", product.title);

    // Pause de 1 seconde (ou autre durée) entre chaque création d'article
    // await pause(100000); // 1000 millisecondes = 1 seconde
  }
};

module.exports = generateAllArticles;
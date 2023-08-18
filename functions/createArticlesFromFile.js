const fs = require('fs');
const generateArticle = require("./generateArticle");
const pause = require("./pause"); // Assurez-vous d'avoir cette fonction de pause
const getRandomPause = require("./getRandomPause"); // Assurez-vous d'avoir cette fonction de pause

const createArticlesFromFile = async (filePath, delayInMinutes, postStatus) => {
  try {
    console.log("Lecture du fichier...");

    // Lire le contenu du fichier
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Convertir chaque ligne du fichier en élément d'un tableau
    const products = fileContent.split("\n");

    // Générer un article pour chaque produit
    for (let product of products) {
      console.log("Générer un article pour le produit " + product);
      const action = "POST";
      const productName = product.trim();
      const postId = 0;
      console.log("Action : " + action + " | Nom du produit : " + productName + " | ID de l'article : " + postId + " | Statut de l'article : " + postStatus);
      await generateArticle(action, productName, postId, postStatus);

      
      console.log("Pause...")
      // Calculer la durée de la pause
      const totalDelayInMilliseconds = (delayInMinutes + getRandomPause()) * 60 * 1000;

      // Appliquer la pause
      await pause(totalDelayInMilliseconds);
    }
    return true;
  } catch (error) {
    console.error(
      `Erreur lors de la création des articles à partir du fichier : ${error}`
    );
    return false;
  }
};

module.exports = createArticlesFromFile;

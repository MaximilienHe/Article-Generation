const fs = require('fs');
const generateArticle = require("./generateArticle");

const createArticlesFromFile = async (filePath) => {
  try {
    // Lire le contenu du fichier
    const fileContent = fs.readFileSync(filePath, "utf8");

    // Convertir chaque ligne du fichier en élément d'un tableau
    const products = fileContent.split("\n");

    // Générer un article pour chaque produit
    for (let product of products) {
      // Utiliser trim pour supprimer les espaces blancs et les caractères de contrôle en début et en fin de ligne
      await generateArticle("POST", product.trim());
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
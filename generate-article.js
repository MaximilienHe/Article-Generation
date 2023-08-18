// Node modules
const axios = require("axios");

// Custom modules
const { headers } = require("./constants");
const generateAllArticles = require("./functions/generateAllArticles");
const generateArticle = require("./functions/generateArticle");
const createArticlesFromFile = require("./functions/createArticlesFromFile");

// Arguments from command line
const action = process.argv[2];
const delayInMinutes = parseInt(process.argv[3] || "0"); // Default value 0
const fileNameOrProductName = process.argv[6];
const postId = process.argv[5];
const postStatus = process.argv[4] || "draft"; // Default value "draft"

// Main
if (action === "file") {
  console.log("Générer des articles à partir d'un fichier...");
  const fileName = fileNameOrProductName || "Fiches techniques existantes.txt";
  createArticlesFromFile(fileName, delayInMinutes, postStatus);
} else if (action === "all") {
  (async () => {
    console.log("Générer des articles pour tous les produits...");
    try {
      const apiData = await axios.get(
        "https://comparateur.droidsoft.fr/api/devices?page=1&limit=10000",
        { headers }
      );
      console.log("Données de l'API récupérées avec succès !");
      generateAllArticles(apiData.data, delayInMinutes, postStatus);
    } catch (error) {
      console.error(
        `Erreur lors de la récupération des données de l'API: ${error}`
      );
    }
  })();
} else if (fileNameOrProductName && postId) {
  generateArticle(action, fileNameOrProductName, postId, postStatus);
} else {
  console.log(
    "Veuillez fournir un nom de produit ou une action valide (file ou all)"
  );
  // console.log les exemples d'utilisation avec temps, nom de fichier, etc. Expliquer en langage naturel ce que fais la commande indiquée après
  console.log("Exemples d'utilisation:");
  console.log("Génerer des articles à partir d'un fichier avec 5 minutes de délai et statut 'publish': node generate-article.js file 5 'Fiches techniques existantes.txt' publish");
  console.log("Génerer des articles à partir d'un fichier avec 5 minutes de délai et statut 'draft': node generate-article.js file 5 'Fiches techniques existantes.txt'");
  console.log("Générer tous les articles avec 5 minutes de délai et statut 'publish': node generate-article.js all 5 publish");
  console.log("Générer un article pour un produit avec 5 minutes de délai et statut 'publish': node generate-article.js PUT 0 draft 134784 'Samsung Galaxy S23 Ultra'");
  console.log("Modifier un article pour un produit avec 5 minutes de délai et statut 'publish': node generate-article.js PUT 5 publish 123456 'Samsung Galaxy S23 Ultra'")
}

// db.end((err) => {
//   if (err) throw err;
//   console.log('Connection to MySQL database closed!');
// });

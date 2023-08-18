// Node modules
const axios = require("axios");

// Custom modules
const { headers } = require("./constants");
const generateAllArticles = require("./functions/generateAllArticles");
const generateArticle = require('./functions/generateArticle');
const createArticlesFromFile = require("./functions/createArticlesFromFile");

// Check if the user provided a product name so we can generate an article for it based on name and id
// If no product name is provided, check action given on position 2 and generate articles for all products or generate articles from file
if (process.argv.length <= 4) {
  const action = process.argv[2];
  if (action === "file") {
    // Si aucun nom de produit n'est fourni, générer des articles à partir d'un fichier
    console.log("Générer des articles à partir d'un fichier...");
    // Vérifier si un nom de fichier a été fourni
    if (process.argv.length < 3) {
      const fileName = "Fiches techniques existantes.txt";
    } else {
      const fileName = process.argv[3];
    }
    createArticlesFromFile(fileName);
  } else if (action === "all") {
    (async () => {
      // Si aucun nom de produit n'est fourni, générer des articles pour tous les produits
      console.log("Générer des articles pour tous les produits...");
      // Obtenir les données de l'API
      try {
        const apiData = await axios.get(
          "https://comparateur.droidsoft.fr/api/devices?page=1&limit=10000",
          { headers }
        );
        console.log("Données de l'API récupérées avec succès !");
        generateAllArticles(apiData.data);
      } catch (error) {
        console.error(
          `Erreur lors de la récupération des données de l'API: ${error}`
        );
      }
    })();
  }
} else if (process.argv.length === 5) {
  const action = process.argv[2];
  const productName = process.argv[3];
  const postId = process.argv[4];
  const responseGenerate = generateArticle(action, productName, postId);
} else {
  console.log(
    "Veuillez fournir un nom de produit ou une action valide (file ou all)"
  );
}


// db.end((err) => {
//   if (err) throw err;
//   console.log('Connection to MySQL database closed!');
// });

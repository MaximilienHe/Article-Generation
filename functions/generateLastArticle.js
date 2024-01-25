const axios = require("axios");
const connectToDB = require("../db"); // Assurez-vous que le chemin est correct
const generateArticle = require("./generateArticle");

const generateLastArticle = async (delayInMinutes, postStatus) => {
  const db = connectToDB();

  // Effectuer une requête SQL pour récupérer le dernier appareil
  const sql = `SELECT * FROM devices WHERE technical_sheet_written = 0 ORDER BY announced_date DESC LIMIT 1`;

  db.query(sql, async (err, result) => {
    if (err) {
      console.error(
        `Erreur lors de la récupération des données de la base de données : ${err}`
      );
      db.end();
      return;
    }

    if (result.length === 0) {
      console.log("Aucun nouvel appareil trouvé.");
      db.end();
      return;
    }

    const lastDevice = result[0];
    try {
      console.log("Génération de l'article pour l'appareil suivant :", lastDevice.title);
      // Supposons que generateArticle retourne une promesse
      await generateArticle("POST", lastDevice.title, 0, postStatus);
      console.log(
        `Article généré pour le dernier appareil : ${lastDevice.title}`
      );
    } catch (err) {
      console.error(`Erreur lors de la génération de l'article : ${err}`);
      console.error(`Erreur, stack : ${err.stack}`)
      db.end();
      process.exit(1); // Terminer avec un code d'erreur
      return;
    }

    db.end();
    process.exit(0); // Terminer normalement
  });
};

module.exports = generateLastArticle;

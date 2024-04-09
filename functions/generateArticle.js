const generateHTML = require("./generateHTML");
const getBrandName = require("./getBrandName");
const getCategoryId = require("./getCategoryId");
const postToWordPress = require("./postToWordPress");
const updateToWordPress = require("./updateToWordPress");
const productExists = require("./productExists");
const askGPT = require("./askGPT");
const connectToDB = require("../db");
const db = connectToDB();
const mysql = require('mysql');

function query(sql) {
  return new Promise((resolve, reject) => {
    db.query(sql, (err, result) => {
      if (err) reject(err);
      resolve(result);
    });
  });
}

// Ajout de la fonction isArticleContentEmpty
function isArticleContentEmpty(content) {
  const cleanedContent = content.replace(/<[^>]*>/g, '').trim();
  return cleanedContent.length === 0;
}

async function generateArticle(action, productName, postId, postStatus) {
  try {
    if (await productExists(productName)) {
      console.log("Le produit existe dans la base de données. Génération de l'article ...");

      const sqlDescriptionFrench = `SELECT description_french FROM devices WHERE title = ${mysql.escape(
        productName
      )};`;
          
      let result = await query(sqlDescriptionFrench);
      let descriptionFrench = result[0].description_french;

      const prompt = `Shorten this text in less than 30 words (160 characters at max). It should be still sentenced correctly and should look like a basic sentence : "${descriptionFrench}"`;
      const gptResponse = await askGPT(prompt, 60);
      const metaDesc = gptResponse;
      
      const htmlContent = await generateHTML(productName);

      // Vérification si le contenu est vide
      if (isArticleContentEmpty(htmlContent)) {
        console.error("Le contenu de l'article généré est vide. Annulation de la publication/mise à jour.");
        return false;
      }

      const brandName = getBrandName(productName);
      const categoryId = await getCategoryId(brandName);
      const tags = ["fichetechnique", brandName, "fiche technique", "fiche technique " + brandName, "fiche technique " + productName, "fiche technique " + brandName + " " + productName, productName, "fiche technique " + productName + " " + brandName];
      
      db.query(`SELECT * FROM devices WHERE title = ${mysql.escape(productName)};`, (err) => {
        if (err) throw err;
      });

      if (action === "POST") {
        console.log("POST to WordPress");
        const postResponse = await postToWordPress(
          htmlContent,
          productName,
          categoryId,
          postStatus,
          metaDesc,
          tags
        );
        if (!postResponse) {
          console.error(`Erreur lors de la publication de l'article ${postId} sur WordPress.`);
          return false;
        }
      } else if (action === "PUT" && postId) {
        console.log("PUT to WordPress");
        const updateResponse = await updateToWordPress(
          htmlContent,
          productName,
          postId,
          postStatus,
          categoryId,
          metaDesc,
          tags
        );
        if (!updateResponse) {
          console.error(`Erreur lors de la mise à jour de l'article ${postId} sur WordPress.`);
          return false;
        }
      } else {
        console.error("Veuillez fournir une action valide (POST ou PUT) et un ID de post si nécessaire.");
        return false;
      }
    } else {
      console.log(`Le produit ${productName} n'existe pas dans la base de données ou sa fiche technique a déjà été écrite. Il est donc ignoré.`);
      return false;
    }

    // Mise à jour de la base de données
    const updateSql = `UPDATE devices SET technical_sheet_written = 1 WHERE title = ${mysql.escape(productName)};`;
    await query(updateSql);

    console.log(`La fiche technique du produit ${productName} a été écrite ou mise à jour avec succès !`);
    return true;
  } catch (err) {
    console.error(`Erreur lors de la génération de l'article, depuis generateArticle.js : ${err}`);
    console.error(`Erreur, stack : ${err.stack}`);
    console.error(`Erreur, message : ${err.message}`);
    return false;
  }
}

module.exports = generateArticle;

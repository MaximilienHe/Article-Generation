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

async function generateArticle(action, productName, postId) {
  if (await productExists(productName)) {

    // Call database to get descript_french from device 
    const sqlDescriptionFrench = `SELECT description_french FROM devices WHERE title = ${mysql.escape(
      productName
    )};`;
        
    let result = await query(sqlDescriptionFrench);
    let descriptionFrench = result[0].description_french;

    // Ask GPT to generate a meta description based on the product description in French
    const prompt = `Shorten this text in less than 30 words (160 characters at max). It should be still sentenced correctly and should look like a basic sentence : "${descriptionFrench}`;
    const gptResponse = await askGPT(prompt, 60);

    // Create metaDesc var to store descript_french
    const metaDesc = gptResponse;


    const htmlContent = await generateHTML(productName);
    console.log("HTML généré : " + htmlContent)
    const brandName = getBrandName(productName);
    const categoryId = await getCategoryId(brandName);
    const tags = ["fichetechnique", brandName, "fiche technique", "fiche technique " + brandName, "fiche technique " + productName, "fiche technique " + brandName + " " + productName, productName, "fiche technique " + productName + " " + brandName];
    // Check if the product exists in the database
    const sql = `SELECT * FROM devices WHERE title = ${mysql.escape(
      productName
    )};`;

    db.query(sql, (err) => {
      if (err) throw err;
    });

    console.log(
      `Mise à jour de la fiche technique du produit ${productName} dans la base de données ...`
    );


    if (action === "POST") {
      const postResponse = await postToWordPress(
        htmlContent,
        productName,
        categoryId,
        metaDesc,
        tags
      );
      if (!postResponse) {
        console.error(
          `Erreur lors de la publication de l'article ${postId} sur WordPress.`
        );
        return false;
      }
    } else if (action === "PUT" && postId) {
      const updateResponse = await updateToWordPress(
        htmlContent,
        productName,
        postId,
        categoryId,
        metaDesc,
        tags
      );
      if (!updateResponse) {
        console.error(
          `Erreur lors de la mise à jour de l'article ${postId} sur WordPress.`
        );
        return false;
      }
    } else {
      console.error(
        "Veuillez fournir une action valide (POST ou PUT) et un ID de post si nécessaire."
      );
      return false;
    }
  } else {
    console.log(
      `Le produit ${productName} n'existe pas dans la base de données ou sa fiche technique a déjà été écrite. Il est donc ignoré.`
    );
    return false;
  }
  // If everything went well, return true and update the database to indicate that the article has been written
  const sql = `UPDATE devices SET technical_sheet_written = 1 WHERE title = ${mysql.escape(
    productName
  )};`;

  db.query(sql, (err) => {
    if (err) throw err;
  });

  console.log(
    `La fiche technique du produit ${productName} a été écrite ou mise à jour avec succès !`
  );

  return true;
}

module.exports = generateArticle;

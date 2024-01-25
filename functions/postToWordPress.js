const { WORDPRESS_POST_API_URL, WORDPRESS_APP_ID, WORDPRESS_APP_PASSWORD } = require("../constants");

async function postToWordPress(htmlContent, productName, categoryId, postStatus, metaDesc, tags = []) {
  try {
    const response = await fetch(
      `${WORDPRESS_POST_API_URL}/wp-json/wp/v2/posts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${WORDPRESS_APP_ID}:${WORDPRESS_APP_PASSWORD}`,
            "utf-8"
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          title: "Fiche Technique - " + productName,
          // Slug has to be "fiche-technique-" + the product name normalized without spaces and accents, and dashes instead of spaces"
          slug: "fiche-technique-" + productName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-"),
          content: htmlContent,
          status: postStatus,
          categories: [categoryId, 2653],
          excerpt: metaDesc
        }),
        
      }
    );
    console.log("Article publié avec succès en tant que " + postStatus + " sur WordPress");
    console.log(response.status);
    return true;
  } catch (error) {
    console.error(
      `Erreur lors de la publication de l'article sur WordPress : ${error.message}`
    );
    return false;
  }
};

module.exports = postToWordPress;
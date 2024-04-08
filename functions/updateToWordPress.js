const {
  WORDPRESS_POST_API_URL,
  WORDPRESS_APP_ID,
  WORDPRESS_APP_PASSWORD,
} = require("../constants");

async function updateToWordPress(htmlContent, productName, postId, postStatus, categoryId, metaDesc, tags = []) {
  try {
    // Check if productName ends with '+' and replace it with 'plus'
    let formattedProductName = productName.endsWith('+') ? productName.slice(0, -1) + '-plus' : productName;

    const response = await fetch(
      `${WORDPRESS_POST_API_URL}/wp-json/wp/v2/posts/${postId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Basic ${Buffer.from(
            `${WORDPRESS_APP_ID}:${WORDPRESS_APP_PASSWORD}`,
            "utf-8"
          ).toString("base64")}`,
        },
        body: JSON.stringify({
          title: "Fiche Technique - " + productName,
          slug: "fiche-technique-" + formattedProductName.normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
            .replace(/ /g, "-"), // Remplacer les espaces par des tirets
          content: htmlContent,
          categories: [categoryId, 2653],
          excerpt: metaDesc
        }),
      }
    );

    console.log(
      `Article ${postId} mis à jour avec succès. Response : `
    );
    console.log(response.status);
    return true;
  } catch (error) {
    console.error(
      `Erreur lors de la mise à jour de l'article sur WordPress : ${error.message}`
    );
    return false;
  }
  return false;
}

module.exports = updateToWordPress;

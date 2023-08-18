const {
  WORDPRESS_POST_API_URL,
  WORDPRESS_APP_ID,
  WORDPRESS_APP_PASSWORD,
} = require("../constants");

async function updateToWordPress(htmlContent, productName, postId, categoryId, metaDesc, tags = []) {
  try {
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
          slug: "fiche-technique-" + productName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-"),
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

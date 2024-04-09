const {
  WORDPRESS_POST_API_URL,
  WORDPRESS_APP_ID,
  WORDPRESS_APP_PASSWORD,
} = require("../constants");

async function updateToWordPress(htmlContent, productName, postId, postStatus, categoryId, metaDesc, tags = []) {
  try {
    let body = {};

    if (htmlContent) {
      body.content = htmlContent;
    }

    if (productName) {
      body.title = "Fiche Technique - " + productName;
      body.slug = "fiche-technique-" + productName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/ /g, "-");
    }

    if (categoryId) {
      body.categories = [categoryId, 2653];
    }

    if (metaDesc) {
      body.excerpt = metaDesc;
    }

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
        body: JSON.stringify(body),
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

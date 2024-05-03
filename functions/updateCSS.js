const axios = require("axios");
const updateToWordPress = require("./updateToWordPress");
const { WORDPRESS_POST_API_URL } = require("../constants");

const fetchAllPosts = async (category) => {
  let posts = [];
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    try {
      const response = await axios.get(`${WORDPRESS_POST_API_URL}/wp-json/wp/v2/posts?categories=${category}&page=${page}`);
      if (response.data.length > 0) {
        posts = posts.concat(response.data);
        page++;
      } else {
        hasMore = false;
      }
    } catch (error) {
      if (error.response && error.response.data && error.response.data.code === 'rest_post_invalid_page_number') {
        // C'est ici qu'on gère spécifiquement l'erreur de numéro de page invalide.
        hasMore = false;
      } else {
        // Gestion des autres types d'erreurs qui pourraient survenir
        console.error('An error occurred:', error.message);
        throw error; // Renvoie l'erreur pour indiquer qu'une erreur inattendue s'est produite
      }
    }
  }

  return posts;
};

const updateCSS = async () => {
  const categoryID = 2653; // ID de la catégorie des articles à mettre à jour
  const posts = await fetchAllPosts(categoryID);

  for (const post of posts) {
    console.log(`Mise à jour de l'article ${post.id}...`)
    try {
      let content = post.content.rendered;

      // Remplacer l'URL des images et mettre à jour le CSS / disposition selon les nouvelles spécifications
      // Exemple de remplacement d'URL d'image :
      content = content.replace(
        /https:\/\/fdn2.gsmarena.com\/vv\/bigpic\/(.*?)\.jpg/g,
        "https://droidsoft.fr/images_smartphones/$1.jpg"
      );

      // Mettre à jour l'article sur WordPress
      console.log("Calling update from CSS update file");
      await updateToWordPress(
        content,
        undefined,
        post.id,
        undefined,
        undefined,
        undefined,
        undefined
      );
    } catch (error) {
      console.error(
        `Erreur lors de la mise à jour de l'article ${post.id} : ${error.message}`
      );
    }
  }

  console.log("Tous les articles ont été mis à jour.");
};

module.exports = updateCSS;

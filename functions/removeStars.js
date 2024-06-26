// Assurez-vous que 'fs' et 'axios' sont importés
const fs = require('fs');
const axios = require('axios');
const updateToWordPress = require('./updateToWordPress');
const { WORDPRESS_POST_API_URL } = require('../constants');

const removeStars = async (fileName, postStatus) => {
  // Lire les ID des articles depuis un fichier
  let articleIds = fs.readFileSync(fileName, 'utf8').split('\n');
  
  for (const postId of articleIds) {
    try {
      // Récupérer le contenu actuel de l'article
      let response = await axios.get(`${WORDPRESS_POST_API_URL}/wp-json/wp/v2/posts/${postId}`);
      let content = response.data.content.rendered;

      // Remplacer les "**" par des balises <b>
      content = content.replace(/\*\*(.*?)\*\*/g, '<b>$1</b>');

      // Mettre à jour l'article sur WordPress
      await updateToWordPress(content, undefined, postId, undefined, undefined, undefined, undefined);
    } catch (error) {
      console.error(`Erreur lors de la mise à jour de l'article (removeStars) ${postId} : ${error.message}`);
    }
  }

  console.log('Tous les articles ont été mis à jour.');
}

module.exports = removeStars;
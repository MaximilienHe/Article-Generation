const axios = require('axios');
const updateToWordPress = require('./updateToWordPress');
const { WORDPRESS_POST_API_URL } = require('../constants');

const fetchAllPosts = async (category) => {
    // For debugging purposes, only return the data from the post with ID = 136389 (url with /posts/136389
    const response = await axios.get(`${WORDPRESS_POST_API_URL}/wp-json/wp/v2/posts/136389`);
    return [response.data];
    

    let posts = [];
    let page = 1;
    let hasMore = true;

    while (hasMore) {
        const response = await axios.get(`${WORDPRESS_POST_API_URL}/wp-json/wp/v2/posts?categories=${category}&page=${page}`);
        if (response.data.length > 0) {
            posts = posts.concat(response.data);
            page++;
        } else {
            hasMore = false;
        }
    }

    return posts;
};

const updateCSS = async () => {
    const categoryID = 2653; // ID de la catégorie des articles à mettre à jour
    const posts = await fetchAllPosts(categoryID);

    for (const post of posts) {
        try {
            let content = post.content.rendered;

            // Remplacer l'URL des images et mettre à jour le CSS / disposition selon les nouvelles spécifications
            // Exemple de remplacement d'URL d'image :
            content = content.replace(/https:\/\/fdn2.gsmarena.com\/vv\/bigpic\/(.*?)\.jpg/g, 'https://droidsoft.fr/images_smartphones/$1.jpg');

            const updateContentWithNewCSS = (content) => {
                // Extraction des informations nécessaires
                const imgRegex = /<img src="([^"]+)" alt="([^"]+)" \/>/;
                const priceHistoryRegex = /\[price-history id="(\d+)"\]/;
                const kelkooBoxRegex = /\[kelkoo-box product_name="([^"]+)"\]/;
                const amazonBoxRegex = /\[amazon box="([^"]+)"\]/;
              
                const imgMatches = content.match(imgRegex);
                const priceHistoryMatches = content.match(priceHistoryRegex);
                const kelkooBoxMatches = content.match(kelkooBoxRegex);
                const amazonBoxMatches = content.match(amazonBoxRegex);
              
                // Remplacement de l'URL de l'image
                let modifiedImageUrl = '';
                if (imgMatches && imgMatches[1]) {
                  modifiedImageUrl = imgMatches[1].replace(/https:\/\/fdn2.gsmarena.com\/vv\/bigpic\//, 'https://droidsoft.fr/images_smartphones/');
                }
              
                // Construction du nouveau contenu avec le nouveau CSS
                let newContent = `
              <hr class="wp-block-separator" />
              <div style="display: flex; flex-wrap: wrap; justify-content: center; align-items: flex-start;">
                <div style="flex: 0 1 auto; max-width: 300px; margin-right: 20px; position: relative;">
                  <p><img style="width: 100%; max-width: 200px; height: auto;" src="${modifiedImageUrl}" alt="${imgMatches ? imgMatches[2] : ''}" /></p>
                </div>
                <div style="flex: 1 1 60%; min-width: 250px;">
                  ${priceHistoryMatches ? `<div style="width: 100%;">[price-history id="${priceHistoryMatches[1]}"]</div>` : ''}
                </div>
              </div>
              <div class="wp-block-buttons is-content-justification-center is-layout-flex wp-container-1 wp-block-buttons-is-layout-flex"></div>
              ${kelkooBoxMatches ? `<p>[kelkoo-box product_name="${kelkooBoxMatches[1]}"]</p>` : ''}
              ${amazonBoxMatches ? `<p>[amazon box="${amazonBoxMatches[1]}"]</p>` : ''}
                `;
              
                return newContent;
              };
              
              const replaceOldCSSWithNewContent = (originalContent, newContent) => {
                // Définir le début et la fin de la section à remplacer
                const startMarker = '<hr class="wp-block-separator">';
                const endMarker = '<figure class="wp-block-table">'; // Assurez-vous que c'est un élément unique après votre ancien CSS
              
                // Construire une regex qui capture tout entre ces deux marqueurs
                const regexPattern = new RegExp(`(${startMarker}[\\s\\S]*?)${endMarker}`);
              
                // Remplacer la section capturée par newContent, suivi immédiatement par endMarker pour réintégrer la partie non remplacée du contenu
                const updatedContent = originalContent.replace(regexPattern, `${newContent}${endMarker}`);
              
                return updatedContent;
              };

            // Mettre à jour le contenu avec le nouveau CSS
            content = replaceOldCSSWithNewContent(content, updateContentWithNewCSS(content));

            // Mettre à jour l'article sur WordPress
            console.log("Calling update from CSS update file");
            await updateToWordPress(content, post.id);
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de l'article ${post.id} : ${error.message}`);
        }
    }

    console.log('Tous les articles ont été mis à jour.');
};

module.exports = updateCSS;
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

            // Mettre à jour l'article sur WordPress
            console.log("Calling update from CSS update file");
            await updateToWordPress(content, undefined, post.id, undefined, undefined, undefined, undefined);
        } catch (error) {
            console.error(`Erreur lors de la mise à jour de l'article ${post.id} : ${error.message}`);
        }
    }

    console.log('Tous les articles ont été mis à jour.');
};

module.exports = updateCSS;
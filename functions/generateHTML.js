const axios = require('axios');
const { headers } = require('../constants');
const { PHONE_API_URL } = require('../constants');
const fetchTestArticle = require('./fetchTestArticle');
const getReviewRating = require('./getReviewRating');
const getAmazonCode = require('./getAmazonCode');
const translate = require('./translate');
const askGPT = require('./askGPT');
const generateHtml = async (product_name) => {
    try {

      function replaceImageUrl(originalUrl) {
        const imageName = originalUrl.split('/').pop(); // Extrait le nom de l'image de l'URL originale.
        return `https://droidsoft.fr/images_smartphones/${imageName}`; // Construit la nouvelle URL avec le domaine souhaité.
      }

      const modifiedImageUrl = replaceImageUrl(productData.img);
      
      const productResponse = await axios.get(`${PHONE_API_URL}/api/devices/details/${product_name}`, { headers });
      const specResponse = await axios.get(`${PHONE_API_URL}/api/devices/specs/${product_name}`, { headers });
      
      // Check Error
      if (productResponse.data.error) {
        console.error(`Erreur lors de la récupération des données de l'API: ${productResponse.data.error}`);
        return null;
      }
      if (specResponse.data.error) {
        console.error(`Erreur lors de la récupération des données de l'API: ${specResponse.data.error}`);
        return null;
      }

      const productData = productResponse.data[0];
      const specData = specResponse.data;

      // Format specData into a string that can be included in the GPT prompt
      let specDataString = '';
      for (let category in specData) {
        specDataString += `\n${category}:\n`;
        for (let spec of specData[category]) {
          specDataString += `${spec.name}: ${spec.value}\n`;
        }
      }

      let todayIs = new Date();
      // Demande à GPT de générer une description en français du produit en 800 mots et le nom du produit en gras (<strong> tag) en utilisant les données suivantes de la page produit:
      let prompt = `Génére une description en français en 1000 mots, et en un seul paragraphe que tu découperas juste en trois sous paragraphes pour un produit tech. Ne commence pas chaque paragraphe par le nom du produit, ne te répéte pas dans ta rédaction. Dans ces sous-paragraphes que tu génèreras, pense à mettre le nom du produit, et les informations importantes au sein du texte en gras avec la balise <strong> et </strong> et surtout pas avec **. Fais des retours à la ligne entre les paragraphes pour aérer le texte. Et fait cette description en utilisant les données suivantes de la page produit:\n\n Nom du produit : ${product_name}\n\n Description du produit : ${specDataString} La date d'aujourd'hui est : ${todayIs}`;

      const maxTokens = 1000;
      const description = await askGPT(prompt, maxTokens);

      const relatedArticle = await fetchTestArticle(product_name);
      const reviewRating = relatedArticle ? await getReviewRating(relatedArticle.url) : null;
      const AmazonCode = relatedArticle ? await getAmazonCode(relatedArticle.url) : null;
      const reviewId = reviewRating ? relatedArticle.id : null;

      const html = `
      <div>
          <p>${productData.description_french}
          <h2>Ce qu'il faut savoir sur le ${productData.title}</h2>
          <p>${description}</p>
          <hr class="wp-block-separator">
          <div style="display: flex; flex-wrap: wrap; align-items: flex-start; gap: 10px;">
            <div style="flex-grow: 1; min-width: 120px; max-width: 100%;">
              <div style="position: relative;">
                <img src="${modifiedImageUrl}" alt="${translate(productData.title)}" style="width: 100%; display: block;">
                ${reviewRating !== null ? `<div style="position: absolute; top: 0; right: 0; background-color: #31AD6E; border-radius: 5px; padding: 3px 6px; color: #FFFFFF;">${reviewRating.toFixed(1)}/10</div>` : ''}
              </div>
            </div>
            ${productData.id !== null ? `<div style="flex-grow: 2; min-width: 240px; width: 100%;">[price-history id="${productData.id}"]</div>` : ''}
          </div>
          <div class="wp-block-buttons is-content-justification-center is-layout-flex wp-container-1 wp-block-buttons-is-layout-flex">
            ${relatedArticle !== null ? `<div class="wp-block-button"><a class="wp-block-button__link has-vivid-green-cyan-background-color has-background wp-element-button" href="${relatedArticle.url}">Lire le test du ${productData.title}</a></div>` : ''}
          </div>
          <p></p>
          ${productData.title !== null ? `<p>[kelkoo-box product_name="${productData.title}"]</p>` : ''}
          ${AmazonCode ? `<p>[amazon box="${AmazonCode}"]</p>` : ''}
          
                    ${Object.entries(specData)
            .map(
              ([category, specs]) => 
                category !== '' ? `
                  <figure class="wp-block-table">
                      <h2>${translate(category)}</h2>
                      <table>
                          <tbody>
                              ${specs
                                .map(
                                  ({ name, value }) =>
                                    (name && value)
                                      ? `
                                        <tr>
                                            <td>${translate(name)}</td>
                                            <td>${translate(value)}</td>
                                        </tr>
                                        `
                                      : '',
                                )
                                .join('')
                              }
                          </tbody>
                      </table>
                  </figure>
                  ` : ''
            )
            .join('')}    
            ${reviewId ? `<p>[wp-review id="${reviewId}"]</p>` : ''}
      </div>
  `;
  
    return html;
  } catch (error) {
    console.error(error);
  }
};

module.exports = generateHtml;
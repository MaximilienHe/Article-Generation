const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const urlLib = require('url'); 

const getAmazonCode = async (url) => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const offerBox = dom.window.document.querySelector(".dn-offer-amz");
    
    const amazonUrl = offerBox ? offerBox.querySelector("a").href : null;
    if (!amazonUrl) {
      console.error("Aucun lien Amazon trouvé");
      return null;
    }

    // Utilisez l'URL lib pour analyser l'URL et obtenir le chemin, qui contient le code
    const pathName = urlLib.parse(amazonUrl).pathname;
    const amazonCode = pathName ? pathName.split('/')[2] : null;

    return amazonCode;
  } catch (error) {
    console.error("Erreur lors de la récupération du code Amazon :", error);
    return null;
  }
};

module.exports = getAmazonCode;

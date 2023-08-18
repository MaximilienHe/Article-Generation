const axios = require("axios");
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const getReviewRating = async (url) => {
  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data);
    const reviewTotalBox =
      dom.window.document.querySelector(".review-total-box");
    const divContent = reviewTotalBox
      ? reviewTotalBox.querySelector("div").innerHTML
      : null;
    return divContent ? parseFloat(divContent.trim()) : null;
  } catch (error) {
    console.error("Erreur lors de la récupération de la note :", error);
    return null;
  }
};

module.exports = getReviewRating;
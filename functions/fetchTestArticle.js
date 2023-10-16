const he = require('he');
const { WORDPRESS_GET_API_URL } = require("../constants");

const fetchTestArticle = async (product_name) => {
  // Handle '4G', '5G' and '+'
  if (product_name.endsWith("4G") || product_name.endsWith("5G"))
    product_name = product_name.slice(0, -2);

  let plusIncluded = false;

  // Check if product_name included '+'
  if (product_name.includes("+")) {
    product_name = product_name.replace("+", "");
    plusIncluded = true;
  }

  const response = await fetch(
    `${WORDPRESS_GET_API_URL}/wp-json/wp/v2/search?search="Test - ${encodeURIComponent(
      product_name
    )}"`
  );
  // Check Error
  if (!response.ok) {
    console.error(
      `Erreur lors de la récupération des données de l'API: ${response.statusText}`
    );
    return null;
  }
  const data = await response.json();

  // Use regex to extract product name
  const regex = /([^,:]+)/i;

  // Function to generate potential product name variations
  const generateVariations = (name) => {
    const numberAtEnd = name.match(/(\d)$/); // Check if ends with a digit
    if (numberAtEnd) {
      const base = name.slice(0, -1).trim(); // Remove the last digit
      return [name, `${base} ${numberAtEnd[1]}`]; // Return both versions
    }
    return [name];
  };

  const possibleProductNames = generateVariations(product_name);

  // Loop through all data
  for (let item of data) {
    let title = he.decode(item.title).replace("TEST –", "").trim(); // remove 'TEST –' manually
    title = title.replace("Test –", "").trim(); // remove 'Test –' manually
    const match = title.match(regex);
    const productNameFromTitle = match ? match[1].trim() : null;

    if (productNameFromTitle) {
      // If "+" was originally included in the product_name, test both with '+' and 'Plus'
      if (
        plusIncluded &&
        (productNameFromTitle === product_name ||
          productNameFromTitle === `${product_name}+` ||
          productNameFromTitle === `${product_name} Plus`)
      ) {
        return item;
      }
      // Check for matches in possibleProductNames array
      else if (possibleProductNames.includes(productNameFromTitle)) {
        return item;
      }
    }
  }

  // Return null if no exact match found
  return null;
};

module.exports = fetchTestArticle;

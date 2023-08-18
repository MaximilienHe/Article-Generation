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
  console.log(
    "URL : " +
      `${WORDPRESS_GET_API_URL}/wp-json/wp/v2/search?search="Test - ${encodeURIComponent(
        product_name
      )}"`
  );
  const data = await response.json();

  // Use regex to extract product name
  const regex = /([^,:]+)/i;

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
      // Else just test the product_name
      else if (productNameFromTitle === product_name) {
        return item;
      }
    }
  }

  // Return null if no exact match found
  return null;
};

module.exports = fetchTestArticle;
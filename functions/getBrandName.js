const getBrandName = (productName) => {
  return productName.split(" ")[0];
};

module.exports = getBrandName;
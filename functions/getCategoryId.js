async function getCategoryId(brandName) {
  // l'URL de l'API
  const url = "https://droidsoft.fr/wp-json/wp/v2/categories?per_page=100";

  try {
    // utilisez Fetch pour récupérer les données de l'API
    const response = await fetch(url);
    const data = await response.json();

    // recherchez la catégorie avec le nom de la marque et parent "2653"
    // Si la brandName = "Sony", alors l'id à renvoyer est 2705
    if (!brandName) {
      return null;
    }
    if (brandName.toLowerCase() === "sony") {
      return 2705;
    }
    let category = data.find(
      (c) =>
        c.name.toLowerCase() === brandName.toLowerCase() && c.parent === 2653
    );

    // si la catégorie est trouvée, renvoyez l'ID de la catégorie
    if (category) {
      return category.id;
    }

    // sinon, renvoyez l'ID de la catégorie "Fiches techniques"
    else {
      category = data.find(
        (c) => c.slug === "fiche-techniques" && c.parent === 0
      );
      if (category) {
        return category.id;
      }
    }
  } catch (error) {
    console.log(
      "Il y a eu un problème avec l'opération fetch: " + error.message
    );
  }

  // renvoyer null si rien n'est trouvé
  return null;
}

module.exports = getCategoryId;
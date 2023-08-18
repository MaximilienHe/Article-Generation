// Fonction pour obtenir une pause aléatoire entre 1 et 5 minutes
function getRandomPause() {
  // Math.random() renvoie une valeur entre 0 (inclus) et 1 (exclus)
  // Nous multiplions par 5 et ajoutons 1 pour obtenir une valeur entre 1 et 5
  return 1 + Math.random() * 4;
}

module.exports = getRandomPause;
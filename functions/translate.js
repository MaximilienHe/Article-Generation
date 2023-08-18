const translate = (text) => {
  // Ajoutez vos traductions ici
  const translations = {
    Network: "Réseau",
    Battery: "Batterie",
    Display: "Écran",
    Camera: "Appareil photo",
    Launch: "Lancement",
    Body: "Design",
    Platform: "Plateforme",
    Memory: "Mémoire",
    "Main Camera": "Appareil photo principal",
    "Selfie camera": "Appareil photo frontal",
    Sound: "Son",
    Comms: "Communications",
    Features: "Fonctionnalités",
    Misc: "Divers",
    Technology: "Technologie",
    "2G bands": "Bandes 2G",
    "3G bands": "Bandes 3G",
    "4G bands": "Bandes 4G",
    "5G bands": "Bandes 5G",
    Speed: "Vitesse",
    Announced: "Annoncé",
    Status: "Statut",
    Dimensions: "Dimensions",
    Weight: "Poids",
    Build: "Construction",
    SIM: "SIM",
    Type: "Type",
    Size: "Taille",
    Resolution: "Résolution",
    Protection: "Protection",
    Ratio: "Ratio",
    OS: "Système d'exploitation",
    Chipset: "Chipset",
    CPU: "Processeur",
    GPU: "Processeur graphique",
    "Card slot": "Emplacement carte mémoire",
    Internal: "Mémoire interne",
    Single: "Simple",
    Dual: "Double",
    Triple: "Triple",
    Quad: "Quadruple",
    Five: "Quintuple",
    Features: "Fonctionnalités",
    Video: "Vidéo",
    Loudspeaker: "Haut-parleur",
    "3.5mm jack": "Prise jack 3.5mm",
    WLAN: "Wi-Fi",
    Bluetooth: "Bluetooth",
    GPS: "GPS",
    Positionning: "Positionnement",
    NFC: "NFC",
    Radio: "Radio",
    USB: "USB",
    Sensors: "Capteurs",
    Charging: "Charge",
    Models: "Modèles",
    Price: "Prix",
    Colors: "Couleurs",
    SAR: "DAS",
    "SAR EU": "DAS UE",
    AddedData: "Fiche technique en résumé",
    Single: "Simple",
    Dual: "Double",
    Triple: "Triple",
    Quad: "Quadruple",
    Five: "Quintuple",
    Glass: "Verre",
    glass: "Verre",
    Plastic: "Plastique",
    Aluminium: "Aluminium",
    Ceramic: "Céramique",
  };
  return translations[text] || text;
};

module.exports = translate;
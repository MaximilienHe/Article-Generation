import pandas as pd

# Lecture des données depuis le fichier Excel
smartphones_df = pd.read_excel("C:/Users/maxim/OneDrive/Documents/COURS/BUT2/Stage/Article Generation/list_reviews.xlsx")
smartphones = list(smartphones_df.itertuples(index=False, name=None))

# Trier la liste de smartphones par nom et prix en ordre décroissant
smartphones.sort(key=lambda x: (x[0], -x[2]))

comparisons = []
previous_smartphone = None

# Boucle sur chaque smartphone
for smartphone in smartphones:
    smartphone_name, id, price = smartphone

    # Vérifie si le smartphone actuel est une génération suivante du smartphone précédent
    if previous_smartphone and smartphone_name.split(' ')[0] == previous_smartphone[0].split(' ')[0] and smartphone_name.split(' ')[-1].isdigit() and previous_smartphone[0].split(' ')[-1].isdigit() and int(smartphone_name.split(' ')[-1]) - int(previous_smartphone[0].split(' ')[-1]) == 1:
        # Ajoute une comparaison d'évolution
        comparisons.append((f"Comparatif - Quelles sont les évolutions entre {smartphone_name} et {previous_smartphone[0]} ?", id, smartphone_name, previous_smartphone[1], previous_smartphone[0]))
    else:
        # Boucle sur chaque paire de smartphones
        for other_smartphone in smartphones:
            other_smartphone_name, other_id, other_price = other_smartphone

            # Vérifie si les smartphones sont différents
            if smartphone_name != other_smartphone_name:
                # Calcule l'écart de prix en pourcentage
                price_diff = abs(price - other_price) / ((price + other_price) / 2) * 100

                # Vérifie si les smartphones peuvent être comparés
                if price_diff <= 20 or \
                   ("Razr" in smartphone_name and "Razr" in other_smartphone_name) or \
                   ("Flip" in smartphone_name and "Flip" in other_smartphone_name) or \
                   ("Pocket" in smartphone_name and "Pocket" in other_smartphone_name):
                    # Ajoute une comparaison de meilleur smartphone
                    comparisons.append((f"Comparatif - Quel est le meilleur smartphone entre {smartphone_name} et {other_smartphone_name} ?", id, smartphone_name, other_id, other_smartphone_name))

    previous_smartphone = smartphone

# Convertir la liste de comparaisons en DataFrame
df = pd.DataFrame(comparisons, columns=["Nom du comparatif", "ID WordPress Smartphone 1", "Nom Smartphone 1", "ID WordPress Smartphone 2", "Nom Smartphone 2"])

# Exporter le DataFrame en fichier Excel
df.to_excel("C:/Users/maxim/OneDrive/Documents/COURS/BUT2/Stage/Article Generation/comparaisons_smartphones.xlsx", index=False)

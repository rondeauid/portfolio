# Portfolio — Inès Rondeau

Portfolio UX / UI · Product Designer Senior.
Site statique en HTML / CSS / JS vanilla — aucune dépendance, aucun build.

## Structure

```
index.html                         Page d'accueil
projet-1-portail-info.html         Étude de cas — Portail info (TF1)
projet-2-jade.html                 Étude de cas — Jade+
projet-3-msc.html                  Étude de cas — Media Supply Chain
projet-4-repertoire-donnees.html   Étude de cas — Répertoire de données
cv-ines-rondeau.html               CV
styles.css                         Feuille de style partagée
reveal.js                          Apparition des éléments au scroll
lightbox.js                        Agrandissement des visuels au clic
assets/                            Images des projets
```

## Lancer en local

Aucune installation requise — ouvrir `index.html` dans un navigateur.
Pour servir via un petit serveur local :

```bash
python3 -m http.server
# puis ouvrir http://localhost:8000
```

## Déploiement (GitHub Pages)

1. Pousser ces fichiers à la racine d'un dépôt GitHub.
2. **Settings → Pages → Build and deployment**, source : `Deploy from a branch`.
3. Brancher sur `main`, dossier `/ (root)`, puis enregistrer.

Le site sera publié sur `https://<utilisateur>.github.io/<dépôt>/`.

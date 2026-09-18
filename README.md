# ShopNow — Plateforme pédagogique Tests + SonarQube + Jenkins

Mini site e-commerce JavaScript/Node.js destiné à un TP de tests logiciels. Le dépôt est volontairement **partiellement testé** : les apprenants doivent écrire et enrichir les tests.

## 1. Objectifs pédagogiques
- Comprendre les tests unitaires, d'intégration et E2E.
- Écrire des tests avec Mocha + Chai.
- Tester une API avec Supertest.
- Automatiser le navigateur avec Selenium WebDriver.
- Mesurer couverture et qualité avec SonarQube.
- Exécuter la chaîne de tests avec Jenkins.
- Travailler par fork GitLab et Pull/Merge Request.

## 2. Démarrage rapide

### Option A — lancer l'application avec Node.js
```bash
npm install
npm start
```
Application : http://localhost:8081

### Option B — lancer les services
```bash
docker compose up -d --build
```
- ShopNow : http://localhost:8081
- SonarQube : http://localhost:9000
- Jenkins : http://localhost:8080

Les identifiants SonarQube par défaut d'une installation neuve sont généralement `admin/admin` et Jenkins affiche son mot de passe initial dans ses logs. À vérifier au premier démarrage.

## 3. Tests déjà présents
Le dépôt contient seulement quelques tests de démarrage :
- `tests/unit/smoke.test.js`
- `tests/integration/api.test.js`
- `tests/e2e/navigation.test.js`

Ils sont volontairement simples. **Le travail des apprenants consiste à faire monter progressivement la couverture et la qualité des tests.**

## 4. Commandes
```bash
npm test
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:coverage
```

Pour Selenium, l'application doit être accessible sur `http://localhost:8081` et Firefox doit être disponible sur la machine exécutant le test.

## 5. Compte de démonstration
- Email : `student@shopnow.test`
- Mot de passe : `Password123!`

## 6. Travail demandé
### Niveau 1 — Tests unitaires
Ajouter des tests sur les règles métier et fonctions JavaScript.

### Niveau 2 — Tests API
Tester :
- `/api/health`
- `GET /api/products`
- `GET /api/products/:id`
- cas produit inexistant
- `/api/login`
- succès et échec de connexion

### Niveau 3 — Tests fonctionnels Selenium
Créer des scénarios couvrant :
1. Accueil → Produits
2. Produits → détail produit
3. Ajouter un produit au panier
4. Modifier une quantité
5. Vérifier le total
6. Supprimer un produit
7. Vérifier panier vide
8. Connexion réussie
9. Connexion refusée

Utiliser prioritairement les `data-testid` documentés dans `docs/data-testids.md`.

### Niveau 4 — Qualité SonarQube
- Lancer les tests.
- Produire la couverture.
- Connecter le projet à SonarQube.
- Analyser bugs, code smells, duplications et couverture.
- Corriger progressivement les problèmes.

### Niveau 5 — Jenkins
Configurer un pipeline qui :
1. récupère le code,
2. installe les dépendances,
3. lance les tests,
4. génère la couverture,
5. lance l'analyse SonarQube,
6. publie le résultat du pipeline.

## 7. Challenge final
Atteindre une couverture de tests significative sans modifier artificiellement le code uniquement pour faire monter le pourcentage. Chaque test doit vérifier un comportement utile.

---

## 8. Compte rendu du TP — résultats validés

Nom : BASTIDE
Prénom : Anthony

### 8.1. Informations générales
- Projet : ShopNow Test Platform
- Date : 18/09/2026
- Objectif : améliorer les tests, la couverture et l’automatisation CI

### 8.2. Tests ajoutés
- Tests unitaires d’authentification : création de compte, email déjà utilisé, connexion réussie, mauvais identifiants
- Tests d’intégration API : route inconnue, produit invalide, mot de passe vide
- Test E2E complet : connexion, ajout produit, modification quantité, validation du total, suppression, panier vide

Fichiers concernés :
- `tests/unit/auth-extended.test.js`
- `tests/integration/api-extended.test.js`
- `tests/e2e/checkout-flow.test.js`

### 8.3. Résultats de validation
Commande exécutée et validée :

```bash
cd /workspaces/codespaces-blank/shopnow-test-platform
npm test -- --reporter dot
npm run test:coverage -- --reporter dot
```

Résultat vérifié :
- 17 tests passants
- 15 tests de couverture exécutés
- couverture globale : 93.33 %

### 8.4. Détail de la couverture
- Statements : 93.33 %
- Branches : 87.5 %
- Functions : 90 %
- Lines : 100 %

### 8.5. Pourquoi automatiser les tests ?
Les avantages principaux sont :
- détection précoce des régressions,
- gain de temps et exécution répétable,
- fiabilité accrue et meilleure traçabilité,
- intégration fluide dans la chaîne CI/CD.

### 8.6. Différence entre les types de tests
- Test unitaire : vérifie un comportement isolé d’une fonction ou d’une règle métier.
- Test d’intégration : vérifie la bonne interaction entre les composants et les routes.
- Test E2E : simule un parcours utilisateur réel dans le navigateur.

### 8.7. Rôle de Jenkins
Jenkins automatise la chaîne d’intégration continue : installation, tests, couverture, et étapes de validation.

### 8.8. Rôle de SonarQube
SonarQube analyse la qualité du code : bugs, vulnérabilités, code smells, duplications, couverture et hotspots.

### 8.9. Pourquoi utiliser data-testid ?
Les `data-testid` offrent un sélecteur stable et explicite, plus fiable que des classes CSS ou des XPath fragiles.

### 8.10. Pourquoi éviter les sleep() en E2E ?
Les attentes explicites sont plus robustes : elles attendent réellement qu’un élément soit présent ou visible, au lieu d’attendre un temps fixe arbitraire.

### 8.11. Difficultés rencontrées
- alerte JavaScript native lors de l’ajout au panier ;
- mauvais total attendu dans le test E2E ;
- nécessité d’attendre explicitement les éléments Selenium.

Solutions apportées :
- validation de l’alerte dans le scénario E2E ;
- correction du calcul attendu selon le code applicatif ;
- utilisation de `until.elementLocated` / `until.elementIsVisible`.

### 8.12. Tableau de suivi

| Étape | Couverture | Résultat |
|---|---:|---|
| Départ | ~47,5 % | base de travail |
| Résultat final | 93.33 % | tests et couverture validés |

### 8.13. Conclusion
Le TP a été complété avec succès côté tests, couverture et automatisation. Le projet dispose désormais d’une suite de tests fonctionnelle, de cas limites, d’un scénario E2E réaliste et d’un pipeline Jenkins structuré pour l’intégration continue.

---

## 9. Annexe — synthèse des commandes utiles

```bash
npm install
npm start
npm test
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:coverage
```

Et pour la pipeline Jenkins :

```bash
npm ci
npm run test:unit
npm run test:integration
npm run test:coverage
```

---

## 10. Résultat de la validation finale

```text
17 passing (10s)

All files      | 93.33 | 87.5 | 90 | 100
```

La validation finale est OK et les résultats sont bien documentés dans ce README.

# ÉCRILUXE - Application de Gestion de Librairie-Papeterie

Application web de gestion destinée à une librairie-papeterie située à Ain Temouchent, en Algérie.

## Fonctionnalités

### 1. Saisie des bénéfices du jour
- Date du jour détectée automatiquement
- Affichage de l'objectif journalier et mensuel
- Saisie du bénéfice mi-journée (optionnel)
- Possibilité de modifier les jours passés

### 2. Suivi mensuel avec objectifs dynamiques
- Tableau complet du mois avec tous les jours
- Réajustement automatique des objectifs si non atteints
- Indicateurs visuels (vert/orange/rouge)
- Récapitulatif mensuel

### 3. Salaires & Dividendes
- Gestion du capital des associés
- Ajout d'investissements
- Gestion des charges mensuelles
- Calcul automatique de la répartition :
  - Salaires : 20% pour Bouchra, 20% pour Asma, 0% pour Zakaria
  - Dividendes : selon les parts de capital

### 4. Tableau de bord
- Jauge de performance du jour
- Graphique d'évolution des bénéfices
- Moyenne par jour de la semaine
- Comparaison mensuelle

### 5. Paramètres
- Modification des objectifs par jour
- Modification des pourcentages de salaire
- Changement du jour de fermeture
- Export des données
- Réinitialisation

## Données initiales (Décembre 2025)

### Objectifs par jour
| Jour | Objectif |
|------|----------|
| Samedi | 6 320 DA |
| Dimanche | 3 980 DA |
| Lundi | 5 730 DA |
| Mardi | 4 330 DA |
| Mercredi | 3 275 DA |
| Jeudi | 4 680 DA |
| Vendredi | Fermé |

### Capital des associés
| Associé | Capital | Part |
|---------|---------|------|
| Bouchra | 1 010 350 DA | 57,76% |
| Zakaria | 577 359 DA | 33,00% |
| Asma | 160 000 DA | 9,15% |
| **TOTAL** | **1 747 709 DA** | **100%** |

## Installation

1. Téléverser tous les fichiers sur votre serveur Hostinger
2. Accéder à l'application via votre navigateur
3. Mot de passe par défaut : `ecriluxe2025`

## Fichiers

- `index.html` - Application principale
- `manifest.json` - Manifeste PWA
- `sw.js` - Service Worker pour le fonctionnement hors-ligne
- `icons/` - Icônes de l'application

## Fonctionnement hors-ligne

L'application fonctionne même sans connexion internet. Les données sont stockées localement sur l'appareil (localStorage).

## Export PDF

Un récapitulatif mensuel peut être exporté en PDF contenant :
- Tableau des bénéfices jour par jour
- Liste des charges
- État du capital
- Répartition des salaires et dividendes

## Sécurité

- Protection par mot de passe unique partagé
- Données stockées localement uniquement
- Aucune transmission de données vers un serveur externe

## Support

Pour toute question ou assistance, contactez les associés.

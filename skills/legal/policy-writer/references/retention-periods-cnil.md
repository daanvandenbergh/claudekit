> Provenance: copied from cookie-policy-malik-taiar/references/DUREES_CONSERVATION.md (AGPL-3.0, author Malik Taiar) on 2026-07-05. Content in French - retention doctrine (GDPR Art 5.1.e) with CNIL reference tables by data category.
> Read when: building a retention table. HARD RULE: the published table uses the retention periods actually found in the codebase (TTLs, cascades, cron jobs), with this file as the doctrine to judge them against - never copy these reference figures into a policy as if they were the project's own.
> Some French statutory figures (e.g. LCEN log retention) are jurisdiction-specific - do not apply them outside France without verification.
> Verified: 2026-07-09 against live sources (L123-22 10-yr accounting, décret 2021-1362 connection-log periods, and CNIL reference tables re-derived from Légifrance/CNIL, all unchanged; loi SREN 2024-449 renumbered LCEN art. 6 but the article-level citation stays accurate — see the nuance block below). Re-verify if older than 12 months.

# Durées de Conservation des Données

> Référence : Article 5.1.e du RGPD (limitation de la conservation)
> **Documentation** : [CNIL_durees_conservation.pdf](assets/sources/CNIL_durees_conservation.pdf)

## Principe fondamental

Le RGPD impose que les données personnelles soient conservées pendant une durée **limitée** et **proportionnée** à la finalité du traitement. Au-delà, les données doivent être supprimées ou anonymisées.

> **Article 5.1.e RGPD** : Les données sont « conservées sous une forme permettant l'identification des personnes concernées pendant une durée n'excédant pas celle nécessaire au regard des finalités pour lesquelles elles sont traitées »

---

## Les 3 phases de conservation

### 1. Base active

**Définition** : Données accessibles en temps réel pour les besoins opérationnels courants.

**Exemple** : Compte client actif, commande en cours de traitement.

### 2. Archivage intermédiaire

**Définition** : Données non utilisées au quotidien mais conservées pour des besoins administratifs, juridiques ou de preuve.

**Accès restreint** : Seules les personnes habilitées y ont accès.

**Exemple** : Factures d'un client ayant clôturé son compte.

### 3. Archivage définitif (rare)

**Définition** : Conservation pérenne pour des raisons d'intérêt public (archives historiques, recherche scientifique).

**Encadrement** : Conditions strictes, généralement hors contexte commercial.

---

## Tableau des durées de conservation par catégorie

### Données clients / prospects

| Type de données | Durée de conservation | Base légale / Justification |
|-----------------|----------------------|----------------------------|
| **Compte client actif** | Durée de la relation commerciale | Exécution du contrat |
| **Compte client inactif** | 3 ans après dernière activité | Prospection (intérêt légitime) |
| **Prospects (non clients)** | 3 ans après dernier contact | Recommandation CNIL |
| **Données de contact newsletter** | Jusqu'au désabonnement + 3 ans | Preuve du consentement |
| **Historique des commandes** | 5 ans (prescription civile) | Protection juridique |

### Données de paiement / Comptabilité

| Type de données | Durée de conservation | Base légale / Justification |
|-----------------|----------------------|----------------------------|
| **Factures** | 10 ans | Obligation légale (Code de commerce L123-22) |
| **Pièces comptables** | 10 ans | Obligation légale (CGI) |
| **Données de paiement (CB)** | Le temps de la transaction | Sécurité / PCI-DSS |
| **Preuves de transaction** | 5 ans | Prescription civile |
| **Mandats SEPA** | 5 ans après fin du mandat | Recommandation CNIL |

### Données RH / Salariés

| Type de données | Durée de conservation | Base légale / Justification |
|-----------------|----------------------|----------------------------|
| **Dossier du salarié actif** | Durée du contrat | Exécution du contrat |
| **Dossier après départ** | 5 ans | Prescription en droit du travail |
| **Bulletins de paie** | 5 ans (employeur) / 50 ans (Archives) | Obligation légale |
| **Candidatures non retenues** | 2 ans | Recommandation CNIL |
| **Candidatures avec consentement** | Durée du consentement (max 2 ans) | Consentement |

### Données de connexion / Logs

| Type de données | Durée de conservation | Base légale / Justification |
|-----------------|----------------------|----------------------------|
| **Logs de connexion (FAI/hébergeur)** | 1 an | LCEN art. 6 + CPCE art. L34-1 + décret n° 2021-1362 |
| **Logs applicatifs (sécurité)** | 6 mois à 1 an | Intérêt légitime (sécurité) |
| **Adresses IP** | 1 an | Décret n° 2021-1362 (données techniques) |
| **Données de trafic** | 1 an | Décret n° 2021-1362 (certaines catégories sur injonction du Premier ministre uniquement) |

> **Nuance** : le « 1 an LCEN » uniforme est une simplification. Le décret n° 2021-1362 du
> 20 octobre 2021 (pris pour l'application de l'art. L34-1 du CPCE et de l'art. 6 de la LCEN)
> étage la conservation : identité civile **5 ans** après la fin du contrat/clôture du compte ;
> autres informations de compte et de paiement **1 an** ; données techniques de connexion (IP,
> identifiants) **1 an** - et certaines données de trafic ne sont conservées que sur injonction
> du Premier ministre (sécurité nationale). Vérifier la catégorie exacte avant de publier une
> durée. [Source: https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000044228912, accessed 2026-07-06]

### Cookies et traceurs

> **LIRE LA SOURCE** : `assets/sources/CNIL_recommandation_cookies_et_traceurs.pdf` + https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies

| Type de données | Durée CNIL | Base légale / Justification |
|-----------------|------------|----------------------------|
| **Choix de l'utilisateur (consentement ou refus)** | **6 mois** (bonne pratique, à apprécier au cas par cas) | Recommandation CNIL 2020, pt 39 |
| **Traceurs de mesure d'audience exemptés** | Durée de vie 13 mois (non prorogée aux nouvelles visites), données conservées 25 mois max | Recommandation CNIL 2020, pt 50 |
| **Cookies (autres)** | Proportionnée à la finalité (pas de plafond général chiffré dans les textes 2020) | Lignes directrices CNIL 2020 |

> **IMPORTANT** : La CNIL considère que conserver le choix (tant le consentement que le refus)
> pendant **6 mois** constitue une bonne pratique. Aucun plafond général de « 13 mois maximum »
> ne figure dans la recommandation 2020 (version consolidée publiée le 16 janvier 2026) : les
> 13 mois / 25 mois y concernent les traceurs de mesure d'audience exemptés.
> [Source: https://www.cnil.fr/sites/default/files/2026-01/recommandation_cookies_consolidee.pdf
> (pts 38-39 et 50), accessed 2026-07-06]

### Données de santé (si applicable)

| Type de données | Durée de conservation | Base légale / Justification |
|-----------------|----------------------|----------------------------|
| **Dossier médical** | 20 ans après dernière consultation | Code de la santé publique |
| **Données de santé au travail** | 40 ans | Médecine du travail |

### Données contractuelles

| Type de données | Durée de conservation | Base légale / Justification |
|-----------------|----------------------|----------------------------|
| **Contrats** | 5 ans après fin du contrat | Prescription civile |
| **Contrats avec consommateurs** | 5 ans | Prescription |
| **Garanties** | Durée de la garantie + 2 ans | Action en justice |
| **Contentieux** | Jusqu'à épuisement des voies de recours | Protection juridique |

### Données de vidéosurveillance

| Type de données | Durée de conservation | Base légale / Justification |
|-----------------|----------------------|----------------------------|
| **Images de vidéosurveillance** | 1 mois maximum | Code de la sécurité intérieure |
| **En cas d'incident** | Durée de la procédure | Preuve |

---

## Obligations légales de conservation

### Textes de référence

| Obligation | Durée | Texte |
|------------|-------|-------|
| Documents comptables | 10 ans | Code de commerce L123-22 |
| Factures | 10 ans | Code général des impôts |
| Logs de connexion | 1 an (données techniques) / 5 ans (identité civile) | LCEN art. 6 + CPCE L34-1 + décret n° 2021-1362 (cf. nuance ci-dessus) |
| Bulletins de paie | 5 ans | Code du travail |
| Contrats électroniques B2C > 120€ | 10 ans | Code de la consommation |
| Vidéosurveillance | 1 mois | Code de la sécurité intérieure |

---

## Bonnes pratiques

### 1. Définir une politique de conservation

Documenter pour chaque catégorie de données :
- La durée de conservation
- La justification (finalité, obligation légale)
- La procédure d'archivage/suppression

### 2. Automatiser la purge

```
Mettre en place des processus automatiques :
- Alerte avant suppression (si pertinent)
- Suppression automatique à échéance
- Anonymisation en alternative à la suppression
- Journalisation des suppressions
```

### 3. Distinguer les phases

```
BASE ACTIVE (accès courant)
    │
    │ [Fin de la relation]
    ▼
ARCHIVE INTERMÉDIAIRE (accès restreint)
    │
    │ [Fin de la durée légale]
    ▼
SUPPRESSION ou ANONYMISATION
```

### 4. Informer dans la politique

Toujours indiquer les durées de conservation dans la politique de confidentialité, avec une justification compréhensible.

---

## Formulation pour la politique

```
6. COMBIEN DE TEMPS CONSERVONS-NOUS VOS DONNÉES ?

Nous conservons vos données personnelles uniquement le temps nécessaire aux
finalités pour lesquelles elles ont été collectées, ou pour respecter nos
obligations légales.

┌─────────────────────────────────────────────────────────────────────────┐
│ Type de données           │ Durée              │ Justification          │
├───────────────────────────┼────────────────────┼────────────────────────┤
│ Compte client             │ Durée de la        │ Fourniture du service  │
│                           │ relation + 3 ans   │                        │
├───────────────────────────┼────────────────────┼────────────────────────┤
│ Données de commande       │ 5 ans              │ Obligations légales    │
│                           │                    │ et garanties           │
├───────────────────────────┼────────────────────┼────────────────────────┤
│ Factures                  │ 10 ans             │ Obligations comptables │
├───────────────────────────┼────────────────────┼────────────────────────┤
│ Données de newsletter     │ Jusqu'au           │ Votre consentement     │
│                           │ désabonnement      │                        │
├───────────────────────────┼────────────────────┼────────────────────────┤
│ Données de connexion      │ 1 an               │ Obligation légale      │
│                           │                    │ (LCEN)                 │
├───────────────────────────┼────────────────────┼────────────────────────┤
│ Choix cookies             │ 6 mois             │ Bonne pratique CNIL    │
├───────────────────────────┼────────────────────┼────────────────────────┤
│ Prospects                 │ 3 ans sans         │ Prospection            │
│                           │ interaction        │ commerciale            │
└───────────────────────────┴────────────────────┴────────────────────────┘

À l'issue de ces durées, vos données sont supprimées ou anonymisées de
manière irréversible.
```

---

## Erreurs fréquentes

| Erreur | Conséquence | Solution |
|--------|-------------|----------|
| Pas de durée définie | Non-conformité RGPD | Tableau systématique |
| Conservation illimitée | Sanction CNIL | Purge automatique |
| Même durée pour tout | Disproportionné | Adapter par finalité |
| Pas de distinction actif/archive | Accès non maîtrisé | Phases de conservation |
| Oubli des obligations légales | Problème en cas de contrôle | Conserver les factures 10 ans |
| Suppression sans journalisation | Pas de preuve de conformité | Logs de suppression |

---

## Cas particuliers

### Données anonymisées

Les données véritablement anonymisées (identification impossible, même par recoupement) ne sont plus des données personnelles et peuvent être conservées sans limite.

**Attention** : La pseudonymisation n'est PAS l'anonymisation.

### Droit à l'effacement demandé

Si une personne demande l'effacement :
- Supprimer les données de la base active
- Conserver si obligation légale (factures, logs)
- Informer la personne des données conservées et pourquoi

### Contentieux en cours

En cas de litige, les données pertinentes peuvent être conservées jusqu'à l'issue de la procédure, y compris au-delà de la durée normale.

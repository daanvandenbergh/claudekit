> Provenance: copied from cookie-policy-malik-taiar/references/BASES_LEGALES_COOKIES.md (AGPL-3.0, author Malik Taiar) on 2026-07-05. Content in French - cookie-specific legal bases under ePrivacy/CNIL.
> Read when: deciding whether a cookie is consent-exempt (strictly necessary vs consent-required), validating consent conditions, or reasoning about a no-banner exemption.
> Contains the exemption tables (e.g. analytics exemption criteria) - the load-bearing source for any banner decision.
> Verified: 2026-07-09 against live sources (exemption conditions re-derived; the "droit d'opposition" UNVERIFIED flag resolved — it is not an art. 82 exemption condition but remains a mandatory RGPD art. 21 obligation for exempted analytics). Re-verify if older than 12 months.

# Bases Légales des Cookies et Traceurs

> Référence : Directive ePrivacy (2002/58/CE) + RGPD (Art. 6) + Lignes directrices CNIL 2020
> **Documentation** : [RGPD_texte_officiel.pdf](assets/sources/RGPD_texte_officiel.pdf), [CNIL_transparence.pdf](assets/sources/CNIL_transparence.pdf)

## Vue d'ensemble

Le dépôt de cookies et traceurs est régi par deux textes complémentaires :
- **Directive ePrivacy** : règle le consentement pour l'accès à l'appareil de l'utilisateur
- **RGPD** : s'applique dès que des données personnelles sont collectées via les cookies

Le principe : **consentement préalable obligatoire**, sauf exceptions limitées.

---

## Principe général : le consentement (Art. 82 Loi Informatique et Libertés)

### Définition

Avant de déposer des cookies non essentiels, l'éditeur doit :
1. **Informer** l'utilisateur de la finalité des cookies
2. **Obtenir son consentement** préalable
3. **Permettre un refus aussi simple que l'acceptation**

### Conditions de validité du consentement (CNIL 2020)

| Critère | Exigence |
|---------|----------|
| **Libre** | Pas de cookie wall strict, alternative proposée |
| **Spécifique** | Par finalité (analytics, pub, réseaux sociaux...) |
| **Éclairé** | Information claire sur les cookies et leurs finalités |
| **Univoque** | Acte positif (clic sur "Accepter"), pas de silence ou pré-cochage |
| **Préalable** | AVANT le dépôt du cookie |

### Ce qui n'est PAS un consentement valide

```
❌ Continuer à naviguer = acceptation
❌ Case pré-cochée
❌ Bannière sans bouton "Refuser"
❌ Bouton "Refuser" caché ou moins visible
❌ "En continuant, vous acceptez..." sans action requise
❌ Cookie wall sans alternative
```

---

## Exception : cookies exemptés de consentement

### Critères d'exemption (Art. 82 al. 2)

Un cookie est exempté de consentement s'il est **strictement nécessaire** :
- À la fourniture du service demandé par l'utilisateur
- OU à la transmission de la communication

### Cookies exemptés

| Type | Exemples | Justification |
|------|----------|---------------|
| **Session** | `session_id`, `PHPSESSID` | Maintien de la connexion |
| **Authentification** | `auth_token`, `jwt` | Identification de l'utilisateur |
| **Panier** | `cart`, `basket` | Mémorisation des achats |
| **Sécurité** | `csrf_token`, `__Host-` | Protection contre les attaques |
| **Préférences utilisateur** | `lang`, `theme` | Personnalisation demandée |
| **Choix cookies** | `cookie_consent` | Mémorisation du consentement |
| **Load balancer** | `SERVERID` | Répartition de charge |

### Cookies NON exemptés (consentement requis)

| Type | Exemples | Pourquoi non exempté |
|------|----------|----------------------|
| **Analytics** | `_ga`, `_gid`, `_gat` | Mesure d'audience ≠ service demandé |
| **Publicité** | `_fbp`, `IDE`, `fr` | Profilage publicitaire |
| **Réseaux sociaux** | Boutons partage, embeds | Suivi cross-site |
| **Personnalisation pub** | Retargeting, remarketing | Finalité commerciale |

---

## Cas particulier : Analytics exempté

### Conditions strictes (CNIL)

Un cookie analytics peut être exempté de consentement SI :

```
✅ Finalité strictement limitée à la seule mesure d'audience du site ou de
   l'application, pour le compte exclusif de l'éditeur
✅ Production de statistiques anonymes uniquement
✅ Pas de recoupement avec d'autres traitements
✅ Pas de transmission de données à des tiers
✅ Pas de suivi global de la navigation sur d'autres sites ou applications
✅ Durée de vie limitée à 13 mois (non prorogée aux nouvelles visites) ;
   données conservées 25 mois maximum
✅ Information de l'utilisateur (ex: politique de confidentialité)
```

[Source: https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies-solutions-pour-les-outils-de-mesure-daudience + lignes directrices 2020 (délibération n° 2020-091, pts 50-51) + recommandation 2020 consolidée (pt 50), accessed 2026-07-06]

> NB (VÉRIFIÉ 2026-07-09) : un « droit d'opposition » n'est PAS l'une des conditions d'exemption de
> l'art. 82 LIL (les lignes directrices 2020-091, pts 50-52, n'en listent que quatre ; le terme
> « opposition » n'y figure pas). MAIS il ne faut pas le supprimer : la mesure d'audience exemptée
> repose sur l'intérêt légitime (art. 6.1.f RGPD, cf. tableau ci-dessous), ce qui rend obligatoire un
> mécanisme d'opposition facilement accessible (droit d'opposition, art. 21 RGPD) — obligation RGPD
> distincte, située un cran EN DESSOUS des conditions d'exemption de l'art. 82, à ne pas confondre avec
> elles. [Sources : conditions d'exemption — délibération 2020-091 pts 50-52 ; obligation d'opposition —
> art. 21 RGPD sur base art. 6.1.f]

### Google Analytics : NON exempté

Google Analytics ne remplit PAS ces conditions car :
- Données transférées à Google (tiers)
- Possibilité de recoupement avec autres services Google
- Identifiants utilisateur persistants

### Matomo : peut être exempté

Matomo (ex-Piwik) peut être configuré en mode exempté :
- Hébergement interne (pas de transfert)
- Anonymisation IP
- Pas de cookies persistants
- Pas de recoupement

---

## Tableau récapitulatif par type de cookie

| Type de cookie | Consentement | Base légale | Notes |
|----------------|--------------|-------------|-------|
| Session | **Non requis** | Exécution contrat | Strictement nécessaire |
| Authentification | **Non requis** | Exécution contrat | Strictement nécessaire |
| Panier | **Non requis** | Exécution contrat | Strictement nécessaire |
| Sécurité | **Non requis** | Obligation légale / Intérêt légitime | Protection du site |
| Préférences | **Non requis** | Exécution contrat | Demandé par l'utilisateur |
| Choix cookies | **Non requis** | Obligation légale | Preuve du consentement |
| Analytics (standard) | **Requis** | Consentement | Ex: Google Analytics |
| Analytics (exempté) | **Non requis** | Intérêt légitime | Ex: Matomo configuré |
| Publicité | **Toujours requis** | Consentement | Pas d'exception |
| Réseaux sociaux | **Requis** | Consentement | Boutons, embeds |
| Fonctionnalité | **Requis** | Consentement | Chat, vidéo, etc. |

---

## Durée de validité du consentement

> **LIRE LA SOURCE** : `assets/sources/CNIL_recommandation_cookies_et_traceurs.pdf` + https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies

### Recommandation CNIL : conserver le choix (consentement OU refus) pendant 6 mois (bonne pratique)

| Élément | Durée CNIL | Source |
|---------|------------|--------|
| **Choix de l'utilisateur (consentement ou refus)** | **6 mois** (bonne pratique, à apprécier au cas par cas) | Recommandation 2020, pt 39 |
| Renouvellement du consentement | « à des intervalles appropriés » (6 mois = bonne pratique) | Recommandation 2020, pts 38-39 |
| Traceurs de mesure d'audience exemptés | Durée de vie 13 mois, données 25 mois max | Recommandation 2020, pt 50 |

> **IMPORTANT** : La CNIL considère que conserver le choix (tant le consentement que le refus)
> pendant **6 mois** constitue une bonne pratique. Utiliser 6 mois par défaut. Aucun plafond
> général de « 13 mois maximum » ne figure dans la recommandation 2020 (version consolidée
> publiée le 16 janvier 2026) ni dans la FAQ CNIL.
> [Source: https://www.cnil.fr/sites/default/files/2026-01/recommandation_cookies_consolidee.pdf
> (pts 38-39 et 50) + https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/FAQ,
> accessed 2026-07-06]

### Obligations

- **Redemander le consentement** à intervalles appropriés (6 mois = bonne pratique CNIL)
- **Conserver la preuve** du consentement pendant toute sa durée
- **Permettre le retrait** à tout moment

---

## Preuve du consentement

### Ce qu'il faut conserver

| Élément | Obligatoire |
|---------|-------------|
| Identifiant de l'utilisateur | Oui (anonymisé possible) |
| Date et heure du consentement | Oui |
| Version de la bannière | Oui |
| Choix effectués (par catégorie) | Oui |
| Version de la politique cookies | Recommandé |

### Durée de conservation

La preuve doit être conservée **pendant toute la durée de validité du consentement** (durée choisie par l'éditeur ; 6 mois = bonne pratique CNIL, recommandation 2020, pt 39).

---

## Sanctions de référence

| Entreprise | Amende | Décision | Motif |
|------------|--------|----------|-------|
| Google | 150 M€ | SAN-2021-023 (31/12/2021) | Refus plus difficile que l'acceptation |
| Facebook | 60 M€ | SAN-2021-024 (31/12/2021) | Pas de solution de refus aussi simple que l'acceptation |
| Amazon | 35 M€ | SAN-2020-013 (07/12/2020) | Cookies déposés sans consentement |
| Microsoft | 60 M€ | SAN-2022-023 (19/12/2022) | Cookies publicitaires déposés sans consentement, refus plus difficile |
| Carrefour France | 2,25 M€ | SAN-2020-008 (18/11/2020) | Cookies déposés avant consentement (+ durées de conservation, information, droits) |

> NB : deux décisions Carrefour distinctes du 18 novembre 2020 - Carrefour France, 2 250 000 €
> (SAN-2020-008) et Carrefour Banque, 800 000 € (SAN-2020-009, partage illicite de données) ;
> ne pas les fusionner en « 3 M€ ».

[Sources: https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000042563756 (Carrefour France) ; https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000042564657 (Carrefour Banque) ; https://www.legifrance.gouv.fr/cnil/id/CNILTEXT000042635729 (Amazon) ; https://www.cnil.fr/fr/cookies-la-cnil-sanctionne-google-hauteur-de-150-millions-deuros-et-facebook-hauteur-de-60-millions (Google/Facebook) ; https://www.cnil.fr/en/cookies-microsoft-ireland-operations-limited-fined-60-million-euros (Microsoft), accessed 2026-07-06]

---

## Formulation pour la politique cookies

```
## Quels cookies utilisons-nous ?

### Cookies strictement nécessaires

Ces cookies sont indispensables au fonctionnement du site. Ils ne nécessitent
pas votre consentement et ne peuvent pas être désactivés.

[Tableau : Nom | Fournisseur | Durée | Finalité]

### Cookies analytics

Avec votre consentement, nous utilisons des cookies pour mesurer l'audience
de notre site et améliorer nos services.

[Tableau : Nom | Fournisseur | Durée | Finalité]

### Cookies publicitaires

Avec votre consentement, nous utilisons des cookies pour vous proposer des
publicités personnalisées et mesurer l'efficacité de nos campagnes.

[Tableau : Nom | Fournisseur | Durée | Finalité]

### Cookies de réseaux sociaux

Avec votre consentement, ces cookies permettent de partager du contenu sur
les réseaux sociaux et d'afficher des contenus intégrés.

[Tableau : Nom | Fournisseur | Durée | Finalité]
```

---

## Bonnes pratiques

### 1. Bannière conforme

```
┌─────────────────────────────────────────────────────────────────────────┐
│                                                                         │
│  Nous utilisons des cookies                                             │
│                                                                         │
│  Nous utilisons des cookies pour améliorer votre expérience,           │
│  analyser notre trafic et à des fins publicitaires.                    │
│                                                                         │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐      │
│  │  Tout accepter   │  │   Tout refuser   │  │   Personnaliser  │      │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘      │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### 2. Refus aussi simple que l'acceptation

- Bouton "Tout refuser" **au même niveau** que "Tout accepter"
- Même taille, même visibilité
- Pas besoin de cliquer sur "Personnaliser" pour refuser

### 3. Pas de dark patterns

```
❌ Bouton "Accepter" en couleur vive, "Refuser" grisé
❌ "Refuser" en petit texte sous la bannière
❌ Pré-sélection de cookies non essentiels
❌ "Continuer sans accepter" au lieu de "Tout refuser"
❌ Message culpabilisant ("Vous allez rater des fonctionnalités...")
```

### 4. Information complète

- Liste exhaustive des cookies avec finalités
- Identité des tiers déposant des cookies
- Durée de chaque cookie
- Lien vers les politiques des tiers

---

## Erreurs fréquentes

| Erreur | Conséquence | Solution |
|--------|-------------|----------|
| Cookies déposés avant consentement | Amende | Attendre le clic explicite |
| Analytics sans consentement | Amende | Consentement ou Matomo exempté |
| Traceurs d'audience exemptés : durée de vie > 13 mois ou données > 25 mois | Non-conformité à la recommandation CNIL | Respecter 13 mois / 25 mois (recommandation 2020, pt 50) |
| Pas de preuve du consentement | Non-conformité | Logger les choix |
| Cookie wall strict | Amende | Alternative payante ou contenu réduit |
| Bouton "Refuser" caché | Amende | Même visibilité que "Accepter" |

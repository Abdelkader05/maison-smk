# SMK Market

Catalogue de chaussures à Bamako, alimenté par Supabase et conçu pour transformer la consultation d’un produit en une prise de contact WhatsApp. L’application ne gère pas de compte client ni de panier : un bouton sur chaque fiche ouvre WhatsApp avec le produit et son prix préremplis.

> État documenté le 14 septembre 2026 depuis le dépôt `C:\Users\samas\Desktop\smk-market`. Toute information portant sur Supabase sans migration dans ce dépôt est explicitement marquée **à vérifier dans Supabase**.

## État actuel

| Fonctionnalité | État |
| --- | --- |
| Catalogue de produits actifs | Terminé |
| Recherche par nom et filtres dynamiques par catégorie | Terminé |
| Accueil avec catégories et nouveautés | Terminé |
| Fiche produit, galerie multi-images et SEO de base | Terminé |
| Image placeholder déterministe par catégorie | Terminé |
| Commande individuelle par lien WhatsApp | Terminé |
| Panier multi-produits | Non implémenté |
| Paiement en ligne / commande enregistrée | Non implémenté |
| Authentification, admin et CRUD web | Non implémentés |
| Gestion du catalogue par deux administrateurs via SQL Editor | En place côté processus, d’après la documentation projet ; pas d’interface web |
| Suivi des clics WhatsApp / meilleures ventes | Signalé comme prêt en base, non intégré au frontend |
| Migrations SQL / politiques RLS versionnées | Absentes du dépôt |
| Configuration Vercel | Prévue, non versionnée |

## Règle de lecture

- **Confirmé dans le code** : vérifié dans ce dépôt.
- **À vérifier dans Supabase** : nécessaire au fonctionnement, mais aucune migration/export SQL n’est présent.
- **Historique de conversation** : décision ou donnée rapportée avant l’audit du code ; pas une garantie sur l’état actuel de la base.

## Objectif et périmètre V1

Le V1 est une vitrine de chaussures à Bamako : le visiteur parcourt les produits publiés, filtre ou recherche un modèle, consulte la fiche et contacte SMK Market dans WhatsApp. Le site affiche aussi la promesse de livraison à Bamako, remise en main propre dans les principaux quartiers et paiement à la livraison.

Le périmètre livré est volontairement simple : catalogue public + prise de contact. Il n’existe pas de compte client, session d’achat, quantité, panier, total, stock affiché, paiement, création de commande, décrémentation de stock, notification, suivi de livraison ou interface administrateur. Deux administrateurs géreraient actuellement le catalogue directement dans le SQL Editor Supabase ; cette organisation est décrite dans la documentation projet fournie, mais aucun identifiant ni mécanisme de rôle n’est versionné ici.

## Stack

| Élément | Version / choix confirmé |
| --- | --- |
| Framework | Next.js `16.3.4`, App Router |
| Langage | TypeScript `^5` |
| UI | React `19.2.8`, Tailwind CSS `^4` |
| Données et sessions | Supabase : `@supabase/supabase-js` `^2.116.0`, `@supabase/ssr` `^0.12.7` |
| Images | `next/image`, Supabase Storage public et Picsum autorisés |
| Polices | Fraunces et Work Sans via `next/font/google` |
| Déploiement cible | Vercel (prévu) |

## Arborescence réelle

```text
smk-market/
├── app/
│   ├── a-propos/page.tsx              # présentation/contact
│   ├── produits/
│   │   ├── [id]/page.tsx              # fiche, métadonnées, lien WhatsApp
│   │   ├── [id]/loading.tsx           # skeleton de fiche
│   │   ├── loading.tsx                # skeleton catalogue
│   │   └── page.tsx                   # catalogue SSR
│   ├── error.tsx                      # erreur globale récupérable
│   ├── globals.css                    # thème et import Tailwind
│   ├── layout.tsx                     # fonts, métadonnées, Header/Footer
│   └── page.tsx                       # accueil SSR
├── components/
│   ├── CatalogGrid.tsx                # recherche et filtre client
│   ├── Footer.tsx                     # contact WhatsApp et informations
│   ├── Header.tsx                     # navigation et menu mobile
│   ├── ProductCard.tsx                # carte catalogue/accueil
│   └── ProductGallery.tsx             # image principale et miniatures
├── lib/
│   ├── format.ts                      # prix FCFA / « Prix sur demande »
│   ├── placeholder.ts                 # URL Picsum par catégorie
│   ├── products.ts                    # requêtes catalogue Supabase
│   └── supabase/
│       ├── client.ts                  # client Supabase navigateur
│       └── server.ts                  # client Supabase SSR avec cookies
├── public/                            # icônes Next.js par défaut
├── .env.local                         # local, ignoré par Git, ne pas committer
├── next.config.ts                     # domaines d’images distantes autorisés
├── package.json                       # scripts et dépendances
└── tsconfig.json                      # alias `@/*` et TypeScript
```

Les fichiers `.next/` et `node_modules/` sont générés localement. Il n’y a pas de dossier `supabase/`, fichier de migration, route API, Server Action, middleware, test automatisé, configuration Vercel ou composant de panier.

## Architecture et flux

Les pages `app/page.tsx`, `app/produits/page.tsx` et `app/produits/[id]/page.tsx` sont des Server Components. Elles appellent `lib/products.ts`, qui crée un client Supabase serveur via `lib/supabase/server.ts`.

```text
Navigateur
  ├─ pages SSR Next.js ──> lib/products.ts ──> Supabase (products + product_images)
  ├─ CatalogGrid client : filtre/recherche les produits déjà reçus
  └─ Fiche produit ──> lien wa.me prérempli ──> WhatsApp
```

`CatalogGrid`, `Header` et `ProductGallery` sont des Client Components car ils utilisent un état interactif. La recherche et les filtres n’envoient pas de requête à Supabase : ils opèrent sur la liste déjà chargée. Le paramètre `?categorie=…` définit le filtre initial ; les changements suivants restent locaux au navigateur.

La revalidation est de 300 secondes dans l’accueil, le catalogue et la fiche. Une modification en base peut donc prendre jusqu’à cinq minutes à apparaître, sauf mécanisme de revalidation ajouté ultérieurement.

## Supabase

### Variables d’environnement requises

Le code lit exactement :

```dotenv
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=...
NEXT_PUBLIC_WHATSAPP_NUMBER=...
```

`NEXT_PUBLIC_WHATSAPP_NUMBER` doit être utilisable par `wa.me` : indicatif pays inclus, sans `+`, espaces ni ponctuation. Les deux variables Supabase servent aux clients navigateur et serveur. Ne pas copier leurs valeurs dans le code ou un commit. Une clé `service_role` ne doit jamais être exposée ; le code actuel ne l’emploie pas.

### Connexion SSR

`lib/supabase/server.ts` utilise `createServerClient` de `@supabase/ssr` et transmet les cookies Next.js récupérés avec `await cookies()`. Son `setAll` est protégé par un `try/catch`, puisqu’un Server Component ne peut pas toujours écrire les cookies. Le commentaire indique qu’un middleware devrait rafraîchir les sessions si l’auth est ajoutée ; **aucun middleware n’est présent**.

`lib/supabase/client.ts` crée un client navigateur avec `createBrowserClient`. Aucun composant actuel ne l’importe : il est disponible pour une future interaction client, mais inutile au parcours V1.

### Tables et relation utilisées

| Table | Colonnes lues dans le code | Usage |
| --- | --- | --- |
| `products` | `id`, `name`, `description`, `price`, `category`, `stock`, `is_active`, `created_at` | catalogue, nouveautés, fiche |
| `product_images` | `id`, `image_url`, `display_order` | images liées aux produits |

La relation attendue est `products` → `product_images`, vraisemblablement par `product_images.product_id`. Cette colonne n’est pas sélectionnée directement par le code, mais les requêtes imbriquées `product_images(...)` exigent une relation visible pour PostgREST. `display_order` est croissant : la première image devient l’image principale des cartes et la galerie respecte cet ordre.

`getProducts()` prend les produits où `is_active = true`, par `created_at` croissant. `getFeaturedProducts(4)` garde cette condition mais prend les quatre plus récents. `getProductById(id)` retourne `null` s’il ne trouve pas de produit ou reçoit une erreur, que la page transforme en 404.

### Schéma, contraintes, RLS et Storage : état déclaré de la base, à auditer

Le dépôt n’a aucun DDL. La documentation projet fournie le 15 septembre 2026 décrit l’état de la base ci-dessous. Ces informations sont à utiliser pour reprendre le projet, mais doivent être contrôlées dans Supabase avant toute migration, car elles ne sont pas reproductibles depuis Git.

#### Table `products`

| Colonne | Type / règle déclaré(e) | Usage actuel |
| --- | --- | --- |
| `id` | UUID, clé primaire, défaut `gen_random_uuid()` | URL de fiche et jointure images |
| `name` | `TEXT NOT NULL` | affichage et recherche client |
| `description` | `TEXT` | fiche et metadata |
| `price` | `NUMERIC`, nullable | formaté en FCFA ou « Prix sur demande » |
| `category` | `TEXT` libre, sans enum | catégories et filtres dynamiques |
| `stock` | `INTEGER DEFAULT 10` | lu mais non utilisé par l’UI |
| `brand` | `TEXT` | présent, actuellement `null` et non utilisé |
| `sizes` | type non confirmé | présent, actuellement `null` et non utilisé |
| `is_active` | `BOOLEAN DEFAULT true` | condition obligatoire d’affichage |
| `created_at`, `updated_at` | `TIMESTAMPTZ` | seul `created_at` sert au tri actuel |

L’historique indique que la contrainte `NOT NULL` de `price` a été retirée pour importer des prix inconnus, par `ALTER TABLE products ALTER COLUMN price DROP NOT NULL`. Les produits actuels auraient désormais tous un prix renseigné : l’interface reste toutefois compatible avec `NULL`.

#### Table `product_images`

| Colonne | Type / règle déclaré(e) | Usage actuel |
| --- | --- | --- |
| `id` | UUID, clé primaire | clé React de galerie |
| `product_id` | UUID, FK vers `products.id`, `ON DELETE CASCADE` | relation imbriquée PostgREST |
| `image_url` | `TEXT NOT NULL`, URL publique complète | `next/image` et Open Graph |
| `display_order` | `INTEGER` | ordre de galerie et image principale |
| `created_at` | `TIMESTAMPTZ` | non lu par le frontend |

Le contexte indique un index `idx_product_images_product_id` sur `product_id`. Il n’existe pas de colonne `is_primary` : la plus petite valeur `display_order` est l’image principale. Ne pas réintroduire une requête sur `is_primary`.

#### Tables et fonction non utilisées par le frontend

- `admins` : table destinée à l’authentification/back-office. Aucune route, session, middleware ou UI admin ne l’utilise encore.
- `click_events` : table destinée à enregistrer les clics du bouton WhatsApp.
- `get_best_sellers()` : fonction SQL `SECURITY DEFINER` dont le `search_path` est explicitement `public`, conçue pour déterminer les meilleures ventes à partir de `click_events`.

Selon la documentation projet, ces objets existent en base mais `click_events` n’est pas alimentée et `get_best_sellers()` n’est appelée par aucun code frontend. La section « Nouveautés » actuelle est uniquement basée sur `created_at`, pas sur les ventes.

#### Sécurité et Storage déclarés

La documentation projet indique : RLS activé sur toutes les tables, lecture publique de `products` et `product_images`, écritures restreintes ; bucket `product-images` public avec ses propres policies Storage ; extension `pg_trgm` activée. Le frontend ne recourt pas encore à `pg_trgm` : la recherche est un `.includes()` JavaScript en mémoire, ce qui est adapté au volume actuel annoncé.

Avant tout changement de sécurité, contrôler dans Supabase :

- les policies effectives RLS/Storage, pas seulement leur existence déclarée ;
- les accès de lecture anonymes et les écritures réellement accordées aux administrateurs ;
- la FK et sa règle `ON DELETE CASCADE` ;
- le bucket, son statut public et les règles d’upload ;
- la définition, les droits et le comportement de `get_best_sellers()`.

### Stock : convention non implémentée

Le type actuel déclare `stock: number`, mais aucune page ne l’affiche ou ne l’utilise. Selon la décision métier ajoutée à la documentation projet, `stock` et `is_active` sont délibérément indépendants : aucun trigger ne doit faire varier l’un à partir de l’autre ; un produit à `stock = 0` reste affiché si `is_active = true`. Il reste aussi commandable, puisque le bouton WhatsApp n’effectue aucun contrôle de stock.

La convention « `0` = rupture, `NULL` = stock non géré » n’est ni indiquée par le schéma déclaré ni implémentée. Ne pas l’adopter implicitement. Si elle est un jour retenue, aligner explicitement schéma, type TypeScript, badges UI, bouton WhatsApp et validation serveur.

## Images, galerie et placeholders

`next.config.ts` autorise :

- `https://bfomeoluzdmssmkypwwj.supabase.co/storage/v1/object/public/**` ;
- `https://picsum.photos/**`.

Une image `product_images` a priorité. Sans image, `getPlaceholderImage(category)` génère une URL Picsum de 1000 × 1000 stable par catégorie normalisée ; une catégorie vide utilise `smk-default`. `getProductById` fournit ce fallback à la galerie. La galerie affiche une image carrée et, à partir de deux images, des miniatures cliquables. Les cartes prennent la première image triée.

### Politique de sourcing des images

La documentation projet fixe une règle de contenu : utiliser uniquement des photographies originales ou des images sous licence compatible, par exemple issues de banques libres de droits comme Pexels. Ne pas téléverser de photos officielles de catalogue de marques de luxe, y compris lorsqu’un produit est présenté comme « style X ». Des lots contenant apparemment des photos officielles auraient été retirés auparavant. Tant qu’aucune photo conforme n’est disponible, conserver le fallback Picsum plutôt que d’employer une image au droit incertain.

Pour de vraies photos produit, la recommandation historique est : format carré, environ 1000 × 1000 px, WebP, moins de 200 Ko si la qualité le permet. Vérifier aussi que l’URL publique générée correspond au domaine autorisé dans `next.config.ts`.

## Limites et problèmes connus

- `getProducts()` et `getFeaturedProducts()` retournent `[]` lorsqu’une requête Supabase échoue ; le visiteur peut donc voir un catalogue vide plutôt qu’un message d’erreur. `getProductById()` retourne `null` dans le même cas, ce qui produit une 404. C’est un choix de code actuel, pas une panne résolue.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` n’est ni contrôlé ni accompagné d’une valeur de secours. Si la variable manque ou est mal formatée, le lien `wa.me` sera invalide.
- Le numéro, les promesses de livraison et le paiement à la livraison sont des textes/configurations statiques. Rien ne les valide côté serveur.
- Le footer affiche deux fois « Paiement a la livraison » ; c’est une duplication de contenu à corriger lorsqu’une vraie politique de paiement sera définie.
- `metadataBase` pointe encore vers `http://localhost:3000`, ce qui rend les URLs canoniques/Open Graph incorrectes en production tant qu’il n’est pas remplacé.
- Le dépôt ne contient aucun test automatisé ni migration SQL, ce qui empêche de reproduire et vérifier l’infrastructure Supabase depuis Git.
- La recherche est uniquement côté client. `pg_trgm` serait disponible en base, mais n’est pas utilisé ; il faudra une recherche serveur paginée si le catalogue grossit fortement.
- La documentation projet rapporte que le développement a été testé en local sur desktop, mais pas encore sur un réseau mobile réel à Bamako.

## Incidents déjà résolus à ne pas reproduire

1. **Utilitaires client et module serveur.** `lib/products.ts` importe `lib/supabase/server.ts`, lui-même dépendant de `next/headers`. Ne pas y remettre une fonction pure importée par un Client Component. `formatPrice` vit volontairement dans `lib/format.ts`, sans dépendance serveur ; `ProductCard` peut donc l’importer sans casser le build.
2. **Image principale.** `product_images.is_primary` n’existe pas. La logique correcte est `display_order` croissant.
3. **Guillemets dans JSX.** Un copier-coller depuis un éditeur riche a déjà produit des guillemets typographiques invalides dans un `.tsx`. Coller le code dans un éditeur de texte brut et conserver les guillemets JavaScript normaux.
4. **PowerShell, npm et npx.** Un blocage `PSSecurityException` a déjà été rencontré. La correction historique était `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`. Ne l’exécuter que si cette erreur précise se reproduit, après avoir vérifié la politique de sécurité attendue sur la machine et obtenu l’accord du propriétaire.
5. **Prix inconnu.** Une ancienne contrainte `price NOT NULL` empêchait les imports sans prix ; elle aurait été retirée. `formatPrice(null)` doit rester pris en charge.

## Catalogue et pages

| URL | Comportement |
| --- | --- |
| `/` | Hero, image du premier produit « nouveauté », catégories depuis les données, quatre nouveautés, promesses de service. |
| `/produits` | Produits actifs, compteur, catégories dynamiques, recherche par nom. |
| `/produits?categorie=Chaussures` | Catalogue avec filtre initial. |
| `/produits/[id]` | Galerie, nom, prix, description, metadata Open Graph et bouton WhatsApp. |
| `/a-propos` | Présentation courte ; le menu l’étiquette « Contact ». |

Les valeurs de catégories sont utilisées telles quelles : `Chaussures`, `chaussures` et `CHAUSSURES` créeraient trois filtres. Conserver une convention de saisie cohérente en base.

`formatPrice` affiche une valeur numérique en `FCFA` avec séparateurs français ; `null` devient « Prix sur demande ». Cette valeur est aussi insérée dans le message WhatsApp.

## WhatsApp et absence de panier

La fiche construit :

```text
https://wa.me/{NEXT_PUBLIC_WHATSAPP_NUMBER}?text=Bonjour, je suis interesse(e) par : {nom} ({prix})
```

Le lien ouvre un nouvel onglet. C’est une demande pour **un seul produit**. Aucun panier, quantité, total, coordonnées client, enregistrement SQL ou confirmation de commande n’existe. Le footer a aussi un lien WhatsApp sans message.

## Données connues

La documentation projet rapporte 35 produits actuellement en base, répartis entre les catégories `Mules` et `Sneakers`. Elle indique également que les catégories ont été harmonisées après un import initial, par des `UPDATE ... WHERE name ILIKE '%...%'`, et que les prix sont désormais renseignés. Cet état doit être vérifié dans Supabase avant de le tenir pour actuel : aucun export de données n’est versionné dans le dépôt.

L’historique initial mentionnait des mules et sneakers, `stock = 10` et de nombreux prix `NULL`. Il contenait aussi des références à des marques. Ne pas considérer ces noms comme preuve d’authenticité, d’autorisation ou de conformité commerciale ; vérifier les libellés, descriptions, droits d’images et prix avant publication.

## Ajouter un produit et ses images

Il n’existe pas d’admin web. Après vérification du schéma Supabase :

1. insérer le produit avec toutes les colonnes requises, notamment `is_active = true` s’il doit être visible ;
2. récupérer son `id` ;
3. téléverser les images dans le bucket validé ;
4. insérer une ligne `product_images` par URL avec `product_id` et `display_order` à partir de `0` ;
5. vérifier carte, fiche, ordre de galerie, prix et lien WhatsApp ;
6. attendre au plus cinq minutes pour la revalidation, ou déclencher une revalidation si elle est ajoutée.

Ne pas relancer aveuglément le vieux `CREATE TABLE IF NOT EXISTS` : il ne met pas une table existante à niveau, peut être incompatible avec `is_active` et les inserts peuvent créer des doublons.

## Design, SEO et erreurs

Le thème Tailwind utilise parchemin, encre, laiton, vert bouteille et fond carte. Fraunces sert aux titres, Work Sans au texte. L’HTML est en français. Les métadonnées visent le catalogue à Bamako, mais `metadataBase` est encore `http://localhost:3000` : le remplacer par le domaine de production avant déploiement. Les fiches construisent leurs métadonnées et image Open Graph depuis le produit. `app/error.tsx` offre un écran de réessai ; les routes catalogue et fiche ont des skeletons de chargement.

## Commandes

```powershell
npm run dev      # développement, généralement http://localhost:3000
npm run lint     # ESLint
npm run build    # build Next.js de production
npm run start    # sert le build de production
```

`node_modules/` et `package-lock.json` sont déjà présents. Aucune erreur npm/npx PowerShell précise n’est documentée : ne pas appliquer de contournement de politique d’exécution sans le message exact et l’accord de l’utilisateur.

## Prochaines étapes, dans l’ordre recommandé

1. Construire l’interface d’administration sécurisée : Auth Supabase, contrôle de rôle avec `admins`, CRUD de produits et upload d’images ; ne pas se contenter de cacher un écran côté client.
2. Remplacer progressivement les placeholders par des photos conformes à la politique de sourcing.
3. Brancher les clics WhatsApp sur `click_events`, puis afficher une section « Meilleures ventes » basée sur `get_best_sellers()` après audit de ses droits et de ses résultats.
4. Concevoir un panier multi-articles seulement après décision sur les quantités, le stock et le message WhatsApp. Garder une URL `wa.me` raisonnablement courte : la limite pratique est souvent autour de 2 000 caractères selon les clients.
5. Déployer sur Vercel et tester en conditions mobiles/réseau Bamako.
6. Choisir le nom de domaine ; la pertinence d’un domaine `.ml` est signalée comme question encore ouverte dans l’historique projet.
7. Exporter/versionner les migrations et policies Supabase afin que l’infrastructure devienne reproductible.

## Déploiement Vercel prévu

1. Lancer `npm run lint` puis `npm run build`.
2. Connecter le dépôt à Vercel.
3. Définir les trois variables d’environnement sans les exposer dans Git.
4. Remplacer `metadataBase` par l’URL de production.
5. Si Auth est ajoutée, configurer les redirect URLs Supabase.
6. Tester catalogue, images, fiche, 404 et WhatsApp sur mobile.
7. Vérifier les policies RLS avant ouverture publique.

## Points à ne pas casser

- Seuls les produits `is_active = true` sont rendus.
- `display_order` définit l’image principale et l’ordre de galerie.
- Les catégories sont issues des données ; ne pas les coder en dur.
- `price = null` doit rester compatible avec « Prix sur demande ».
- Le placeholder ne doit jamais prévaloir sur une image réelle.
- Ne pas publier de secret Supabase ni de clé service-role.
- Le lien WhatsApp n’enregistre pas de commande et ne réserve aucun stock.
- `stock` et `is_active` sont des décisions distinctes : ne pas créer de couplage automatique sans changement de règle métier explicite.
- `click_events` et `get_best_sellers()` ne sont pas intégrés : ne pas appeler une fonction `SECURITY DEFINER` sans revoir ses droits et ses résultats.
- Ne pas modifier `node_modules/` ou `.next/`.

## Instructions pour une autre IA

1. Lire `package.json`, `AGENTS.md`, `lib/products.ts` puis les migrations Supabase si elles deviennent disponibles.
2. Avant une évolution Next.js, consulter la documentation locale de Next 16 dans `node_modules/next/dist/docs/`, comme l’exige `AGENTS.md`.
3. Vérifier Git avant toute modification et préserver les changements utilisateur.
4. Considérer le schéma/RLS/Storage décrit ici comme un état déclaré à auditer, faute de migrations ; ne pas le modifier à l’aveugle.
5. Avant un panier/admin, obtenir les choix métier : stock, quantités, commande WhatsApp, validation, rôles et upload.
6. Respecter la politique de droits d’image et contrôler l’URL de chaque image contre `next.config.ts`.
7. Tester les pages publiques et mettre à jour ce README après toute évolution.

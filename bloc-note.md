# BLOC NOTE

Lorsque tu code essaie au maximum de repérer ce qui est répétitif pour simplifier ton travail


### Configuration des cookies au niveau du back-end

#### 1. **Environnement local (Développement)**

- **Protocole HTTP** : En développement, tu utilises souvent HTTP (par exemple, `http://localhost:3000`), qui n'est pas sécurisé.

- **Attribut `secure`** : En HTTP, il est impossible d'utiliser l'attribut `secure` (qui oblige une connexion HTTPS) pour protéger le cookie. Donc, **`secure: false`**.

- **Attribut `sameSite`** : En mode développement, tu n'as pas besoin de gérer des cookies cross-origin complexes (inter-domaines), donc tu peux utiliser **`sameSite: 'Lax'`**. Cela empêche la transmission de cookies dans certaines situations (par exemple, lors des requêtes cross-site), mais reste assez flexible pour les tests locaux.

- **Attribut `httpOnly`** : C'est toujours une bonne pratique de définir **`httpOnly: true`** pour empêcher l'accès aux cookies par JavaScript, afin d'améliorer la sécurité (protection contre XSS).
- **Domaine** : Le domaine devrait être **`localhost`** en développement.

#### Exemple de configuration pour l'environnement local :

```ts
import { CookieOptions } from "express";

export const getCookieOptions = (): CookieOptions => {
    return {
        maxAge: 31 * 24 * 3600 * 1000, // 31 jours
        httpOnly: true, // Protège contre XSS
        secure: false, // Pas de HTTPS en local
        sameSite: 'Lax', // Permet les cookies en local sans être trop restrictif
        domain: 'localhost', // Domaine local
    };
};
```

#### Résumé pour **environnement local** :
- `secure: false` (car pas de HTTPS)
- `sameSite: 'Lax'` (pour permettre les requêtes locales)
- `httpOnly: true` (pour empêcher l'accès JavaScript)
- `domain: 'localhost'`

---

#### 2. **Environnement de production**

- **Protocole HTTPS** : En production, tu utilises HTTPS (par exemple, `https://mywebsite.com`), ce qui assure que la communication est sécurisée.

- **Attribut `secure`** : En HTTPS, tu dois absolument définir **`secure: true`** pour que les cookies ne soient envoyés que sur des connexions sécurisées.

- **Attribut `sameSite`** : Si ton front-end et back-end sont sur des domaines ou sous-domaines différents, tu auras besoin de **`sameSite: 'None'`** pour permettre les cookies cross-origin. Cela permet au cookie de traverser les frontières de domaines (utile pour les applications où front-end et back-end sont sur des sous-domaines différents, par exemple `frontend.mywebsite.com` et `api.mywebsite.com`).

- **Attribut `httpOnly`** : Toujours **`httpOnly: true`** pour éviter l'accès JavaScript aux cookies.

- **Domaine** : Le domaine doit être configuré en fonction de ton site en production (par exemple, `mywebsite.com` ou un sous-domaine comme `api.mywebsite.com`).

#### Exemple de configuration pour l'environnement de production :

```ts
import { CookieOptions } from "express";

export const getCookieOptions = (): CookieOptions => {
    return {
        maxAge: 31 * 24 * 3600 * 1000, // 31 jours
        httpOnly: true, // Protège contre XSS
        secure: true, // HTTPS obligatoire en production
        sameSite: 'None', // Permet les cookies entre domaines (cross-origin)
        domain: process.env.COOKIE_DOMAIN, // Utilise le domaine de production (ex: mywebsite.com)
    };
};
```

#### Résumé pour **environnement de production** :
- `secure: true` (car HTTPS)
- `sameSite: 'None'` (si cookies cross-origin sont nécessaires)
- `httpOnly: true` (pour empêcher l'accès JavaScript)
- `domain: 'mywebsite.com'` (domaine de production)

---

### Résumé général :

| Environnement   | `secure`  | `sameSite` | `httpOnly` | Domaine      |
|-----------------|-----------|------------|------------|--------------|
| **Développement** | `false`   | `Lax`      | `true`     | `localhost`  |
| **Production**    | `true`    | `None`     | `true`     | `mywebsite.com` |

### Pourquoi ces configurations ?

- **En développement** : Utilise **`secure: false`** et **`sameSite: Lax`** car tu travailles en HTTP et tu n'as pas besoin de gérer les cookies cross-origin.

- **En production** : Utilise **`secure: true`** et **`sameSite: None`** pour garantir la sécurité des cookies sur une connexion HTTPS, et autoriser le partage entre différents domaines ou sous-domaines si nécessaire.
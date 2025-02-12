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
    sameSite: "Lax", // Permet les cookies en local sans être trop restrictif
    domain: "localhost", // Domaine local
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
    sameSite: "None", // Permet les cookies entre domaines (cross-origin)
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

| Environnement     | `secure` | `sameSite` | `httpOnly` | Domaine         |
| ----------------- | -------- | ---------- | ---------- | --------------- |
| **Développement** | `false`  | `Lax`      | `true`     | `localhost`     |
| **Production**    | `true`   | `None`     | `true`     | `mywebsite.com` |

### Pourquoi ces configurations ?

- **En développement** : Utilise **`secure: false`** et **`sameSite: Lax`** car tu travailles en HTTP et tu n'as pas besoin de gérer les cookies cross-origin.

- **En production** : Utilise **`secure: true`** et **`sameSite: None`** pour garantir la sécurité des cookies sur une connexion HTTPS, et autoriser le partage entre différents domaines ou sous-domaines si nécessaire.

---

```js
import React, { createContext, useEffect, useState } from 'react'
import { IChildren, IUserData } from '../types'
import { useIsLoggedIn } from '../hooks/use-isLoggedIn'

interface AuthProviderProps {
  user: IUserData | null
  setUser: React.Dispatch<React.SetStateAction<IUserData | null>>
}

export const AuthContext: React.Context<AuthProviderProps> =
  createContext<AuthProviderProps>({
    user: null,
    setUser: () => {},
  })

export const AuthContextProvider = ({ children }: IChildren) => {
  const [user, setUser] = useState<IUserData | null>(null)
  const { data } = useIsLoggedIn()

  useEffect(() => {
    if (data) {
      if (data.success && data.data?.user) {
        const user = data.data.user
        setUser(user)
      }
    }
      /*
        Dans ce context il faut savoir bien distinguer la dépendance qui change
        pour mieux remplir le tableau de dépendance
      */
  }, [data])



  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
```

### hooks get Resquest avec react-query

```js
import { useQuery } from "@tanstack/react-query";
import { isLoggedIn } from "../api";

export const useIsLoggedIn = () => {
  return useQuery({
    queryKey: ["isLoggedIn"], // la clé à surveiller
    queryFn: isLoggedIn,
  });
};
```

### hooks post,put,delete Resquest avec react-query

```js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../api";

export const useLogin = (CallbackFn?: (data: any) => void) => {
  // CallbackFn est une fonction qui sera appelée après la connexion pour modifier un state
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      if (CallbackFn) {
        CallbackFn(data); // ce
        queryClient.invalidateQueries({ queryKey: ["isLoggedIn"] });
        navigate("/"); // Rediriger vers la page d'accueil
      }
    },
    onError: (error: any) => {
      console.error(
        "Erreur de connexion :",
        error.response?.data?.message || "Une erreur est survenue"
      );
    },
  });
};
```

### route privée

```js
export const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.permissions === "Administrator") {
    return <>{children}</>;
  } else {
    return <>{children}</>;
  }
};
```

### route publique

```js
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks";
import { ReactNode } from "react";
import { useIsLoggedIn } from "../hooks/use-isLoggedIn";
import { Layout, Spin } from "antd";

const { Content } = Layout;

interface PublicRouteProps {
  children: ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const { user } = useAuth();
  const { isLoading } = useIsLoggedIn();

  if (isLoading) {
    return (
      <Content className="flex justify-center items-center h-screen">
        <Spin size="large" fullscreen />
      </Content>
    );
  }

  if (user) {
    return (
      <Navigate to={user.permissions === "Administrator" ? "/admin" : "/"} />
    );
  }

  return <>{children}</>;
};
```

## A Faire

## important

- refaire toute les requêtes avec react-query

### Pas super important

- Controlleur pour supprimer un utilisateur
- Controleur changer de permission à un utilisateur

```

```

- L'heure d'arrivé et de départ ne fonctionne fonctionne pas bien ( si j'arrive à 9h il me met que je suis arrivé à 8h )
- Le calcul des heures hebdomadaire ne se fait pas / Nombre d'heure pas semaine qui ne fonctionne pas bien

## Statistiques

### Graphique en bar

- Pourcentage de présence par jour

### Graphique en Camembert

- Taux de personne présente et absente

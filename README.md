

## Création d’un utilisateur MySQL `user` avec mot de passe `root`

### Option 1 — Tous les droits (sur toutes les bases) : rapide pour développement local

```sql
CREATE USER 'user'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON *.* TO 'user'@'localhost' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

 

### Option 2 — Droits uniquement sur la base `neper` (plus sécurisé)

1. Créer la base (si elle n'existe pas déjà) :

```sql
CREATE DATABASE IF NOT EXISTS neper;
```

2. Créer l’utilisateur avec mot de passe `root` et lui donner les droits uniquement sur la base `neper` :

```sql
CREATE USER 'user'@'localhost' IDENTIFIED BY 'root';
GRANT ALL PRIVILEGES ON neper.* TO 'user'@'localhost';
FLUSH PRIVILEGES;
```

---

Tu peux exécuter ces requêtes dans le terminal MySQL après t’être connecté en root :

```bash
mysql -u root -p
```

Et ensuite coller les commandes ci-dessus.

---

Tu veux aussi un test de connexion dans un script Node.js ?


 
 # MISE EN PLACE DU SERVER 
## PARTIE 1
```bash
# installe le serveur MySQL (si pas déjà fait)
sudo apt install mysql-server     # sous Linux
brew install mysql                # sous Mac
choco install mysql               # sous Windows avec Chocolatey
```

## ou se rendre sur le site 
*https://dev.mysql.com/downloads/installer/* 

## PARTIE 2
```bash
# installer les modules côté Node
npm install express mysql2 cors
``` 
#### LANCER LE SERVER

node server.js


 -- -- -- 


## lib utiles
https://dbeaver.io/download/
# WebFileSystem

WebFileSystem est une application web permettant de stocker et de gérer des fichiers depuis une interface web.

## 1. Technologies utilisées

### Backend

- Java
- Spring Boot
- Maven
- PostgreSQL

### Frontend

- React
- TypeScript
- Vite
- CSS

## 2. Prérequis

Le serveur doit fonctionner sous Debian.

Les logiciels suivants doivent être installés :

- Java JDK (version compatible avec le `pom.xml` du projet)
- Maven
- Node.js et npm
- PostgreSQL
- Git

## 3. Installation des dépendances

Mettre à jour les paquets :

```bash
sudo apt update
sudo apt upgrade -y
```

### 3.1 Installer Java

Installer OpenJDK 17 (à adapter si le `pom.xml` demande une autre version) :

```bash
sudo apt install openjdk-17-jdk -y
```

Vérifier l'installation :

```bash
java -version
javac -version
```

### 3.2 Installer Maven

```bash
sudo apt install maven -y
```

Vérifier :

```bash
mvn -version
```

### 3.3 Installer Node.js et npm

Installer Node.js et npm :

```bash
sudo apt install nodejs npm -y
```

Vérifier :

```bash
node -v
npm -v
```

Si la version de Node.js fournie par Debian est trop ancienne pour la version de Vite utilisée par le projet, installer une version LTS récente de Node.js.

### 3.4 Installer PostgreSQL

Installer PostgreSQL :

```bash
sudo apt install postgresql postgresql-contrib -y
```

Activer et démarrer le service :

```bash
sudo systemctl enable --now postgresql
```

Vérifier son état :

```bash
sudo systemctl status postgresql
```

## 4. Configuration de PostgreSQL

### 4.1 Créer la base de données et son utilisateur

Ouvrir une session PostgreSQL :

```bash
sudo -u postgres psql
```

Créer un utilisateur dédié à WebFileSystem :

```sql
CREATE USER webfilesystem_user WITH PASSWORD 'VOTRE_MOT_DE_PASSE';
```

Créer la base de données :

```sql
CREATE DATABASE webfilesystem OWNER webfilesystem_user;
```

Quitter PostgreSQL :

```sql
\q
```

**Important :** remplacer `VOTRE_MOT_DE_PASSE` par un mot de passe robuste.

### 4.2 Configurer le mot de passe

Dans le terminal, définir la variable d'environnement :

```bash
export DB_PASSWORD='VOTRE_MOT_DE_PASSE'
```

Cette variable devra être définie à chaque nouvelle session, ou configurée de manière persistante pour le service backend.

## 5. Préparer le stockage des fichiers

Les fichiers importés sont enregistrés directement sur le disque du serveur.

Créer le répertoire de stockage :

```bash
sudo mkdir -p /var/lib/webfilesystem/files
```

Donner les droits au compte qui exécutera le backend.

Par exemple, si le backend est exécuté avec l'utilisateur courant :

```bash
sudo chown -R $USER:$USER /var/lib/webfilesystem
```

Le répertoire utilisé par l'application doit être :

```text
/var/lib/webfilesystem/files/
```

**Attention :** vérifier que le chemin de stockage est bien configurable dans `FileStorageService.java` et `application.properties`. L'ancien chemin Windows `C:/WFS/files/` doit être remplacé.

## 6. Configuration du backend

Se placer dans le dossier backend :

```bash
cd backend
```

Vérifier le fichier :

```text
src/main/resources/application.properties
```

Exemple de configuration PostgreSQL :

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/webfilesystem
spring.datasource.username=webfilesystem_user
spring.datasource.password=${DB_PASSWORD}

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

file.upload-dir=/var/lib/webfilesystem/files/

spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=110MB

server.port=8080
```

Vérifier que les propriétés correspondent bien à celles utilisées par le projet.

### 6.1 Compiler le backend

Depuis le dossier `backend` :

```bash
mvn clean package
```

Si la compilation réussit, lancer l'application :

```bash
mvn spring-boot:run
```

Le backend sera accessible à l'adresse :

```text
http://localhost:8080
```

Pour arrêter le serveur :

```text
CTRL + C
```

## 7. Configuration du frontend

Ouvrir un deuxième terminal.

Se placer dans le dossier frontend :

```bash
cd frontend
```

Installer les dépendances :

```bash
npm install
```

### 7.1 Vérifier l'adresse du backend

Vérifier le fichier API du frontend.

L'adresse du backend doit correspondre à l'adresse de la machine hébergeant Spring Boot.

Pour une installation sur une seule machine :

```typescript
const API_URL = "http://localhost:8080/api";
```

Si le frontend et le backend sont accessibles depuis d'autres machines du réseau, remplacer `localhost` par l'adresse IP du serveur.

### 7.2 Démarrer le frontend

Lancer Vite :

```bash
npm start
```

Le frontend sera accessible à l'adresse :

```text
http://localhost:5173
```

Depuis une autre machine du réseau :

```text
http://IP_DU_SERVEUR:5173
```

## 8. Lancer l'application

Pour utiliser WebFileSystem, deux terminaux sont nécessaires.

### Terminal 1 : Backend

```bash
cd backend
export DB_PASSWORD='VOTRE_MOT_DE_PASSE'
mvn spring-boot:run
```

### Terminal 2 : Frontend

```bash
cd frontend
npm start
```

Ouvrir ensuite un navigateur et accéder à :

```text
http://localhost:5173
```

## 9. Structure du projet

```text
WebFileSystem/
│
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/
│   │       │   └── webfilesystem/
│   │       └── resources/
│   │           └── application.properties
│   ├── pom.xml
│   └── mvnw
│
├── frontend/
│   ├── src/
│   ├── assets/
│   ├── package.json
│   └── index.html
│
└── README.md
```

## 10. Dépannage

### PostgreSQL ne démarre pas

Vérifier le service :

```bash
sudo systemctl status postgresql
```

Redémarrer PostgreSQL :

```bash
sudo systemctl restart postgresql
```

### Erreur de connexion à PostgreSQL

Vérifier que la base existe :

```bash
sudo -u postgres psql -l
```

Vérifier que la variable d'environnement est définie :

```bash
echo "$DB_PASSWORD"
```

### Erreur de connexion entre le frontend et le backend

Vérifier que Spring Boot fonctionne sur le port 8080.

Vérifier également la configuration CORS dans `CorsConfig.java`.

L'origine autorisée doit correspondre à l'adresse du frontend.

### Erreur lors de l'importation d'un fichier

Vérifier les limites de taille dans `application.properties` :

```properties
spring.servlet.multipart.max-file-size=100MB
spring.servlet.multipart.max-request-size=110MB
```

Vérifier également les droits d'écriture sur :

```text
/var/lib/webfilesystem/files/
```

### Erreur de compilation du frontend

Supprimer les dépendances installées puis les réinstaller :

```bash
rm -rf node_modules
npm install
```

## 11. Stockage des données

WebFileSystem utilise deux emplacements de stockage :

- PostgreSQL : conserve les métadonnées des fichiers, notamment leur identifiant et leur nom.
- Système de fichiers Debian : conserve les fichiers physiques dans `/var/lib/webfilesystem/files/`.

La suppression ou la modification d'un fichier doit être répercutée dans les deux emplacements.

Il est recommandé de sauvegarder régulièrement la base PostgreSQL ainsi que le répertoire contenant les fichiers.

Exemple de sauvegarde de la base :

```bash
pg_dump -U webfilesystem_user -h localhost webfilesystem > webfilesystem_backup.sql
```

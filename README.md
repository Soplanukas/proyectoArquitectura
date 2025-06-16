Proyecto Arquitectura – Readme / instalación y ejecución

🧾 Requisitos Previos
- Node.js y npm instalados
- PostgreSQL instalado y funcionando
- Git instalado

🗄️ Instalar Node-js
1. Descarga Node-js desde https://nodejs.org/es/download

🗄️ Instalar PostgreSQL
1. Descarga PostgreSQL desde https://www.postgresql.org/download/
2. Durante la instalación, guarda el usuario, contraseña y puerto que configures (usualmente: postgres, postgres, 5432).

🛠️ Crear la base de datos y tablas
1. Abre pgAdmin o usa la terminal de PostgreSQL (psql) para crear la base de datos:
CREATE DATABASE nombre_de_tu_db;
2. Conéctate a la base de datos y ejecuta este script para crear las tablas:
-- Tabla 'aulas'
CREATE TABLE aulas (
  id_aula SERIAL PRIMARY KEY,
  nombre_materia VARCHAR(100),
  nombre_docente VARCHAR(100),
  aula_original VARCHAR(50),
  aula_remitente VARCHAR(50),
  piso VARCHAR(20),
  edificio VARCHAR(100),
  coordenada_x DOUBLE PRECISION,
  coordenada_z DOUBLE PRECISION,
  dia VARCHAR(20),
  hora_inicio TIME,
  hora_fin TIME,
  fecha_inicio DATE,
  fecha_fin DATE
);
-- Tabla 'users'
CREATE TABLE users (
  uid VARCHAR(100) PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  name VARCHAR(100),
  role VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE EXTENSION IF NOT EXISTS unaccent;
  
📦 Clonar el repositorio
- Abre una terminal y ejecuta:
git clone https://github.com/Soplanukas/proyectoArquitectura.git
cd proyectoArquitectura

🧪 Configurar archivo .env
Crea un archivo .env en la raíz del proyecto con el siguiente contenido:
PORT=3000
PG_USER=postgres
PG_HOST=localhost
PG_DATABASE=nombre_de_tu_db
PG_PASSWORD=tu_contraseña_postgres
PG_PORT=5432

📥 Instalar dependencias
Ejecuta el siguiente comando en la raíz del proyecto:
npm install

Para poder ejecutar el programa también puedes abrir la terminal en Visual Studio Code y ejecutar:
-node index.js

También puedes instalarla las dependencias manualmente con los siguientes comandos:
-npm install body-parser cors dotenv express express-session firebase firebase-admin jsonwebtoken passport passport-google-oauth20 pg
-npm install --save-dev nodemon

🚀 Ejecutar el proyecto:

Para ejecutar el proyecto digite la siguiente linea en su terminal de visual studio code: node server.js

📚 Tecnologías utilizadas
- Node.js
- Express
- PostgreSQL (pg)
- Firebase & Firebase Admin
- Passport (con Google OAuth 2.0)
- Dotenv
- CORS, body-parser, jsonwebtoken, etc.
  
✅ Estado
Proyecto en desarrollo con autenticación, gestión de aulas y sistema conectado a base de datos PostgreSQL.

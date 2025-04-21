// server.js
const open = require("open");
const express = require("express");
const admin = require("firebase-admin");
const cors = require("cors");
const bodyParser = require("body-parser");
const session = require("express-session");
const path = require("path");
const db = require("./db");
const { UserFactory } = require("./userFactory");
const aulasRoutes = require("./routes/aulas");
const studentsRoutes = require("./routes/students");
const aulasAdminRoutes = require("./routes/aulasAdmin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const app = express();

// Configuración de CORS (ajusta el origen si es necesario)
app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true
}));

// Middleware para parsear el cuerpo de las peticiones en JSON
app.use(bodyParser.json());

// Configuración de sesión para persistir la autenticación
app.use(session({
  secret: "tu_secreto_aquí", // Reemplaza por un secreto robusto
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false } // Cambiar a true en producción con HTTPS
}));

// Servir archivos estáticos públicos desde la carpeta "public"
app.use(express.static(path.join(__dirname, "public")));

// Cabeceras adicionales de seguridad
app.use((req, res, next) => {
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  next();
});

/* -------------- ENDPOINT DE AUTENTICACIÓN -------------- */
app.post("/auth", async (req, res) => {
  const { token } = req.body;
  if (!token) {
    return res.status(400).json({ error: "Token no proporcionado" });
  }

  try {
    // Verifica y decodifica el token de Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log("✅ Token decodificado:", decodedToken);

    const { uid, email, name } = decodedToken;

    // Valida que el correo pertenezca al dominio permitido
    if (!email || !email.endsWith("@ucaldas.edu.co")) {
      console.warn("Correo no autorizado:", email);
      return res.status(403).json({ error: "Correo no autorizado" });
    }

    // Crea el usuario usando la factoría
    const usuario = UserFactory.createUser(uid, email, name);

    // Inserta o actualiza el usuario en la base de datos
    const query = `
      INSERT INTO users (uid, email, name, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (uid)
      DO UPDATE SET email = EXCLUDED.email, name = EXCLUDED.name, role = EXCLUDED.role, updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;
    const values = [usuario.uid, usuario.email, usuario.name, usuario.role];
    const result = await db.query(query, values);

    // Guarda el usuario en la sesión para futuras peticiones
    req.session.user = result.rows[0];

    res.json({
      message: "Autenticación exitosa",
      user: result.rows[0]
    });
  } catch (error) {
    console.error("Error al verificar el token:", error.message);
    res.status(401).json({ error: "Token inválido o expirado" });
  }
});

/* -------------- MIDDLEWARE PARA PROTEGER RUTAS -------------- */
function requireAuth(req, res, next) {
  if (!req.session || !req.session.user) {
    // Si el usuario no está autenticado, redirige al login (index.html)
    return res.redirect("/");
  }
  next();
}

/* -------------- RUTAS PROTEGIDAS -------------- */
// Ruta protegida para el área de administración (la página admin se encuentra en "views/admin.html")
app.get("/admin", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "admin.html"));
});

// Ruta protegida para el área general (la página general se encuentra en "views/general.html")
app.get("/general", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "views", "general.html"));
});

// Ruta protegida para la VISTA general, donde se puede loguear y regostrar ")
app.get("/vistaprinc", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "vistaprinc.html"));
});

/* -------------- RUTAS PARA API -------------- */
app.use('/api/aulas', aulasRoutes);
app.use('/api/users', studentsRoutes);
app.use('/api/', aulasAdminRoutes);


// Inicio del servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
  open(`http://localhost:${PORT}/vistaprinc`);
});


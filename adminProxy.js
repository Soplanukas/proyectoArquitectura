


function adminProxy(req, res, next) {
    const user = req.user;  
    if (!user) {
      return res.status(401).json({ error: "Usuario no autenticado" });
    }
    if (user.role !== "admin") {
      return res.status(403).json({ error: "Acceso restringido a administradores" });
    }
    next();
  }
  
  module.exports = { adminProxy };
  
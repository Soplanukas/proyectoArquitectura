const express = require('express');
const router = express.Router();
const db = require('../db');

// GET /api/users - Obtiene todos los usuarios
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT uid, email, name, role FROM users ORDER BY name');
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener los usuarios:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// PUT /api/users/:uid - Actualiza solo el nombre de un usuario
router.put('/:uid', async (req, res) => {
  const { uid } = req.params;
  const { name } = req.body;
  try {
    const result = await db.query(
      `UPDATE users SET name = $1, updated_at = CURRENT_TIMESTAMP WHERE uid = $2 RETURNING uid, email, name, role`,
      [name, uid]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error al actualizar el usuario:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

// DELETE /api/users/:uid - Elimina un usuario
router.delete('/:uid', async (req, res) => {
  const { uid } = req.params;
  try {
    const result = await db.query('DELETE FROM users WHERE uid = $1', [uid]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (error) {
    console.error("Error al eliminar el usuario:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const pool = require('../db');

// Obtener aulas
router.get('/aulas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Aulas');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al obtener aulas');
  }
});

// Crear aula
router.post('/aulas', async (req, res) => {
  try {
    const {
      nombre_materia,
      nombre_docente,
      aula_original,
      aula_remitente,
      piso,
      edificio
    } = req.body;

    const coordenadas = {
      "Edificio Administrativo": { x: 5.056447, z: -75.492854 },
      "Edificio Orlando sierra": { x: 5.055929, z: -75.492929 },
      "Edificio del Parque": { x: 5.055683, z: -75.493986 },
      "Edificio bicentenario (Mikaela)": { x: 5.054812, z: -75.495644 },
      "Sede Sancancio (Facultad Agropecuaria y Veterinaria)": { x: 5.054759, z: -75.492393 },
      "Edificio de Laboratorios Marco Tulio Jaramillo Salazar": { x: 5.055475, z: -75.492634 }
    };

    const { x, z } = coordenadas[edificio] || { x: null, z: null };

    const result = await pool.query(
      `INSERT INTO Aulas (
        nombre_materia, nombre_docente, aula_original, aula_remitente, piso, edificio, coordenada_x, coordenada_z
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *;`,
      [nombre_materia, nombre_docente, aula_original, aula_remitente, piso, edificio, x, z]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al crear aula');
  }
});

// Actualizar aula
router.put('/aulas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre_materia,
      nombre_docente,
      aula_original,
      aula_remitente,
      piso,
      edificio
    } = req.body;

    const result = await pool.query(
      `UPDATE Aulas SET
        nombre_materia = $1,
        nombre_docente = $2,
        aula_original = $3,
        aula_remitente = $4,
        piso = $5,
        edificio = $6
      WHERE id_aula = $7
      RETURNING *;`,
      [nombre_materia, nombre_docente, aula_original, aula_remitente, piso, edificio, id]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al actualizar aula');
  }
});

// Eliminar aula
router.delete('/aulas/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM Aulas WHERE id_aula = $1', [id]);
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error al eliminar aula');
  }
});

module.exports = router;

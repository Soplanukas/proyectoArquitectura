const express = require('express');
const router = express.Router();
const generarRespuesta = require('../ia/gemini');
const pool = require('../db');

router.post('/preguntar', async (req, res) => {
  const { mensaje } = req.body;

  try {
    const posiblesAulas = [...mensaje.matchAll(/\b([A-Z]{1,3}\d{2,4})\b/gi)].map(m => m[1].toUpperCase());

    let datosAula = null;
    for (const numero of posiblesAulas) {
      const consulta = await pool.query(
        "SELECT * FROM aulas WHERE aula_original = $1 OR aula_remitente = $1",
        [numero]
      );
      if (consulta.rows.length > 0) {
        datosAula = consulta.rows;
        break;
      }
    }

    if (datosAula) {
      const respuestaIA = await generarRespuesta(mensaje, datosAula);
      return res.json({ respuesta: respuestaIA });
    }

    // 🔍 Búsqueda por edificio
    const edificioMatch = mensaje.match(/edificio\s+([\w\s]+)/i);
    if (edificioMatch) {
      const nombreEdificio = edificioMatch[1].trim();
      const consultaEdificio = await pool.query(
        "SELECT * FROM aulas WHERE unaccent(edificio) ILIKE unaccent($1)",
        [`%${nombreEdificio}%`]
      );

      if (consultaEdificio.rows.length === 0) {
        return res.json({
          respuesta: "Lo siento, no encontré información para el edificio mencionado. ¿Podrías verificar el nombre?"
        });
      }

      const datosEdificio = consultaEdificio.rows;
      const respuestaIA = await generarRespuesta(mensaje, datosEdificio);
      return res.json({ respuesta: respuestaIA });
    }

    return res.json({
      respuesta: "No pude identificar claramente a qué te refieres. Intenta incluir un número de aula, el nombre del profesor o del edificio."
    });

  } catch (error) {
    console.error("Error al procesar la pregunta:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
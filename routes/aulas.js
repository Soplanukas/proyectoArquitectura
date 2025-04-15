//Importaciones de la db, repository y express
const express = require('express');
const router = express.Router();
const pool = require('../db');
const AulaRepository = require('../repositories/aulaRepository');

// Obtener todas las aulas para pruebas con postman
router.get('/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Aulas');
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
});

// Insertar un aula (Aun no implementado, esto seria para la parte del backend para usuarios administradores)
router.post('/', async (req, res) => {
    try {
        const {
            nombre_materia,
            nombre_docente,
            aula_original,
            aula_remitente,
            piso,
            edificio,
            coordenada_x,
            coordenada_z,
            dia,
            hora_inicio,
            hora_fin,
            fecha_inicio,
            fecha_fin,
        } = req.body;

        const query = `
      INSERT INTO Aulas (
        nombre_materia, nombre_docente, aula_original, aula_remitente,
        piso, edificio, coordenada_x, coordenada_z,
        dia, hora_inicio, hora_fin, fecha_inicio, fecha_fin
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
      RETURNING *;
    `;

        const values = [
            nombre_materia, nombre_docente, aula_original, aula_remitente,
            piso, edificio, coordenada_x, coordenada_z,
            dia, hora_inicio, hora_fin, fecha_inicio, fecha_fin
        ];

        const result = await pool.query(query, values);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error al insertar el aula');
    }
});

// Busqueda por filtros (AulaRepository)

router.get('/buscar', async (req, res) => {
    try {
        console.log("Query recibida:", req.query); // <-- Para ver los datos que llegan
        const resultados = await AulaRepository.buscar(req.query);
        res.json(resultados);

    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al buscar aulas' });
    }
});

module.exports = router;
// Importamos la conexion a la db
const pool = require('../db');

//Clase para agrupar funciones (En este caso solo la de busqueda)
class AulaRepository {
    //Funcion asincrona que recibe filtros para realizar una busqueda dinamica a la db, dependiendo de que filtro o que filtros le lleguen
    //Se usa unnacent para que no distinca entre tildes y ILIKE para que no distinga entre mayusculas y minusculas
    async buscar(filtros) {
        let query = 'SELECT * FROM aulas WHERE 1=1';
        const valores = [];

        if (filtros.edificio && filtros.edificio.trim() !== '') {
            valores.push(`%${filtros.edificio.trim()}%`);
            query += ` AND unaccent(edificio) ILIKE unaccent($${valores.length})`;
        }
        if (filtros.aula) {
            valores.push(filtros.aula);
            valores.push(filtros.aula);
            query += ` AND (aula_remitente ILIKE $${valores.length - 1} OR aula_original ILIKE $${valores.length})`;
          }
        if (filtros.piso && filtros.piso.trim() !== '') {
            valores.push(parseInt(filtros.piso));

            query += ` AND piso = $${valores.length}`;
        }
        if (filtros.nombre_docente && filtros.nombre_docente.trim() !== '') {
            valores.push(`%${filtros.nombre_docente.trim()}%`);
            query += ` AND unaccent(nombre_docente) ILIKE unaccent($${valores.length})`;
        }
        if (filtros.nombre_materia && filtros.nombre_materia.trim() !== '') {
            valores.push(`%${filtros.nombre_materia.trim()}%`);
            query += ` AND unaccent(nombre_materia) ILIKE unaccent($${valores.length})`;
        }

        //Se ejecuta la query y se devuelven los resultados
        const resultado = await pool.query(query, valores);
        return resultado.rows;
    }
}


//Exportamos la clase para poder usarla en otros archivos
module.exports = new AulaRepository();

// server/gemini.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require("dotenv").config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generarRespuesta(mensajeUsuario, datosEncontrados) {
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

  // Si datosEncontrados es un arreglo con múltiples resultados, creamos un listado
  let info;
  if (Array.isArray(datosEncontrados)) {
    info = datosEncontrados.map((item, index) => {
      const materia = item.nombre_materia ? `, Materia: ${item.nombre_materia}` : "";
      const docente = item.nombre_docente ? `, Docente: ${item.nombre_docente}` : "";
      const aula = (item.aula_original || item.aula_remitente)
        ? `, Aula original: ${item.aula_original || 'N/A'}, Aula actual (remitente): ${item.aula_remitente || 'N/A'}`
        : "";
      const piso = item.piso ? `, Piso: ${item.piso}` : "";
      const edificio = item.edificio ? `, Edificio: ${item.edificio}` : "";
      const dia = item.dia ? `, Día: ${item.dia}` : "";
      const hora = (item.hora_inicio && item.hora_fin) ? `, Horario: ${item.hora_inicio} - ${item.hora_fin}` : "";
      const fecha = (item.fecha_inicio && item.fecha_fin) ? `, Periodo: ${item.fecha_inicio} a ${item.fecha_fin}` : "";
      return `${index + 1}.${aula}${materia}${docente}${piso}${edificio}${dia}${hora}${fecha}`;
    }).join("\n");
  } else {
    info = JSON.stringify(datosEncontrados);
  }

  // Define el encabezado basado en el contenido disponible
  let encabezado = "La información encontrada es:";
  if (Array.isArray(datosEncontrados)) {
    encabezado = "Se encontraron las siguientes coincidencias:";
  } else if (datosEncontrados.aula_original || datosEncontrados.aula_remitente) {
    encabezado = "El aula encontrada tiene estos datos:";
  } else if (datosEncontrados.nombre_docente) {
    encabezado = "El docente encontrado tiene estos datos:";
  } else if (datosEncontrados.edificio) {
    encabezado = "El edificio encontrado tiene estos datos:";
  }

  const prompt = `
  Un estudiante pregunta: "${mensajeUsuario}".
  ${encabezado}
  ${info}
  Responde de forma amable pero directa.
  * Si el aula fue trasladada, menciona claramente cuál era la original y cuál es la actual.
  * Indica ubicación general, piso, materia, docente y horario si está disponible.
  * Si no hay datos suficientes, pide que verifique el número o revise el mapa.
  Responde usando formato Markdown (usa **negrita**, listas con *, etc.).
  `;
 
  const result = await model.generateContent({
    contents: [{
      parts: [{
        text: prompt
      }]
    }]
  });
  const response = await result.response;
  return response.text();
}

module.exports = generarRespuesta;


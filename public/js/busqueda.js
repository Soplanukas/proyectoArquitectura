//Funcion asincrona que esperará datos del servidor 
async function buscar() {
    // Se crea un objeto tipo query con los valores del formulario
    const query = {
      edificio: document.getElementById('edificio').value.trim(),
      aula: document.getElementById('aula').value.trim(),
      piso: document.getElementById('piso').value.trim(),
      nombre_docente: document.getElementById('docente').value.trim(),
      nombre_materia: document.getElementById('materia').value.trim()
    };
  
    // Se convierte el objeto a query string para enviarlo al servidor
    const params = new URLSearchParams(query).toString();
    // Hace petición al backend en la api designada y envia los parámetros arriba configurados
    const res = await fetch(`/api/aulas/buscar?${params}`);
    // Espera la respuesta del servidor y la convierte a json
    const data = await res.json();
    // se obtiene el contenedor donde se mostraran los resultados y se limpia para evitar duplicacion
    const resultadoDiv = document.getElementById('resultado');
    resultadoDiv.innerHTML = '';
  
    // Verifica si todos los campos están vacíos
    const todosVacios = Object.values(query).every(valor => valor === '');
    if (todosVacios) {
      // De ser cierto, se muestra un mensaje de advertencia
      resultadoDiv.innerHTML = '<p style="color: yellow;">⚠️ Debes llenar al menos un campo para buscar.</p>';
      return;
    }
  
    // Verifica si no se encontraron resultados
    if (data.length === 0) {
      // De ser cierto se muestra un mensaje
      resultadoDiv.innerHTML = '<p>No se encontraron coincidencias.</p>';
      return;
    }
  
    // Mostrar los resultados encontrados
    data.forEach((aula, index) => {
      const div = document.createElement('div');
      div.className = 'coincidencia';
      div.innerHTML = `
        <strong>✅ Coincidencia ${index + 1}</strong><br>
        <strong>Materia:</strong> ${aula.nombre_materia}<br>
        <strong>Docente:</strong> ${aula.nombre_docente}<br>
        <strong>Aula original:</strong> ${aula.aula_original}<br>
        <strong>Aula actual:</strong> ${aula.aula_remitente}<br>
        <strong>Edificio:</strong> ${aula.edificio}<br>
        <button onclick='resaltarEnMapa(${aula.coordenada_x}, ${aula.coordenada_z}, ${JSON.stringify(aula)})'>Seleccionar</button>
      `;
      // Se añade el div creado al contenedor de resultados
      //comentario para vainas
      resultadoDiv.appendChild(div);
    });
  }
  
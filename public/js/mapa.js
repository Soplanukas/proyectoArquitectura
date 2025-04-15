// Se importa la instancia creada en el modulo singleton
import instanciaMapa from './mapaSingleton.js';

// Variable local para almacenar el último marcador rojo 
let marcadorSeleccionado = null;

// Definición del icono rojo para remarcar la ubicación del aula seleccionada
const iconoRojo = L.icon({
  iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Función global accesible desde el HTML al hacer clic en el aula deseada
window.resaltarEnMapa = function (lat, lng, aula) {
  // Se obtiene la instancia del mapa singleton
  const map = instanciaMapa.getMapa();

  // Se verifica si existe un marcador rojo anterior y se elimina para evitar duplicados
  if (marcadorSeleccionado) {
    map.removeLayer(marcadorSeleccionado);
  }

  // Se crea un nuevo marcador con las coordenadas recibidas y el icono rojo
  marcadorSeleccionado = L.marker([lat, lng], { icon: iconoRojo })
    .addTo(map)
    .bindPopup(`<strong>${aula.edificio}</strong><br>Aula: ${aula.aula_remitente}<br>Piso: ${aula.piso}`)
    .openPopup();

  // Centra el mapa en la ubicación seleccionada
  map.setView([lat, lng], 18);

  // Se obtiene el contenedor HTML donde se mostrará la información correspondiente
  const infoDiv = document.getElementById('info-seleccionada');
  infoDiv.innerHTML = `
    <p><strong>Nombre del edificio:</strong> ${aula.edificio}</p>
    <p><strong>Nombre de la materia:</strong> ${aula.nombre_materia}</p>
    <p><strong>Nombre del docente:</strong> ${aula.nombre_docente}</p>
    <p><strong>Aula:</strong> ${aula.aula_remitente}</p>
    <p><strong>Piso del aula:</strong> ${aula.piso}</p>
  `;
};
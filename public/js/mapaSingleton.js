// Se implementa el patrón singleton para manejar una sola instancia del mapa leaflet

const L = window.L; // Asegura que L (Leaflet) está disponible globalmente

class MapaSingleton {
  constructor() {
    // Se verifica si ya existe una instancia y si es así se retorna para garantizar una sola instancia
    if (!MapaSingleton.instance) {
      this.inicializarMapa();
      MapaSingleton.instance = this;
    }
    return MapaSingleton.instance;
  }

  // Coordenadas de la Universidad de Caldas
  inicializarMapa() {
    const coordenadasUCaldas = [5.055603, -75.493782];
    // Inicializamos el mapa y lo centramos en las coordenadas de la Universidad de Caldas
    this.map = L.map("map").setView(coordenadasUCaldas, 18);
    
    // Se añade la capa base
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "© OpenStreetMap contributors",
      maxZoom: 19,
      crossOrigin: "anonymous",
    }).addTo(this.map);

    // Puntos clave de los edificios principales donde se encuentran las aulas
    const puntosClave = [
      { nombre: "Universidad de Caldas (Manizales)", coords: [5.056062, -75.492709], descripcion: "Entrada Principal Universidad de Caldas" },
      { nombre: "Edificio Administrativo", coords: [5.056447, -75.492854], descripcion: "Salas A, B y C del Edificio Administrativo y teatro 8 de julio" },
      { nombre: "Edificio Orlando sierra", coords: [5.055929, -75.492929], descripcion: "Centro académico principal" },
      { nombre: "Edificio del Parque", coords: [5.055683, -75.493986], descripcion: "Facultades de inteligencia artificial e ingenieria" },
      { nombre: "Edificio bicentenario (Mikaela)", coords: [5.054812, -75.495644], descripcion: "Facultad de ..." },
      { nombre: "Sede Sancancio (Facultad Agropecuaria y Veterinaria)", coords: [5.054759, -75.492393], descripcion: "Facultad de Ciencias Agropecuarias y Veterinaria" },
      { nombre: "Edificio de Laboratorios Marco Tulio Jaramillo Salazar", coords: [5.055475, -75.492634], descripcion: "Áreas del conocimiento cómo la fisicoquímica, química orgánica, química ambiental, entre otras." }
    ];

    // Se recorre cada punto clave para crear un marcador
    puntosClave.forEach(punto => {
      L.marker(punto.coords)
        .addTo(this.map)
        .bindPopup(`<b>${punto.nombre}</b><br>${punto.descripcion}`);
    });
  }

  // Método público para acceder a la instancia del mapa desde fuera de la clase
  getMapa() {
    return this.map;
  }
}

// Se crea una única instancia del singleton
const instanciaMapa = new MapaSingleton();

// Evita que la instancia pueda ser modificada, es una medida extra de seguridad
Object.freeze(instanciaMapa);

// Se exporta la única instancia del mapa
export default instanciaMapa;
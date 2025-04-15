import { fetchAulas, createAula, updateAula, deleteAula } from "./adminAulas.js";

/* ----------------- Sección de AULAS ----------------- */
// Función para renderizar las aulas en la tabla
export async function renderClassrooms() {
  const classrooms = await fetchAulas();
  const tbody = document.getElementById("classroomsTable").querySelector("tbody");
  tbody.innerHTML = "";
  classrooms.forEach(classroom => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${classroom.id_aula}</td>
      <td>${classroom.edificio}</td>
      <td>${classroom.aula_original}</td>
      <td>${classroom.aula_remitente}</td>
      <td>${classroom.piso}</td>
      <td>${classroom.nombre_docente}</td>
      <td>${classroom.nombre_materia}</td>
      <td>
        <button onclick="editClassroom(${classroom.id_aula})">Editar</button>
        <button onclick="deleteClassroom(${classroom.id_aula})">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Función para editar un aula
window.editClassroom = async function(id) {
  const classrooms = await fetchAulas();
  const classroom = classrooms.find(c => c.id_aula === id);
  if (!classroom) return;

  const newBuilding = prompt("Editar edificio:", classroom.edificio);
  const newAulaOriginal = prompt("Editar Aula Original:", classroom.aula_original);
  const newAulaRemitente = prompt("Editar Aula Remitente:", classroom.aula_remitente);
  const newFloor = prompt("Editar piso:", classroom.piso);
  const newTeacher = prompt("Editar docente:", classroom.nombre_docente);
  const newSubject = prompt("Editar asignatura:", classroom.nombre_materia);
  
  // Editar las coordenadas (por defecto las mismas del edificio, puedes modificar según sea necesario)
  const coordinates = {
    "Edificio Administrativo": { x: 5.056447, z: -75.492854 },
    "Edificio Orlando sierra": { x: 5.055929, z: -75.492929 },
    "Edificio del Parque": { x: 5.055683, z: -75.493986 },
    "Edificio bicentenario (Mikaela)": { x: 5.054812, z: -75.495644 },
    "Sede Sancancio (Facultad Agropecuaria y Veterinaria)": { x: 5.054759, z: -75.492393 },
    "Edificio de Laboratorios Marco Tulio Jaramillo Salazar": { x: 5.055475, z: -75.492634 }
  };

  const { x, z } = coordinates[newBuilding] || { x: null, z: null };
  
  if (newBuilding && newAulaOriginal && newAulaRemitente && newFloor && newTeacher && newSubject) {
    const updatedAula = { 
      edificio: newBuilding, 
      aula_original: newAulaOriginal, 
      aula_remitente: newAulaRemitente, 
      piso: newFloor, 
      nombre_docente: newTeacher, 
      nombre_materia: newSubject,
      coordenada_x: x,  // Actualizar coordenadas
      coordenada_z: z   // Actualizar coordenadas
    };
    await updateAula(id, updatedAula);
    renderClassrooms();
  }
};

// Función para eliminar un aula
window.deleteClassroom = async function(id) {
  if (confirm("¿Estás seguro de eliminar el aula?")) {
    await deleteAula(id);
    renderClassrooms();
  }
};

// Gestor del formulario de creación de aulas
const classroomForm = document.getElementById("addClassroomForm");
if (classroomForm) {
  classroomForm.addEventListener("submit", async function(e) {
    e.preventDefault();
    const building = document.getElementById("building").value;
    const classroomOriginal = document.getElementById("classroomOriginal").value;
    const classroomRemitente = document.getElementById("classroomRemitente").value;
    const floor = document.getElementById("floor").value;
    const teacher = document.getElementById("teacher").value;
    const subject = document.getElementById("subject").value;

    // Coordenadas por defecto según el edificio seleccionado
    const coordinates = {
      "Administrativo": { x: 5.056447, z: -75.492854 },
      "Orlando sierra": { x: 5.055929, z: -75.492929 },
      "Parque": { x: 5.055683, z: -75.493986 },
      "Micaela": { x: 5.054812, z: -75.495644 },
      "Agropecuaria": { x: 5.054759, z: -75.492393 },
      "Laboratorios Marco Tulio Jaramillo Salazar": { x: 5.055475, z: -75.492634 }
    };

    const { x, z } = coordinates[building] || { x: null, z: null };

    await createAula({ 
      edificio: building, 
      aula_original: classroomOriginal, 
      aula_remitente: classroomRemitente, 
      piso: floor, 
      nombre_docente: teacher, 
      nombre_materia: subject,
      coordenada_x: x,  // Incluir coordenadas al crear
      coordenada_z: z   // Incluir coordenadas al crear
    });

    renderClassrooms();
    hideClassroomForm(); // Asegúrate de tener implementada esta función para ocultar el formulario
    this.reset();
  });
}


// Función para mostrar el formulario de agregar aula
window.showClassroomForm = function() {
  document.getElementById("classroom-form").style.display = "block";
};

// Función para ocultar el formulario de agregar aula
window.hideClassroomForm = function() {
  document.getElementById("classroom-form").style.display = "none";
}


/* ----------------- Sección de USUARIOS ----------------- */
// Función para obtener los usuarios desde la API
async function fetchUsers() {
  try {
    const response = await fetch("/api/users");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
}

// Función para actualizar (solo el nombre) de un usuario
async function updateUser(uid, newName) {
  try {
    const response = await fetch(`/api/users/${uid}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newName }),
    });
    return await response.json();
  } catch (error) {
    console.error("Error al actualizar el usuario:", error);
  }
}

// Función para renderizar los usuarios en la tabla
async function renderUsers() {
  const users = await fetchUsers();
  const tbody = document.getElementById("studentsTable").querySelector("tbody");
  tbody.innerHTML = "";
  users.forEach(user => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${user.uid}</td>
      <td>${user.name}</td>
      <td>${user.email}</td>
      <td>
        <button onclick="editUser('${user.uid}')">Editar</button>
        <button onclick="deleteUser('${user.uid}')">Eliminar</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// Función para editar el nombre de un usuario
window.editUser = async function(uid) {
  const users = await fetchUsers();
  const user = users.find(u => u.uid === uid);
  if (!user) return;
  const newName = prompt("Editar nombre:", user.name);
  if (newName && newName !== user.name) {
    await updateUser(uid, newName);
    renderUsers();
  }
};

// Función para eliminar un usuario
window.deleteUser = async function(uid) {
  if (confirm("¿Estás seguro de eliminar este usuario?")) {
    try {
      await fetch(`/api/users/${uid}`, { method: "DELETE" });
      renderUsers();
    } catch (error) {
      console.error("Error al eliminar usuario:", error);
    }
  }
};

/* ----------------- Inicialización ----------------- */
document.addEventListener("DOMContentLoaded", () => {
  renderClassrooms();
  renderUsers();
});
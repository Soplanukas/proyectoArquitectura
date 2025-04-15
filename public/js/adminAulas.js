// Obtiene todas las aulas desde el backend
export async function fetchAulas() {
  try {
    const response = await fetch("/api/aulas");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener las aulas:", error);
    return [];
  }
}

// Crea una nueva aula
export async function createAula(aula) {
  try {
    const response = await fetch("/api/aulas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aula),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al crear el aula:", error);
  }
}

// Actualiza un aula
export async function updateAula(id, aula) {
  try {
    const response = await fetch(`/api/aulas/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(aula),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al actualizar el aula:", error);
  }
}

// Elimina un aula
export async function deleteAula(id) {
  try {
    await fetch(`/api/aulas/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error al eliminar el aula:", error);
  }
}

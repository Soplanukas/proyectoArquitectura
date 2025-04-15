export async function fetchUsers() {
    try {
      const response = await fetch("/api/users");
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      return [];
    }
  }
  
  export async function updateUser(uid, updatedUser) {
    try {
      const response = await fetch(`/api/users/${uid}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error al actualizar el usuario:", error);
    }
  }
  
  export async function deleteUser(uid) {
    try {
      await fetch(`/api/users/${uid}`, {
        method: "DELETE",
      });
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
    }
  }
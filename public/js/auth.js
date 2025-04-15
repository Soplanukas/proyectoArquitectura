import { getAuth } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";

export function requireAuth(redirectUrl = "index.html") {
  const auth = getAuth();
  // Espera 1 segundo para que Firebase establezca el estado de autenticación
  setTimeout(() => {
    if (!auth.currentUser) {
      alert("No has iniciado sesión. Redirigiendo al login...");
      window.location.href = redirectUrl;
    }
  }, 1000);
}
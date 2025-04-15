import { initializeApp } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-app.js";
import { getAuth, GoogleAuthProvider, signInWithPopup } from "https://www.gstatic.com/firebasejs/10.10.0/firebase-auth.js";


const firebaseConfig = {
  apiKey: "AIzaSyCGwFsmz6SKcFlJTyULAIk2rR6CHJ6liM4", 
  authDomain: "arquitectura-3b64b.firebaseapp.com",
  projectId: "arquitectura-3b64b",
  storageBucket: "arquitectura-3b64b.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abcdef123456"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

/**
 * Iniciar sesión con Google
 * @returns {Promise<{ token: string, user: object } | null>}
 */
export async function loginWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;
    const token = await user.getIdToken();

    console.log(" Usuario autenticado:", user.displayName, user.email);
    return { token, user };
  } catch (error) {
    console.error(" Error en autenticación:", error.code, error.message);
    
    // Manejo de errores específicos
    switch (error.code) {
      case "auth/popup-closed-by-user":
        alert("El usuario cerró la ventana de autenticación.");
        break;
      case "auth/cancelled-popup-request":
        alert("Se canceló la solicitud de autenticación.");
        break;
      case "auth/network-request-failed":
        alert("Error de red. Verifica tu conexión a internet.");
        break;
      default:
        alert("Error en el inicio de sesión. Inténtalo de nuevo.");
    }

    return null;
  }
}

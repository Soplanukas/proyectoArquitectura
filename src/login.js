import { loginWithGoogle } from "./firebaseConfig";

async function login() {
  const token = await loginWithGoogle();
  if (!token) return;

  const response = await fetch("http://localhost:3000/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token }),
  });

  const data = await response.json();
  console.log(data);
}

function Login() {
  return (
    <div>
      <h1>Iniciar Sesión</h1>
      <button onClick={login}>Login con Google</button>
    </div>
  );
}

export default Login;

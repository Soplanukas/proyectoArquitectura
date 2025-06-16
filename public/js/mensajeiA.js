import { marked } from 'https://cdn.jsdelivr.net/npm/marked/lib/marked.esm.js';


document.addEventListener('DOMContentLoaded', () => {
    const chatMensajes = document.getElementById('chat-mensajes');
    const formulario = document.getElementById('formulario');
    const input = document.getElementById('mensaje');

    formulario.addEventListener('submit', async (e) => {
      e.preventDefault();
      const mensaje = input.value.trim();
      if (!mensaje) return;

      agregarMensaje(mensaje, 'usuario');
      input.value = '';

      try {
        const respuesta = await fetch('/ia/preguntar', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ mensaje })
        });

        const data = await respuesta.json();
        agregarMensaje(data.respuesta || "Error en la respuesta", 'bot');
      } catch (err) {
        console.error(err);
        agregarMensaje("Ocurrió un error al conectar con el asistente.", 'bot');
      }
    });

    function agregarMensaje(texto, tipo) {
      const div = document.createElement('div');
      div.className = `mensaje ${tipo}`;
      div.innerHTML = tipo === 'bot' ? marked.parse(texto) : texto;
      chatMensajes.appendChild(div);
      chatMensajes.scrollTop = chatMensajes.scrollHeight;
    }
});
/* ==========================================================================
   Utilidades comunes del sitio (se usan desde los demás archivos .js)
   - Cambio 3: aviso (toast) de Bootstrap.
   - Cambio 5: la lógica del carrito y de los formularios pasó a carrito.js
     y formularios.js; aquí quedan las funciones que comparten todos.
   ========================================================================== */

var hayBootstrap = typeof bootstrap !== 'undefined';

// Muestra un mensaje corto en la esquina inferior (toast de Bootstrap)
function avisar(mensaje) {
    const toastEl = document.getElementById('toastAviso');
    if (!hayBootstrap || toastEl === null) {
        console.log('Aviso:', mensaje); // si no hay Bootstrap, el aviso se ve en la consola
        return;
    }
    document.getElementById('toastAvisoMsg').textContent = mensaje;
    bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 }).show();
}


/* ---------- Cambio 5: ventanas flotantes propias (sin Bootstrap) ---------- */

// Abre una ventana flotante agregando la clase "abierta"
function abrirVentana(idVentana) {
    const ventana = document.getElementById(idVentana);
    ventana.classList.add('abierta');
    ventana.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // evita que la página se desplace detrás
}

// Cierra una ventana flotante quitando la clase "abierta"
function cerrarVentana(idVentana) {
    const ventana = document.getElementById(idVentana);
    ventana.classList.remove('abierta');
    ventana.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
}

// Evento onclick del fondo oscuro: cierra solo si se hizo clic fuera del contenido
function cerrarSiEsFondo(evento, idVentana) {
    if (evento.target === evento.currentTarget) {
        cerrarVentana(idVentana);
    }
}

// La tecla Escape cierra cualquier ventana flotante que esté abierta
document.onkeydown = function (evento) {
    if (evento.key === 'Escape') {
        const ventanasAbiertas = document.querySelectorAll('.ventana-flotante.abierta');
        for (let i = 0; i < ventanasAbiertas.length; i++) {
            cerrarVentana(ventanasAbiertas[i].id);
        }
    }
};

/* ==========================================================================
   Cambio 5 — Menú de navegación responsivo con JavaScript
   (reemplaza el data-bs-toggle de Bootstrap por código propio)
   ========================================================================== */

const ANCHO_ESCRITORIO = 992; // desde este ancho el menú se muestra siempre (navbar-expand-lg)

const botonMenu = document.getElementById('botonMenu');
const menuPrincipal = document.getElementById('menuPrincipal');
let menuAbierto = false;

// Evento onclick del botón de las tres rayas
function alternarMenu() {
    if (menuAbierto) {
        cerrarMenu();
    } else {
        abrirMenu();
    }
}

function abrirMenu() {
    menuAbierto = true;
    menuPrincipal.classList.add('show');                 // la clase "show" hace visible el menú
    botonMenu.setAttribute('aria-expanded', 'true');
    botonMenu.innerHTML = '<i class="fa-solid fa-xmark"></i>'; // cambia el icono a una X
}

function cerrarMenu() {
    menuAbierto = false;
    menuPrincipal.classList.remove('show');
    botonMenu.setAttribute('aria-expanded', 'false');
    botonMenu.innerHTML = '<i class="fa-solid fa-bars"></i>';
}

// Al elegir una opción del menú en el celular, el menú se cierra solo
const enlacesMenu = document.querySelectorAll('.menu a');
for (let i = 0; i < enlacesMenu.length; i++) {
    enlacesMenu[i].onclick = function () {
        if (menuAbierto) {
            cerrarMenu();
        }
    };
}

// Si la ventana se agranda a tamaño escritorio, se reinicia el estado del menú
window.onresize = function () {
    if (window.innerWidth >= ANCHO_ESCRITORIO && menuAbierto) {
        cerrarMenu();
    }
};

// En la página de contacto el carrito no tiene productos: se ofrece ir a la carta
function irALaCarta() {
    const quiereIr = confirm('Los productos se eligen desde la carta de la página de inicio.\n¿Quieres ir a la carta ahora?');
    if (quiereIr) {
        window.location.href = '../index.html#carta';
    }
}

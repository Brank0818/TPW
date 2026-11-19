/* Cambio 3: diseño interactivo con Bootstrap (tooltips, toast, modal) */
document.addEventListener('DOMContentLoaded', function () {
    var hayBootstrap = typeof bootstrap !== 'undefined';
    var contador = document.querySelector('.content-shoping-cart .number');
    var carrito = document.querySelector('.container-shopping');
    var toastEl = document.getElementById('toastAviso');
    var toastMsg = document.getElementById('toastAvisoMsg');
    var toast = (hayBootstrap && toastEl) ? bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 }) : null;
    var total = 0;

    function avisar(mensaje) {
        if (!toast) return;
        toastMsg.textContent = mensaje;
        toast.show();
    }

    // Botones "añadir al carrito": tooltip + contador + aviso
    document.querySelectorAll('.add-car').forEach(function (btn) {
        btn.setAttribute('role', 'button');
        btn.setAttribute('tabindex', '0');
        btn.setAttribute('aria-label', 'Añadir al carrito');
        if (hayBootstrap) {
            btn.setAttribute('data-bs-toggle', 'tooltip');
            btn.setAttribute('data-bs-title', 'Añadir al carrito');
            new bootstrap.Tooltip(btn);
        }

        function agregar() {
            total++;
            if (contador) contador.textContent = '(' + total + ')';
            if (carrito) {
                carrito.classList.remove('bump');
                void carrito.offsetWidth; // reinicia la animación
                carrito.classList.add('bump');
            }
            var nombre = btn.closest('.card-product').querySelector('h3').textContent;
            avisar(nombre + ' se añadió al carrito');
        }

        btn.addEventListener('click', agregar);
        btn.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); agregar(); }
        });
    });

    // Modal de registro
    var formRegistro = document.getElementById('formRegistro');
    if (formRegistro && hayBootstrap) {
        formRegistro.addEventListener('submit', function (e) {
            e.preventDefault();
            var modal = bootstrap.Modal.getInstance(document.getElementById('modalRegistro'));
            if (modal) modal.hide();
            formRegistro.reset();
            avisar('¡Registro enviado! Revisa tu correo.');
        });
    }

    // Formulario de reserva (página de contacto)
    var formReserva = document.querySelector('.reserva-form');
    if (formReserva) {
        formReserva.addEventListener('submit', function (e) {
            e.preventDefault();
            formReserva.reset();
            avisar('Reserva enviada. Te confirmaremos pronto.');
        });
    }
});

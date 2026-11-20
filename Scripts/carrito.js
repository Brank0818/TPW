/* ==========================================================================
   Cambio 5 — Carrito de compras con JavaScript
   - Los productos elegidos se guardan en el arreglo "carrito".
   - El panel lateral (ventana flotante) se dibuja con el DOM.
   - Se usan confirm(), prompt() y alert() para confirmar acciones.
   ========================================================================== */

// Constantes: valores que no cambian durante la ejecución
const CANTIDAD_MAXIMA = 10;       // unidades máximas por producto
const MINUTOS_BASE = 5;           // tiempo mínimo de preparación
const MINUTOS_POR_UNIDAD = 2;     // tiempo extra por cada bebida

// Arreglo con los productos del carrito: { id, nombre, imagen, tamano, precio, cantidad }
const carrito = [];

let porcentajeDescuento = 0;   // descuento del cupón aplicado (0, 10 o 15)
let cuponAplicado = '';
let edadConfirmada = false;    // para no preguntar la edad cada vez
let numeroPedido = 100;        // número correlativo de los pedidos

// Elementos del HTML del panel del carrito
const contadorCarrito = document.querySelector('.content-shoping-cart .number');
const iconoCarrito = document.querySelector('.container-shopping');
const listaCarrito = document.getElementById('listaCarrito');
const mensajeCarritoVacio = document.getElementById('carritoVacio');
const textoSubtotal = document.getElementById('carritoSubtotal');
const filaDescuento = document.getElementById('filaDescuento');
const textoDescuento = document.getElementById('carritoDescuento');
const textoTotal = document.getElementById('carritoTotal');


/* ---------- Cálculos ---------- */

// Cantidad total de bebidas (suma de las cantidades de cada fila)
function contarUnidades() {
    let unidades = 0;
    for (let i = 0; i < carrito.length; i++) {
        unidades += carrito[i].cantidad;
    }
    return unidades;
}

// Suma de precio × cantidad de cada producto
function calcularSubtotal() {
    let subtotal = 0;
    for (let i = 0; i < carrito.length; i++) {
        subtotal += carrito[i].precio * carrito[i].cantidad;
    }
    return subtotal;
}


/* ---------- Agregar productos ---------- */

// Agrega un producto al carrito. Devuelve true si se agregó y false si no.
function agregarAlCarrito(idProducto, tamano, cantidad) {
    const producto = buscarProductoPorId(idProducto); // función de productos.js
    if (producto === null) {
        return false;
    }

    // Los productos con alcohol piden confirmar la mayoría de edad (solo una vez)
    if (producto.contieneAlcohol && !edadConfirmada) {
        const esMayorDeEdad = confirm('El ' + producto.nombre + ' contiene alcohol.\n¿Confirmas que eres mayor de 18 años?');
        if (!esMayorDeEdad) {
            alert('Lo sentimos, este producto solo está disponible para mayores de edad.');
            return false;
        }
        edadConfirmada = true;
    }

    // Se busca si el mismo producto con el mismo tamaño ya está en el carrito
    let posicion = -1;
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === idProducto && carrito[i].tamano === tamano) {
            posicion = i;
            break;
        }
    }

    if (posicion !== -1) {
        // Ya existe: solo se aumenta la cantidad (sin pasar del máximo)
        if (carrito[posicion].cantidad + cantidad > CANTIDAD_MAXIMA) {
            alert('Ya tienes ' + carrito[posicion].cantidad + ' unidades de ' + producto.nombre +
                '. El máximo por producto es ' + CANTIDAD_MAXIMA + '.');
            return false;
        }
        carrito[posicion].cantidad += cantidad;
    } else {
        // No existe: se agrega un nuevo elemento al arreglo
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            imagen: producto.imagen,
            tamano: tamano,
            precio: calcularPrecioSegunTamano(producto.precio, tamano),
            cantidad: cantidad
        });
    }

    actualizarCarrito();
    animarIconoCarrito();
    avisar(cantidad + ' × ' + producto.nombre + ' (' + tamano + ') se añadió al carrito');
    console.log('Carrito:', carrito);
    return true;
}

// Animación "bump" del icono del encabezado (la clase está en style.css)
function animarIconoCarrito() {
    iconoCarrito.classList.remove('bump');
    void iconoCarrito.offsetWidth; // reinicia la animación
    iconoCarrito.classList.add('bump');
}


/* ---------- Dibujar el carrito ---------- */

// Vuelve a dibujar el panel y el contador cada vez que cambia el arreglo
function actualizarCarrito() {
    contadorCarrito.textContent = '(' + contarUnidades() + ')';

    // Se borra la lista y se crea un <li> por cada producto
    listaCarrito.innerHTML = '';
    for (let i = 0; i < carrito.length; i++) {
        listaCarrito.appendChild(crearFilaCarrito(carrito[i], i));
    }

    // Mensaje de carrito vacío y estado de los botones
    const estaVacio = carrito.length === 0;
    if (estaVacio) {
        mensajeCarritoVacio.style.display = 'block';
        porcentajeDescuento = 0; // si se vacía, el cupón deja de aplicarse
        cuponAplicado = '';
    } else {
        mensajeCarritoVacio.style.display = 'none';
    }

    const botonesAccion = document.querySelectorAll('.carrito-acciones button');
    for (let i = 0; i < botonesAccion.length; i++) {
        botonesAccion[i].disabled = estaVacio;
    }

    // Totales
    const subtotal = calcularSubtotal();
    const montoDescuento = subtotal * porcentajeDescuento / 100;
    const total = subtotal - montoDescuento;

    textoSubtotal.textContent = formatearPrecio(subtotal);
    textoTotal.textContent = formatearPrecio(total);

    if (porcentajeDescuento > 0) {
        filaDescuento.style.display = 'flex';
        textoDescuento.textContent = '- ' + formatearPrecio(montoDescuento) + ' (' + cuponAplicado + ')';
    } else {
        filaDescuento.style.display = 'none';
    }
}

// Crea la fila de un producto del carrito con sus botones
function crearFilaCarrito(item, posicion) {
    const fila = document.createElement('li');
    fila.className = 'item-carrito';

    const imagen = document.createElement('img');
    imagen.src = item.imagen;
    imagen.alt = item.nombre;

    const datos = document.createElement('div');
    datos.className = 'item-datos';
    datos.innerHTML = '<h4>' + item.nombre + '</h4>' +
        '<p>' + item.tamano + ' · ' + formatearPrecio(item.precio) + ' c/u</p>';

    // Controles de cantidad
    const controles = document.createElement('div');
    controles.className = 'control-cantidad';

    const botonMenos = document.createElement('button');
    botonMenos.type = 'button';
    botonMenos.textContent = '−';
    botonMenos.setAttribute('aria-label', 'Quitar una unidad');
    botonMenos.onclick = function () {
        cambiarCantidadCarrito(posicion, -1);
    };

    const cantidad = document.createElement('span');
    cantidad.textContent = item.cantidad;

    const botonMas = document.createElement('button');
    botonMas.type = 'button';
    botonMas.textContent = '+';
    botonMas.setAttribute('aria-label', 'Agregar una unidad');
    botonMas.onclick = function () {
        cambiarCantidadCarrito(posicion, 1);
    };

    controles.appendChild(botonMenos);
    controles.appendChild(cantidad);
    controles.appendChild(botonMas);
    datos.appendChild(controles);

    // Subtotal de la fila y botón eliminar
    const lateral = document.createElement('div');
    lateral.className = 'item-lateral';

    const subtotal = document.createElement('strong');
    subtotal.textContent = formatearPrecio(item.precio * item.cantidad);

    const botonEliminar = document.createElement('button');
    botonEliminar.type = 'button';
    botonEliminar.className = 'item-eliminar';
    botonEliminar.innerHTML = '<i class="bi bi-trash3"></i>';
    botonEliminar.setAttribute('aria-label', 'Eliminar ' + item.nombre);
    botonEliminar.onclick = function () {
        eliminarDelCarrito(posicion);
    };

    lateral.appendChild(subtotal);
    lateral.appendChild(botonEliminar);

    fila.appendChild(imagen);
    fila.appendChild(datos);
    fila.appendChild(lateral);
    return fila;
}


/* ---------- Modificar el carrito ---------- */

function cambiarCantidadCarrito(posicion, cambio) {
    const nuevaCantidad = carrito[posicion].cantidad + cambio;

    if (nuevaCantidad < 1) {
        eliminarDelCarrito(posicion); // al llegar a 0 se pregunta si se elimina
    } else if (nuevaCantidad > CANTIDAD_MAXIMA) {
        alert('El máximo por producto es ' + CANTIDAD_MAXIMA + ' unidades.');
    } else {
        carrito[posicion].cantidad = nuevaCantidad;
        actualizarCarrito();
    }
}

function eliminarDelCarrito(posicion) {
    const item = carrito[posicion];
    const confirmado = confirm('¿Quieres quitar ' + item.nombre + ' (' + item.tamano + ') del carrito?');
    if (confirmado) {
        carrito.splice(posicion, 1); // elimina 1 elemento del arreglo en esa posición
        actualizarCarrito();
        avisar(item.nombre + ' se quitó del carrito');
    }
}

function vaciarCarrito() {
    if (carrito.length === 0) {
        return;
    }
    if (confirm('¿Seguro que quieres vaciar todo el carrito?')) {
        carrito.splice(0, carrito.length);
        actualizarCarrito();
        avisar('El carrito está vacío');
    }
}

// Pide un código con prompt() y aplica el descuento si es válido
function aplicarCupon() {
    const codigoIngresado = prompt('Ingresa tu código de descuento:');

    if (codigoIngresado === null) {
        return; // el usuario presionó "Cancelar"
    }

    const codigo = codigoIngresado.trim().toUpperCase();
    const subtotal = calcularSubtotal();

    switch (codigo) {
        case 'AROMA10':
            porcentajeDescuento = 10;
            cuponAplicado = codigo;
            alert('¡Cupón aplicado! Tienes 10% de descuento.');
            break;
        case 'GRANO15':
            if (subtotal >= 30) {
                porcentajeDescuento = 15;
                cuponAplicado = codigo;
                alert('¡Cupón aplicado! Tienes 15% de descuento.');
            } else {
                alert('El cupón GRANO15 es válido para compras desde S/30.00. Tu subtotal es ' +
                    formatearPrecio(subtotal) + '.');
            }
            break;
        case '':
            alert('No escribiste ningún código.');
            break;
        default:
            alert('El código "' + codigo + '" no es válido.');
    }

    actualizarCarrito();
}

// Finaliza la compra usando prompt(), confirm() y alert()
function finalizarPedido() {
    if (carrito.length === 0) {
        alert('Tu carrito está vacío. Agrega algún café de la carta.');
        return;
    }

    const nombreIngresado = prompt('¿A nombre de quién preparamos tu pedido?');
    if (nombreIngresado === null) {
        return;
    }
    const nombreCliente = nombreIngresado.trim();
    if (nombreCliente.length < 2) {
        alert('Por favor, escribe un nombre válido para tu pedido.');
        return;
    }

    // Se arma el resumen recorriendo el carrito
    let resumen = 'Resumen del pedido de ' + nombreCliente + ':\n\n';
    for (let i = 0; i < carrito.length; i++) {
        resumen += '• ' + carrito[i].cantidad + ' × ' + carrito[i].nombre + ' (' + carrito[i].tamano + ')\n';
    }
    resumen += '\nTotal a pagar: ' + textoTotal.textContent + '\n\n¿Confirmas tu pedido?';

    if (!confirm(resumen)) {
        return;
    }

    // Tiempo estimado: base + minutos por cada bebida, con un máximo de 30
    let minutos = MINUTOS_BASE + contarUnidades() * MINUTOS_POR_UNIDAD;
    if (minutos > 30) {
        minutos = 30;
    }

    numeroPedido++;
    alert('¡Gracias, ' + nombreCliente + '!\nTu pedido N.° ' + numeroPedido +
        ' estará listo en aproximadamente ' + minutos + ' minutos.');

    carrito.splice(0, carrito.length);
    actualizarCarrito();
    cerrarCarrito();
}


/* ---------- Abrir y cerrar el panel ---------- */

function abrirCarrito() {
    actualizarCarrito();
    abrirVentana('ventanaCarrito');
}

function cerrarCarrito() {
    cerrarVentana('ventanaCarrito');
}

// Estado inicial del panel
actualizarCarrito();

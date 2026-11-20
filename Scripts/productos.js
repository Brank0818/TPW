/* ==========================================================================
   Cambio 5 — Carta de productos con JavaScript
   - Los productos se guardan en un ARREGLO de objetos.
   - Las tarjetas se crean con el DOM (antes estaban repetidas en el HTML).
   - Filtros por categoría, búsqueda y orden.
   - Ventana flotante (modal propio) con el detalle de cada producto.
   ========================================================================== */

// Arreglo con todos los productos de la cafetería.
// Cada elemento es un objeto literal con los datos de un producto.
const productos = [
    {
        id: 1, nombre: 'Café Irish', categoria: 'caliente', precio: 4.60, estrellas: 4,
        imagen: 'cafe-irish.jpg', destacado: true, etiqueta: 'Más vendido', contieneAlcohol: true,
        descripcion: 'Café caliente con un toque de whisky irlandés, azúcar morena y una capa de crema batida.',
        ingredientes: ['Espresso doble', 'Whisky irlandés', 'Azúcar morena', 'Crema batida']
    },
    {
        id: 2, nombre: 'Café Inglés', categoria: 'frio', precio: 4.90, estrellas: 4,
        imagen: 'cafe-ingles.jpg', destacado: true, etiqueta: '', contieneAlcohol: false,
        descripcion: 'Latte frío con té negro y perlas de café, suave y refrescante.',
        ingredientes: ['Espresso', 'Té negro', 'Leche fría', 'Perlas de café', 'Hielo']
    },
    {
        id: 3, nombre: 'Café Australiano', categoria: 'caliente', precio: 4.80, estrellas: 5,
        imagen: 'cafe-australiano.jpg', destacado: true, etiqueta: 'Nuevo', contieneAlcohol: false,
        descripcion: 'Estilo flat white: espresso con leche texturizada, crema y granos de café tostado.',
        ingredientes: ['Espresso doble', 'Leche texturizada', 'Crema', 'Granos de café']
    },
    {
        id: 4, nombre: 'Café Helado', categoria: 'frio', precio: 5.20, estrellas: 4,
        imagen: 'cafe-helado.jpg', destacado: true, etiqueta: '', contieneAlcohol: false,
        descripcion: 'Espresso batido con hielo y espuma cremosa. Ideal para las tardes de verano.',
        ingredientes: ['Espresso', 'Hielo', 'Azúcar', 'Espuma de café']
    },
    {
        id: 5, nombre: 'Espresso', categoria: 'caliente', precio: 3.50, estrellas: 5,
        imagen: 'cafe-australiano.jpg', destacado: false, etiqueta: '', contieneAlcohol: false,
        descripcion: 'Shot intenso de café peruano de tueste medio, con crema dorada.',
        ingredientes: ['Café molido de origen peruano', 'Agua filtrada']
    },
    {
        id: 6, nombre: 'Cappuccino', categoria: 'caliente', precio: 4.20, estrellas: 4,
        imagen: 'cafe-australiano.jpg', destacado: false, etiqueta: '', contieneAlcohol: false,
        descripcion: 'Espresso con leche espumada y un toque de canela.',
        ingredientes: ['Espresso', 'Leche espumada', 'Canela']
    },
    {
        id: 7, nombre: 'Mocaccino', categoria: 'caliente', precio: 5.00, estrellas: 4,
        imagen: 'cafe-australiano.jpg', destacado: false, etiqueta: '', contieneAlcohol: false,
        descripcion: 'La mezcla perfecta de espresso, chocolate y leche caliente.',
        ingredientes: ['Espresso', 'Chocolate', 'Leche', 'Crema batida']
    },
    {
        id: 8, nombre: 'Cold Brew', categoria: 'frio', precio: 5.50, estrellas: 5,
        imagen: 'cafe-helado.jpg', destacado: false, etiqueta: '', contieneAlcohol: false,
        descripcion: 'Café infusionado en frío durante 18 horas: suave, dulce y con poca acidez.',
        ingredientes: ['Café de especialidad', 'Agua fría', 'Hielo']
    },
    {
        id: 9, nombre: 'Iced Latte de vainilla', categoria: 'frio', precio: 5.30, estrellas: 4,
        imagen: 'cafe-ingles.jpg', destacado: false, etiqueta: '', contieneAlcohol: false,
        descripcion: 'Espresso, leche fría y jarabe de vainilla sobre hielo.',
        ingredientes: ['Espresso', 'Leche fría', 'Jarabe de vainilla', 'Hielo']
    },
    {
        id: 10, nombre: 'Frappuccino de caramelo', categoria: 'frappuccino', precio: 6.50, estrellas: 5,
        imagen: 'cafe-irish.jpg', destacado: false, etiqueta: '', contieneAlcohol: false,
        descripcion: 'Café licuado con hielo, salsa de caramelo y crema batida.',
        ingredientes: ['Café', 'Hielo', 'Salsa de caramelo', 'Leche', 'Crema batida']
    },
    {
        id: 11, nombre: 'Frappuccino de moka', categoria: 'frappuccino', precio: 6.80, estrellas: 4,
        imagen: 'cafe-irish.jpg', destacado: false, etiqueta: '', contieneAlcohol: false,
        descripcion: 'Café licuado con chocolate, hielo y crema batida con cacao.',
        ingredientes: ['Café', 'Chocolate', 'Hielo', 'Leche', 'Crema batida']
    },
    {
        id: 12, nombre: 'Frappuccino de vainilla', categoria: 'frappuccino', precio: 6.20, estrellas: 3,
        imagen: 'cafe-ingles.jpg', destacado: false, etiqueta: '', contieneAlcohol: false,
        descripcion: 'Bebida helada y cremosa de café con vainilla natural.',
        ingredientes: ['Café', 'Vainilla', 'Hielo', 'Leche']
    }
];

// Estado actual de la carta (cambia cuando el usuario filtra, busca u ordena)
let categoriaActual = 'todos';
let textoBuscado = '';
let ordenActual = 'recomendado';

// Producto que se muestra en la ventana de detalle y su cantidad elegida
let productoSeleccionado = null;
let cantidadDetalle = 1;

// Elementos del HTML que se usan varias veces
const contenedorDestacados = document.getElementById('contenedorDestacados');
const contenedorCarta = document.getElementById('contenedorCarta');
const contadorResultados = document.getElementById('contadorResultados');
const mensajeSinResultados = document.getElementById('mensajeSinResultados');
const botonLimpiarBusqueda = document.getElementById('botonLimpiarBusqueda');


/* ---------- Funciones de apoyo ---------- */

// Devuelve el precio con el formato de la página: S/4.60
function formatearPrecio(precio) {
    return 'S/' + precio.toFixed(2);
}

// Busca un producto en el arreglo por su id. Si no lo encuentra devuelve null.
function buscarProductoPorId(id) {
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].id === id) {
            return productos[i];
        }
    }
    return null;
}

// Traduce el código de la categoría a un texto para mostrar
function nombreCategoria(categoria) {
    switch (categoria) {
        case 'caliente':
            return 'Café caliente';
        case 'frio':
            return 'Café frío';
        case 'frappuccino':
            return 'Frappuccino';
        default:
            return 'Todos los productos';
    }
}

// Calcula el precio según el tamaño elegido (el precio base es el del tamaño mediano)
function calcularPrecioSegunTamano(precioBase, tamano) {
    let precioFinal = precioBase;
    switch (tamano) {
        case 'Pequeño':
            precioFinal = precioBase - 0.50;
            break;
        case 'Grande':
            precioFinal = precioBase + 1.00;
            break;
        default: // Mediano
            precioFinal = precioBase;
    }
    return precioFinal;
}

// Pasa el texto a minúsculas y quita las tildes para que "cafe" encuentre "Café"
function normalizarTexto(texto) {
    const minusculas = texto.toLowerCase();
    let resultado = '';
    for (let i = 0; i < minusculas.length; i++) {
        let letra = minusculas[i];
        switch (letra) {
            case 'á': letra = 'a'; break;
            case 'é': letra = 'e'; break;
            case 'í': letra = 'i'; break;
            case 'ó': letra = 'o'; break;
            case 'ú': letra = 'u'; break;
        }
        resultado += letra;
    }
    return resultado;
}

// Crea el HTML de las 5 estrellas: llenas según la valoración y vacías el resto
function crearEstrellas(cantidad) {
    let html = '';
    for (let i = 1; i <= 5; i++) {
        if (i <= cantidad) {
            html += '<i class="fa-solid fa-star"></i>';
        } else {
            html += '<i class="fa-regular fa-star"></i>';
        }
    }
    return html;
}


/* ---------- Creación de tarjetas con el DOM ---------- */

// Crea una tarjeta (con el mismo diseño que tenían en el HTML) a partir de un producto
function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'card-product';
    tarjeta.setAttribute('tabindex', '0');
    tarjeta.setAttribute('title', 'Ver detalle de ' + producto.nombre);

    let html = '<div class="container-img">';
    if (producto.etiqueta !== '') {
        html += '<span class="badge badge-top">' + producto.etiqueta + '</span>';
    }
    html += '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">';
    html += '</div>';
    html += '<div class="content-card-product">';
    html += '<div class="stars">' + crearEstrellas(producto.estrellas) + '</div>';
    html += '<h3>' + producto.nombre + '</h3>';
    html += '<button type="button" class="add-car" title="Añadir al carrito" aria-label="Añadir ' +
        producto.nombre + ' al carrito"><i class="fa-solid fa-cart-shopping"></i></button>';
    html += '<p class="price">' + formatearPrecio(producto.precio) + '</p>';
    html += '</div>';
    tarjeta.innerHTML = html;

    // Evento: al hacer clic en la tarjeta se abre la ventana de detalle
    tarjeta.onclick = function () {
        abrirDetalleProducto(producto.id);
    };

    // Evento de teclado: Enter sobre la tarjeta también abre el detalle
    tarjeta.onkeydown = function (evento) {
        if (evento.key === 'Enter' && evento.target === tarjeta) {
            abrirDetalleProducto(producto.id);
        }
    };

    // Evento del botón del carrito: añade directamente un producto mediano
    const botonAgregar = tarjeta.querySelector('.add-car');
    botonAgregar.onclick = function (evento) {
        evento.stopPropagation(); // evita que también se abra el detalle
        agregarAlCarrito(producto.id, 'Mediano', 1);
    };

    return tarjeta;
}

// Muestra en "Mejores productos" solo los que tienen destacado: true
function mostrarDestacados() {
    contenedorDestacados.innerHTML = '';
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].destacado) {
            contenedorDestacados.appendChild(crearTarjetaProducto(productos[i]));
        }
    }
}


/* ---------- Carta: filtros, búsqueda y orden ---------- */

// Ordena el arreglo recibido según el criterio elegido en el <select>
function ordenarProductos(lista, criterio) {
    switch (criterio) {
        case 'precio-menor':
            lista.sort(function (a, b) { return a.precio - b.precio; });
            break;
        case 'precio-mayor':
            lista.sort(function (a, b) { return b.precio - a.precio; });
            break;
        case 'valoracion':
            lista.sort(function (a, b) { return b.estrellas - a.estrellas; });
            break;
        case 'nombre':
            lista.sort(function (a, b) {
                // se comparan sin tildes para que el orden alfabético sea correcto
                if (normalizarTexto(a.nombre) < normalizarTexto(b.nombre)) {
                    return -1;
                }
                return 1;
            });
            break;
        default: // recomendado: el orden original del arreglo
            lista.sort(function (a, b) { return a.id - b.id; });
    }
}

// Dibuja la carta aplicando la categoría, el texto buscado y el orden actuales
function mostrarCarta() {
    // 1. Filtrar: se recorre el arreglo y se guardan los productos que cumplen
    const resultado = [];
    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        const coincideCategoria = categoriaActual === 'todos' || producto.categoria === categoriaActual;
        const coincideTexto = normalizarTexto(producto.nombre).indexOf(textoBuscado) !== -1;

        if (coincideCategoria && coincideTexto) {
            resultado.push(producto);
        }
    }

    // 2. Ordenar
    ordenarProductos(resultado, ordenActual);

    // 3. Borrar las tarjetas anteriores y crear las nuevas
    contenedorCarta.innerHTML = '';
    for (let i = 0; i < resultado.length; i++) {
        contenedorCarta.appendChild(crearTarjetaProducto(resultado[i]));
    }

    // 4. Actualizar los mensajes
    let texto = resultado.length + ' producto(s) en ' + nombreCategoria(categoriaActual);
    if (textoBuscado !== '') {
        texto += ' para "' + textoBuscado + '"';
        botonLimpiarBusqueda.style.display = 'inline-block';
    } else {
        botonLimpiarBusqueda.style.display = 'none';
    }
    contadorResultados.textContent = texto;

    if (resultado.length === 0) {
        mensajeSinResultados.style.display = 'block';
    } else {
        mensajeSinResultados.style.display = 'none';
    }

    console.log('Carta actualizada:', resultado.length, 'productos mostrados');
}

// Evento onclick de los botones de categoría
function filtrarPorCategoria(categoria, botonPresionado) {
    categoriaActual = categoria;

    // Se quita la clase "activo" de todos los botones y se agrega solo al presionado
    const botones = document.querySelectorAll('.btn-filtro');
    for (let i = 0; i < botones.length; i++) {
        botones[i].classList.remove('activo');
        botones[i].setAttribute('aria-pressed', 'false');
    }
    botonPresionado.classList.add('activo');
    botonPresionado.setAttribute('aria-pressed', 'true');

    mostrarCarta();
}

// Evento onchange del <select> de orden
function cambiarOrden(criterio) {
    ordenActual = criterio;
    mostrarCarta();
}

// Evento onsubmit del buscador del encabezado
function buscarProducto(evento) {
    evento.preventDefault(); // evita que la página se recargue
    const campoBuscar = document.getElementById('buscar');
    const texto = normalizarTexto(campoBuscar.value.trim());

    if (texto === '') {
        alert('Escribe el nombre de un café para buscarlo en la carta.');
        campoBuscar.focus();
        return;
    }

    textoBuscado = texto;
    mostrarCarta();
    cerrarMenu(); // en celulares se cierra el menú desplegable (menu.js)
    document.getElementById('carta').scrollIntoView({ behavior: 'smooth' });
}

// Quita el texto buscado y vuelve a mostrar la carta completa de la categoría
function limpiarBusqueda() {
    textoBuscado = '';
    document.getElementById('buscar').value = '';
    mostrarCarta();
}


/* ---------- Ventana flotante con el detalle del producto ---------- */

function abrirDetalleProducto(id) {
    const producto = buscarProductoPorId(id);
    if (producto === null) {
        console.error('No existe un producto con id', id);
        return;
    }

    productoSeleccionado = producto;
    cantidadDetalle = 1;

    // Se modifican contenido y atributos de los elementos de la ventana
    const imagen = document.getElementById('detalleImagen');
    imagen.setAttribute('src', producto.imagen);
    imagen.setAttribute('alt', producto.nombre);
    document.getElementById('detalleCategoria').textContent = nombreCategoria(producto.categoria);
    document.getElementById('detalleNombre').textContent = producto.nombre;
    document.getElementById('detalleEstrellas').innerHTML = crearEstrellas(producto.estrellas);
    document.getElementById('detalleDescripcion').textContent = producto.descripcion;

    // Lista de ingredientes: se crea un <li> por cada elemento del arreglo
    const listaIngredientes = document.getElementById('detalleIngredientes');
    listaIngredientes.innerHTML = '';
    for (let i = 0; i < producto.ingredientes.length; i++) {
        const item = document.createElement('li');
        item.textContent = producto.ingredientes[i];
        listaIngredientes.appendChild(item);
    }

    // El aviso de alcohol solo se muestra si el producto lo contiene
    const avisoAlcohol = document.getElementById('detalleAlcohol');
    if (producto.contieneAlcohol) {
        avisoAlcohol.style.display = 'flex';
    } else {
        avisoAlcohol.style.display = 'none';
    }

    document.getElementById('detalleTamano').value = 'Mediano';
    actualizarPrecioDetalle();
    abrirVentana('ventanaProducto');
}

function cerrarDetalleProducto() {
    cerrarVentana('ventanaProducto');
}

// Evento onchange del tamaño y de los botones + / -: recalcula el total
function actualizarPrecioDetalle() {
    const tamano = document.getElementById('detalleTamano').value;
    const precioUnitario = calcularPrecioSegunTamano(productoSeleccionado.precio, tamano);
    const total = precioUnitario * cantidadDetalle;

    document.getElementById('detalleCantidad').textContent = cantidadDetalle;
    document.getElementById('detallePrecioUnitario').textContent = formatearPrecio(precioUnitario) + ' c/u';
    document.getElementById('detallePrecio').textContent = formatearPrecio(total);
}

// Suma o resta unidades respetando el mínimo (1) y el máximo permitido
function cambiarCantidadDetalle(cambio) {
    const nuevaCantidad = cantidadDetalle + cambio;

    if (nuevaCantidad < 1) {
        return;
    } else if (nuevaCantidad > CANTIDAD_MAXIMA) {
        alert('Puedes pedir como máximo ' + CANTIDAD_MAXIMA + ' unidades de un mismo producto.');
        return;
    }

    cantidadDetalle = nuevaCantidad;
    actualizarPrecioDetalle();
}

// Botón "Añadir al carrito" de la ventana de detalle
function agregarDesdeDetalle() {
    const tamano = document.getElementById('detalleTamano').value;
    const seAgrego = agregarAlCarrito(productoSeleccionado.id, tamano, cantidadDetalle);
    if (seAgrego) {
        cerrarDetalleProducto();
    }
}


/* ---------- Al cargar la página ---------- */
mostrarDestacados();
mostrarCarta();
console.log('Carta de Aroma & Grano cargada con', productos.length, 'productos.');

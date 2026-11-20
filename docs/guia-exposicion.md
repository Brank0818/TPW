# Guía de exposición — Avance 5: JavaScript en Aroma & Grano

**Duración sugerida:** 30 a 36 minutos (5 a 6 minutos por integrante).

**Antes de empezar:**
- Abran `index.html` en el navegador, con conexión a internet para que carguen Bootstrap y los iconos.
- Tengan las herramientas del navegador abiertas (F12 → pestaña **Console**).
- Tengan los archivos de `Scripts/` abiertos en el editor.
- Para mostrar la vista de celular usen el modo dispositivo (Ctrl + Shift + M en Chrome o Edge).

| Orden | Integrante | Tema | Archivo principal |
|---|---|---|---|
| 1 | Integrante 1 | Presentación del proyecto, organización del JS y consola | `main.js` |
| 2 | Integrante 2 | Menú responsivo y buscador del encabezado | `menu.js`, parte de `productos.js` |
| 3 | Integrante 3 | Arreglo de productos, tarjetas dinámicas, filtros y orden | `productos.js` |
| 4 | Integrante 4 | Ventana flotante de detalle y agregar al carrito | `productos.js`, `carrito.js` |
| 5 | Integrante 5 | Panel del carrito: cantidades, eliminar, cupón y pedido | `carrito.js` |
| 6 | Integrante 6 | Validación de registro y reservas | `formularios.js` |

La exposición sigue el recorrido de la página: primero el encabezado, luego los productos, después el carrito y al final los formularios.

---

## Integrante 1 — Presentación del proyecto y organización del JavaScript

### Tema
Presentación general, problemas del avance anterior, cómo se incluye JavaScript en el HTML, variables y constantes, consola del navegador y las funciones comunes de `main.js`.

### Objetivo de su participación
Dar el contexto: qué es el proyecto, qué le faltaba y cómo se organizó el código nuevo. Así el público entiende de dónde sale cada función que mostrarán los demás.

### Funcionalidades que debe demostrar
1. Recorrer la página rápidamente: encabezado, banner, *Mejores productos*, *Nuestra carta*, tablas, opiniones y pie de página.
2. Contar los problemas del avance anterior: carrito que solo sumaba un número, tarjetas repetidas a mano, buscador sin función y formularios sin validación.
3. Mostrar la carpeta `Scripts/` con los 5 archivos.
4. Abrir la **consola** y mostrar el mensaje `Carta de Aroma & Grano cargada con 12 productos.`
5. Escribir en la consola `productos` (aparece el arreglo), luego `productos.length` y luego `agregarAlCarrito(5, 'Grande', 2)`. El contador del carrito cambia sin tocar la página.

### Conceptos de JavaScript que debe explicar
- Qué es JavaScript y por qué se usa: le da comportamiento a la página, mientras HTML da la estructura y CSS el diseño.
- Cómo se conecta con el HTML: `<script src="...">` al final del `<body>`.
- Diferencia entre `var`, `let` y `const`.
- La consola como herramienta de diagnóstico: `console.log`, `console.warn` y `console.error`.
- Eventos HTML en general. Los demás integrantes mostrarán `onclick`, `onchange`, etc. En este archivo se usa `onkeydown`.

### Fragmento 1: carga de los scripts (`index.html`)

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<!-- Cambio 5: el JavaScript se separó por funcionalidad (el orden importa) -->
<script src="Scripts/main.js"></script>
<script src="Scripts/menu.js"></script>
<script src="Scripts/productos.js"></script>
<script src="Scripts/carrito.js"></script>
<script src="Scripts/formularios.js"></script>
```

**Explicación:**
- Los scripts van **al final del `<body>`** para que, cuando se ejecuten, todos los elementos HTML ya existan. Si fueran en el `<head>`, `document.getElementById('carta')` devolvería `null`.
- **El orden importa.** `main.js` va primero porque define `avisar()` y `abrirVentana()`, que usan los demás. `productos.js` va antes de `carrito.js` porque el carrito usa `buscarProductoPorId()` y `formatearPrecio()`.
- Cada archivo tiene una sola responsabilidad. Eso facilita encontrar errores y repartir el trabajo.

### Fragmento 2: variables, constantes y función de aviso (`main.js`)

```js
var hayBootstrap = typeof bootstrap !== 'undefined';

function avisar(mensaje) {
    const toastEl = document.getElementById('toastAviso');
    if (!hayBootstrap || toastEl === null) {
        console.log('Aviso:', mensaje);
        return;
    }
    document.getElementById('toastAvisoMsg').textContent = mensaje;
    bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 }).show();
}
```

**Explicación línea por línea:**
- `var hayBootstrap = ...`: se declara con `var` (así estaba en el avance anterior). `typeof bootstrap !== 'undefined'` vale `true` si la librería cargó. Diferencias para explicar: `var` es la forma antigua y no respeta los bloques `{ }`; `let` sí los respeta y se puede reasignar; `const` no se puede reasignar.
- `const toastEl = ...`: busca el aviso por su `id`. Es `const` porque la referencia no cambia.
- `if (!hayBootstrap || toastEl === null)`: el `!` niega y el `||` significa "o". Si falta Bootstrap **o** no existe el elemento, el mensaje se escribe en la consola y la función termina con `return`.
- `.textContent = mensaje`: cambia el texto del aviso.
- La última línea muestra el aviso usando Bootstrap.

### Fragmento 3: la tecla Escape (`main.js`)

```js
document.onkeydown = function (evento) {
    if (evento.key === 'Escape') {
        const ventanasAbiertas = document.querySelectorAll('.ventana-flotante.abierta');
        for (let i = 0; i < ventanasAbiertas.length; i++) {
            cerrarVentana(ventanasAbiertas[i].id);
        }
    }
};
```

**Explicación:**
- `document.onkeydown` se ejecuta cada vez que se presiona una tecla en la página.
- `evento.key` indica qué tecla fue. Solo se actúa si es `'Escape'`.
- `querySelectorAll` devuelve **todas** las ventanas que tienen la clase `abierta`.
- El `for` las recorre y cierra cada una.

### Ejemplo práctico
"Si escribo en la consola `productos[0].nombre` aparece `'Café Irish'`. Si escribo `agregarAlCarrito(5, 'Grande', 2)`, el contador del encabezado pasa a (2) y sale el aviso abajo a la derecha. Es el mismo código que se ejecuta cuando el cliente hace clic."

---

## Integrante 2 — Menú responsivo y buscador del encabezado

### Tema
Menú de navegación responsivo hecho con JavaScript y buscador de productos del encabezado.

### Objetivo de su participación
Explicar cómo JavaScript modifica clases, atributos y contenido de elementos que ya existen (introducción al DOM) y cómo se responde a eventos del usuario.

### Funcionalidades que debe demostrar
1. En modo celular, presionar el botón ☰: el menú se despliega y el icono cambia a **X**.
2. Tocar "menú": la página baja a la carta y el menú se cierra solo.
3. Abrir el menú y agrandar la ventana a escritorio: el menú vuelve a su estado normal.
4. Buscar "moka": la carta muestra solo el Frappuccino de moka.
5. Buscar "cafe" sin tilde: encuentra los productos con "Café".
6. Buscar con el campo vacío: aparece un `alert`.
7. En `contacto.html`, hacer clic en el carrito: aparece un `confirm` que ofrece ir a la carta.

### Conceptos de JavaScript que debe explicar
- **DOM:** el navegador convierte el HTML en objetos que JavaScript puede leer y cambiar mediante `document`.
- Selección de elementos: `getElementById` y `querySelectorAll`.
- Modificación: `classList.add` / `remove`, `setAttribute` e `innerHTML`.
- Eventos `onclick`, `onsubmit` y `onresize`.
- `if / else`, operadores lógicos (`&&`) y relacionales (`>=`).
- Bucle `for` para recorrer una lista de elementos.
- `alert()` y `confirm()`.

### Fragmento 1: abrir y cerrar el menú (`menu.js`)

```js
const ANCHO_ESCRITORIO = 992;

const botonMenu = document.getElementById('botonMenu');
const menuPrincipal = document.getElementById('menuPrincipal');
let menuAbierto = false;

function alternarMenu() {
    if (menuAbierto) {
        cerrarMenu();
    } else {
        abrirMenu();
    }
}

function abrirMenu() {
    menuAbierto = true;
    menuPrincipal.classList.add('show');
    botonMenu.setAttribute('aria-expanded', 'true');
    botonMenu.innerHTML = '<i class="fa-solid fa-xmark"></i>';
}
```

Y en el HTML:

```html
<button class="menu-toggle d-lg-none" type="button" id="botonMenu" onclick="alternarMenu()" ...>
```

**Explicación línea por línea:**
- `const ANCHO_ESCRITORIO = 992`: es una constante porque ese valor nunca cambia. Coincide con el punto de quiebre `lg` de Bootstrap.
- `botonMenu` y `menuPrincipal` guardan los elementos para no buscarlos cada vez.
- `let menuAbierto = false`: es una variable de estado. Se usa `let` porque cambia entre `true` y `false`.
- `onclick="alternarMenu()"`: al hacer clic en el botón se ejecuta la función.
- `alternarMenu()`: si el menú está abierto lo cierra; si no, lo abre.
- `classList.add('show')`: agrega la clase `show`, que en CSS hace visible el menú.
- `setAttribute('aria-expanded', 'true')`: actualiza un atributo de accesibilidad para lectores de pantalla.
- `innerHTML = '<i class="fa-solid fa-xmark"></i>'`: reemplaza el icono ☰ por una X.

### Fragmento 2: cerrar al tocar un enlace y al cambiar de tamaño (`menu.js`)

```js
const enlacesMenu = document.querySelectorAll('.menu a');
for (let i = 0; i < enlacesMenu.length; i++) {
    enlacesMenu[i].onclick = function () {
        if (menuAbierto) {
            cerrarMenu();
        }
    };
}

window.onresize = function () {
    if (window.innerWidth >= ANCHO_ESCRITORIO && menuAbierto) {
        cerrarMenu();
    }
};
```

**Explicación:**
- `querySelectorAll('.menu a')` devuelve los 5 enlaces del menú.
- El `for` empieza en `i = 0` y avanza mientras `i < enlacesMenu.length`. A cada enlace le asigna un `onclick` desde JavaScript, en lugar de escribirlo en el HTML.
- `window.onresize` se ejecuta al cambiar el tamaño de la ventana. Si el ancho es **mayor o igual** a 992 **y** el menú estaba abierto, se cierra.

### Fragmento 3: buscador y quitar tildes (`productos.js`)

```js
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

function buscarProducto(evento) {
    evento.preventDefault();
    const campoBuscar = document.getElementById('buscar');
    const texto = normalizarTexto(campoBuscar.value.trim());

    if (texto === '') {
        alert('Escribe el nombre de un café para buscarlo en la carta.');
        campoBuscar.focus();
        return;
    }

    textoBuscado = texto;
    mostrarCarta();
    cerrarMenu();
    document.getElementById('carta').scrollIntoView({ behavior: 'smooth' });
}
```

**Explicación:**
- `normalizarTexto` pasa el texto a minúsculas y luego lo recorre **letra por letra**. El `switch` cambia cada vocal con tilde por la misma vocal sin tilde. `resultado += letra` va armando el texto nuevo.
- En el HTML el formulario tiene `onsubmit="buscarProducto(event)"`. `event` trae la información del envío.
- `evento.preventDefault()` evita que la página se recargue, que es lo que hace un formulario por defecto.
- `.value` lee lo que escribió el usuario y `.trim()` quita los espacios de los extremos.
- Si el texto está vacío se avisa con `alert()` y `return` termina la función.
- Si no, se guarda el texto buscado, se redibuja la carta (lo explica el integrante 3), se cierra el menú y la página baja suavemente hasta la carta.

### Ejemplo práctico
"Estoy en el celular y quiero un moka. Abro el menú, escribo 'moka' y presiono la lupa. El menú se cierra, la página baja a la carta y aparece '1 producto(s) en Todos los productos para "moka"' con un botón para quitar la búsqueda."

---

## Integrante 3 — Arreglo de productos, tarjetas dinámicas, filtros y orden

### Tema
Cómo la carta se genera desde un arreglo y cómo se filtra y ordena.

### Objetivo de su participación
Mostrar el uso de arreglos, bucles y la **creación de elementos del DOM**, y explicar por qué esto reemplazó a cientos de líneas repetidas en el HTML.

### Funcionalidades que debe demostrar
1. Abrir `index.html` en el editor y mostrar que `<div id="contenedorCarta"></div>` está **vacío**.
2. En el navegador, mostrar que ese contenedor tiene 12 tarjetas. Con F12 → *Elements* se ven las tarjetas creadas.
3. Usar los botones *Café caliente*, *Café frío* y *Frappuccinos*: cambia el botón activo y el contador.
4. Usar el `<select>` "Ordenar por: Precio de menor a mayor".
5. Explicar que *Mejores productos* muestra solo los productos con `destacado: true`.

### Conceptos de JavaScript que debe explicar
- Arreglos: qué son, sus índices, `length`, `push` y `sort`.
- Arreglo de objetos literales: cada producto agrupa sus datos (no son clases).
- Bucle `for`.
- `if / else` y operadores lógicos `||` y `&&`.
- `switch`.
- DOM: `createElement`, `innerHTML`, `appendChild`, `className` y `setAttribute`.
- Eventos `onclick` y `onchange` en el HTML.

### Fragmento 1: el arreglo (`productos.js`)

```js
const productos = [
    {
        id: 1, nombre: 'Café Irish', categoria: 'caliente', precio: 4.60, estrellas: 4,
        imagen: 'cafe-irish.jpg', destacado: true, etiqueta: 'Más vendido', contieneAlcohol: true,
        descripcion: 'Café caliente con un toque de whisky irlandés, azúcar morena y una capa de crema batida.',
        ingredientes: ['Espresso doble', 'Whisky irlandés', 'Azúcar morena', 'Crema batida']
    },
    // ... 11 productos más
];
```

**Explicación:**
- `const productos = [ ... ]` es un arreglo: una lista ordenada. Se declara con `const` porque la lista siempre es la misma.
- Cada elemento entre `{ }` es un objeto con propiedades. `productos[0].nombre` es `'Café Irish'`.
- `ingredientes` es un arreglo dentro de otro arreglo.
- Para agregar un producto nuevo a la página basta con añadir un objeto aquí.

### Fragmento 2: crear una tarjeta (`productos.js`)

```js
function crearTarjetaProducto(producto) {
    const tarjeta = document.createElement('div');
    tarjeta.className = 'card-product';
    tarjeta.setAttribute('tabindex', '0');

    let html = '<div class="container-img">';
    if (producto.etiqueta !== '') {
        html += '<span class="badge badge-top">' + producto.etiqueta + '</span>';
    }
    html += '<img src="' + producto.imagen + '" alt="' + producto.nombre + '">';
    html += '</div>';
    // ... estrellas, nombre, botón y precio
    tarjeta.innerHTML = html;

    tarjeta.onclick = function () {
        abrirDetalleProducto(producto.id);
    };
    // ...
    return tarjeta;
}
```

**Explicación línea por línea:**
- `document.createElement('div')` crea un `<div>` nuevo en memoria. Todavía no se ve en la página.
- `className = 'card-product'` le pone la **misma clase** que tenían las tarjetas originales, así se conservan el diseño y las animaciones de los avances anteriores.
- `setAttribute('tabindex', '0')` permite llegar a la tarjeta con la tecla Tab.
- `let html = ...` y `html += ...` arman el contenido concatenando textos con `+`.
- El `if` agrega la etiqueta ("Más vendido", "Nuevo") solo si el producto tiene una.
- `tarjeta.innerHTML = html` inserta ese HTML dentro de la tarjeta.
- `tarjeta.onclick = function () { ... }` asigna el evento de clic, que abre la ventana de detalle (lo explica el integrante 4).
- `return tarjeta` devuelve la tarjeta lista para ponerla en la página.

### Fragmento 3: estrellas con un `for`

```js
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
```

**Explicación:** el `for` da 5 vueltas (de `i = 1` a `i = 5`). Si la vuelta es menor o igual a la valoración, agrega una estrella llena; si no, una vacía. Con `cantidad = 4` se obtienen ★★★★☆.

### Fragmento 4: filtrar, ordenar y dibujar (`productos.js`)

```js
function mostrarCarta() {
    const resultado = [];
    for (let i = 0; i < productos.length; i++) {
        const producto = productos[i];
        const coincideCategoria = categoriaActual === 'todos' || producto.categoria === categoriaActual;
        const coincideTexto = normalizarTexto(producto.nombre).indexOf(textoBuscado) !== -1;

        if (coincideCategoria && coincideTexto) {
            resultado.push(producto);
        }
    }

    ordenarProductos(resultado, ordenActual);

    contenedorCarta.innerHTML = '';
    for (let i = 0; i < resultado.length; i++) {
        contenedorCarta.appendChild(crearTarjetaProducto(resultado[i]));
    }
    // ... contador y mensaje "sin resultados"
}
```

**Explicación:**
- `const resultado = []` crea un arreglo vacío donde se guardarán los productos que cumplan el filtro.
- `coincideCategoria` es verdadero si se eligió "todos" **o** (`||`) si la categoría del producto es la elegida.
- `coincideTexto` es verdadero si el nombre contiene el texto buscado. `indexOf` devuelve `-1` cuando no lo encuentra.
- Si se cumplen **las dos** condiciones (`&&`), el producto se agrega con `push`.
- `innerHTML = ''` borra las tarjetas anteriores.
- `appendChild` coloca cada tarjeta nueva dentro del contenedor. En ese momento aparece en la página.

### Fragmento 5: botones de categoría y orden

```html
<button type="button" class="btn-filtro" onclick="filtrarPorCategoria('frio', this)">Café frío</button>
<select id="ordenCarta" onchange="cambiarOrden(this.value)"> ... </select>
```

```js
function filtrarPorCategoria(categoria, botonPresionado) {
    categoriaActual = categoria;
    const botones = document.querySelectorAll('.btn-filtro');
    for (let i = 0; i < botones.length; i++) {
        botones[i].classList.remove('activo');
    }
    botonPresionado.classList.add('activo');
    mostrarCarta();
}

function ordenarProductos(lista, criterio) {
    switch (criterio) {
        case 'precio-menor':
            lista.sort(function (a, b) { return a.precio - b.precio; });
            break;
        case 'precio-mayor':
            lista.sort(function (a, b) { return b.precio - a.precio; });
            break;
        // ...
        default:
            lista.sort(function (a, b) { return a.id - b.id; });
    }
}
```

**Explicación:**
- `this` en el `onclick` es el propio botón presionado. Se envía a la función para marcarlo como activo.
- El `for` quita la clase `activo` de todos los botones y luego se agrega solo al presionado.
- `onchange` se dispara cuando cambia la opción del `<select>`, y `this.value` es el valor elegido.
- El `switch` compara el criterio con cada `case`. `break` evita que se ejecute el siguiente caso y `default` se usa cuando ninguno coincide.
- `sort` ordena el arreglo con una función que compara dos productos. Si `a.precio - b.precio` es negativo, `a` va primero.

### Ejemplo práctico
"Presiono *Café frío*: el botón se pinta de morado y aparecen 4 productos. Elijo 'Precio: mayor a menor' y el Cold Brew (S/5.50) pasa al primer lugar. Todo eso sale del mismo arreglo de 12 productos."

---

## Integrante 4 — Ventana flotante de detalle y agregar al carrito

### Tema
La ventana flotante (modal propio) con el detalle del producto y la función que agrega productos al carrito.

### Objetivo de su participación
Explicar cómo se construye una ventana flotante con HTML, CSS y JavaScript, cómo se modifican contenido y atributos según el producto elegido, y cómo se guarda un producto en el arreglo del carrito.

### Funcionalidades que debe demostrar
1. Hacer clic en *Cold Brew*: se abre la ventana con imagen, categoría, ingredientes y precio.
2. Cambiar el tamaño a *Grande* y la cantidad a 3: el total pasa a S/19.50.
3. Intentar pasar de 10 unidades: aparece un `alert`.
4. Cerrar la ventana de tres formas: la X, un clic en el fondo oscuro y la tecla Escape.
5. Abrir el *Café Irish*: aparece el aviso de alcohol. Al añadirlo, un `confirm` pregunta la mayoría de edad. Si se cancela, no se agrega.
6. Presionar el icono del carrito de una tarjeta: se agrega directamente, **sin** abrir la ventana.

### Conceptos de JavaScript que debe explicar
- Ventanas flotantes: estructura HTML, clase CSS `abierta` y funciones para abrir y cerrar.
- Modificación de contenido (`textContent`), atributos (`setAttribute`) y estilos (`style.display`).
- Creación de elementos (`<li>` de ingredientes).
- `switch` para el tamaño e `if / else if` para la cantidad.
- Operadores aritméticos.
- `confirm()` y `alert()`.
- `stopPropagation()` para que un clic no llegue a la tarjeta.

### Fragmento 1: la ventana en HTML y CSS

```html
<div class="ventana-flotante" id="ventanaProducto" aria-hidden="true"
     onclick="cerrarSiEsFondo(event, 'ventanaProducto')">
    <div class="ventana-contenido detalle-producto" role="dialog" aria-modal="true">
        <button type="button" class="ventana-cerrar" onclick="cerrarDetalleProducto()">...</button>
        ...
        <select id="detalleTamano" onchange="actualizarPrecioDetalle()"> ... </select>
        <button type="button" onclick="cambiarCantidadDetalle(-1)">−</button>
        <span id="detalleCantidad">1</span>
        <button type="button" onclick="cambiarCantidadDetalle(1)">+</button>
        ...
    </div>
</div>
```

```css
.ventana-flotante { position: fixed; inset: 0; opacity: 0; visibility: hidden; ... }
.ventana-flotante.abierta { opacity: 1; visibility: visible; }
```

**Explicación:** la ventana siempre existe en el HTML, pero está oculta. JavaScript solo le agrega o le quita la clase `abierta`, y el CSS hace el resto, incluida la animación. `cerrarSiEsFondo` (en `main.js`) solo cierra si el clic fue en el fondo oscuro y no dentro del contenido: `evento.target === evento.currentTarget`.

### Fragmento 2: llenar la ventana (`productos.js`)

```js
function abrirDetalleProducto(id) {
    const producto = buscarProductoPorId(id);
    if (producto === null) {
        console.error('No existe un producto con id', id);
        return;
    }

    productoSeleccionado = producto;
    cantidadDetalle = 1;

    const imagen = document.getElementById('detalleImagen');
    imagen.setAttribute('src', producto.imagen);
    imagen.setAttribute('alt', producto.nombre);
    document.getElementById('detalleNombre').textContent = producto.nombre;
    // ...

    const listaIngredientes = document.getElementById('detalleIngredientes');
    listaIngredientes.innerHTML = '';
    for (let i = 0; i < producto.ingredientes.length; i++) {
        const item = document.createElement('li');
        item.textContent = producto.ingredientes[i];
        listaIngredientes.appendChild(item);
    }

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
```

**Explicación línea por línea:**
- `buscarProductoPorId(id)` recorre el arreglo con un `for` y devuelve el producto con ese `id`, o `null` si no existe. En ese caso se informa en la consola con `console.error`.
- Se guarda el producto en `productoSeleccionado` y la cantidad vuelve a 1.
- `setAttribute('src', ...)` cambia la imagen que se muestra y `setAttribute('alt', ...)` su texto alternativo.
- `textContent` cambia el texto del título.
- Ingredientes: primero se vacía la lista; luego el `for` crea un `<li>` por cada ingrediente y lo agrega con `appendChild`.
- Aviso de alcohol: `style.display` cambia el estilo directamente. Se muestra solo si el producto tiene alcohol.
- Al final se calcula el precio y se abre la ventana.

### Fragmento 3: precio según tamaño y cantidad (`productos.js`)

```js
function calcularPrecioSegunTamano(precioBase, tamano) {
    let precioFinal = precioBase;
    switch (tamano) {
        case 'Pequeño':
            precioFinal = precioBase - 0.50;
            break;
        case 'Grande':
            precioFinal = precioBase + 1.00;
            break;
        default:
            precioFinal = precioBase;
    }
    return precioFinal;
}

function actualizarPrecioDetalle() {
    const tamano = document.getElementById('detalleTamano').value;
    const precioUnitario = calcularPrecioSegunTamano(productoSeleccionado.precio, tamano);
    const total = precioUnitario * cantidadDetalle;
    document.getElementById('detalleCantidad').textContent = cantidadDetalle;
    document.getElementById('detallePrecio').textContent = formatearPrecio(total);
    // ...
}
```

**Explicación:** el `switch` resta S/0.50 para el tamaño pequeño, suma S/1.00 para el grande y deja el precio base para el mediano. Luego el total es precio unitario × cantidad. `formatearPrecio` usa `toFixed(2)` para mostrar siempre dos decimales (`S/19.50`).

### Fragmento 4: agregar al carrito (`carrito.js`)

```js
function agregarAlCarrito(idProducto, tamano, cantidad) {
    const producto = buscarProductoPorId(idProducto);
    if (producto === null) {
        return false;
    }

    if (producto.contieneAlcohol && !edadConfirmada) {
        const esMayorDeEdad = confirm('El ' + producto.nombre + ' contiene alcohol.\n¿Confirmas que eres mayor de 18 años?');
        if (!esMayorDeEdad) {
            alert('Lo sentimos, este producto solo está disponible para mayores de edad.');
            return false;
        }
        edadConfirmada = true;
    }

    let posicion = -1;
    for (let i = 0; i < carrito.length; i++) {
        if (carrito[i].id === idProducto && carrito[i].tamano === tamano) {
            posicion = i;
            break;
        }
    }

    if (posicion !== -1) {
        // ya existe: se suma la cantidad (con control del máximo)
        carrito[posicion].cantidad += cantidad;
    } else {
        carrito.push({ id: producto.id, nombre: producto.nombre, imagen: producto.imagen,
                       tamano: tamano, precio: calcularPrecioSegunTamano(producto.precio, tamano),
                       cantidad: cantidad });
    }

    actualizarCarrito();
    animarIconoCarrito();
    avisar(cantidad + ' × ' + producto.nombre + ' (' + tamano + ') se añadió al carrito');
    return true;
}
```

**Explicación:**
- `confirm()` muestra una ventana con *Aceptar* y *Cancelar* y devuelve `true` o `false`. Si el usuario cancela, se muestra un `alert` y no se agrega nada. `edadConfirmada` evita preguntar de nuevo.
- `posicion = -1` significa "todavía no lo encontré". El `for` busca el mismo producto **con el mismo tamaño**. `break` detiene el bucle apenas lo encuentra.
- Si ya estaba, solo se suma la cantidad con `+=`. Si no, se agrega un objeto nuevo con `push`.
- La función devuelve `true` o `false` para que la ventana de detalle sepa si debe cerrarse.

Y en la tarjeta (`productos.js`):

```js
botonAgregar.onclick = function (evento) {
    evento.stopPropagation();
    agregarAlCarrito(producto.id, 'Mediano', 1);
};
```

`stopPropagation()` evita que el clic en el botón "suba" a la tarjeta y abra también la ventana de detalle.

### Ejemplo práctico
"Abro el Café Irish, elijo Grande y 2 unidades: el total es S/11.20 (5.60 × 2). Presiono *Añadir*, me pregunta si soy mayor de edad, acepto, la ventana se cierra, el carrito rebota y dice (2)."

---

## Integrante 5 — Panel del carrito: cantidades, eliminar, cupón y pedido

### Tema
El panel lateral del carrito y el uso de `prompt()`, `confirm()` y `alert()` para completar la compra.

### Objetivo de su participación
Mostrar cómo la interfaz se redibuja desde un arreglo, cómo se **eliminan** elementos del arreglo y del DOM, y cómo se usan los tres métodos de entrada y salida con un propósito real.

### Funcionalidades que debe demostrar
1. Con productos agregados, hacer clic en el carrito del encabezado: se abre el panel lateral.
2. Usar + y −. Al llegar a 0, un `confirm` pregunta si se elimina el producto.
3. Eliminar un producto con el icono de la papelera.
4. *Cupón*: escribir `aroma10` (en minúsculas también funciona) y ver la fila de descuento. Probar `GRANO15` con menos de S/30 (lo rechaza) y un código inválido.
5. *Vaciar*: cancelar el `confirm` (no pasa nada) y luego aceptar.
6. *Hacer pedido*: escribir un nombre en el `prompt`, revisar el resumen en el `confirm` y ver el `alert` final con el número de pedido y el tiempo estimado.

### Conceptos de JavaScript que debe explicar
- Constantes de configuración (`CANTIDAD_MAXIMA`, `MINUTOS_BASE`).
- Recorrer un arreglo para sumar: acumuladores con `+=`.
- `splice` para eliminar elementos.
- Crear elementos con `createElement` y asignar eventos a botones creados dinámicamente.
- `prompt()`: devuelve el texto o `null` si se cancela.
- `switch` para validar códigos.
- Operadores aritméticos para porcentajes y tiempos.
- Propiedad `disabled` y `style.display`.

### Fragmento 1: constantes y acumuladores (`carrito.js`)

```js
const CANTIDAD_MAXIMA = 10;
const MINUTOS_BASE = 5;
const MINUTOS_POR_UNIDAD = 2;
const carrito = [];
let porcentajeDescuento = 0;

function calcularSubtotal() {
    let subtotal = 0;
    for (let i = 0; i < carrito.length; i++) {
        subtotal += carrito[i].precio * carrito[i].cantidad;
    }
    return subtotal;
}
```

**Explicación:**
- Las constantes en MAYÚSCULAS son valores fijos del negocio. Si la cafetería cambia el máximo, se modifica una sola línea.
- `const carrito = []`: el arreglo es constante (siempre es el mismo arreglo), pero su **contenido** sí puede cambiar con `push` y `splice`.
- `subtotal` empieza en 0 y en cada vuelta suma precio × cantidad. A eso se le llama acumulador.

### Fragmento 2: dibujar el panel (`carrito.js`)

```js
function actualizarCarrito() {
    contadorCarrito.textContent = '(' + contarUnidades() + ')';

    listaCarrito.innerHTML = '';
    for (let i = 0; i < carrito.length; i++) {
        listaCarrito.appendChild(crearFilaCarrito(carrito[i], i));
    }

    const estaVacio = carrito.length === 0;
    if (estaVacio) {
        mensajeCarritoVacio.style.display = 'block';
    } else {
        mensajeCarritoVacio.style.display = 'none';
    }

    const botonesAccion = document.querySelectorAll('.carrito-acciones button');
    for (let i = 0; i < botonesAccion.length; i++) {
        botonesAccion[i].disabled = estaVacio;
    }

    const subtotal = calcularSubtotal();
    const montoDescuento = subtotal * porcentajeDescuento / 100;
    const total = subtotal - montoDescuento;
    textoSubtotal.textContent = formatearPrecio(subtotal);
    textoTotal.textContent = formatearPrecio(total);
    // ...
}
```

**Explicación:**
- Cada vez que cambia el arreglo se llama a esta función, que actualiza **todo**: el contador, la lista, los botones y los totales. Así lo que se ve siempre coincide con los datos.
- `estaVacio` guarda el resultado de una comparación (`true` o `false`).
- `disabled = estaVacio` desactiva los botones cuando no hay productos.
- Descuento: por ejemplo, 10 % de S/20 es 20 × 10 / 100 = S/2.

### Fragmento 3: botones creados con JavaScript y eliminar (`carrito.js`)

```js
const botonEliminar = document.createElement('button');
botonEliminar.type = 'button';
botonEliminar.className = 'item-eliminar';
botonEliminar.innerHTML = '<i class="bi bi-trash3"></i>';
botonEliminar.onclick = function () {
    eliminarDelCarrito(posicion);
};

function eliminarDelCarrito(posicion) {
    const item = carrito[posicion];
    const confirmado = confirm('¿Quieres quitar ' + item.nombre + ' (' + item.tamano + ') del carrito?');
    if (confirmado) {
        carrito.splice(posicion, 1);
        actualizarCarrito();
        avisar(item.nombre + ' se quitó del carrito');
    }
}
```

**Explicación:**
- El botón no existe en el HTML: se crea con `createElement` y su evento se asigna con `.onclick`. Cada botón recuerda la `posicion` de su producto.
- `confirm()` evita borrar por accidente.
- `splice(posicion, 1)` elimina **1** elemento desde esa posición del arreglo. Luego, al redibujar, la fila desaparece de la pantalla.

### Fragmento 4: cupón con `prompt()` y `switch` (`carrito.js`)

```js
function aplicarCupon() {
    const codigoIngresado = prompt('Ingresa tu código de descuento:');

    if (codigoIngresado === null) {
        return;
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
                alert('El cupón GRANO15 es válido para compras desde S/30.00. ...');
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
```

**Explicación:**
- `prompt()` muestra una caja de texto. Si el usuario presiona *Cancelar*, devuelve `null` y la función termina.
- `trim()` quita espacios y `toUpperCase()` pasa a mayúsculas, así "aroma10" también es válido.
- El `switch` revisa el código. Dentro de `GRANO15` hay un `if` porque ese cupón tiene una condición extra.

### Fragmento 5: finalizar el pedido (`carrito.js`)

```js
let resumen = 'Resumen del pedido de ' + nombreCliente + ':\n\n';
for (let i = 0; i < carrito.length; i++) {
    resumen += '• ' + carrito[i].cantidad + ' × ' + carrito[i].nombre + ' (' + carrito[i].tamano + ')\n';
}
resumen += '\nTotal a pagar: ' + textoTotal.textContent + '\n\n¿Confirmas tu pedido?';

if (!confirm(resumen)) {
    return;
}

let minutos = MINUTOS_BASE + contarUnidades() * MINUTOS_POR_UNIDAD;
if (minutos > 30) {
    minutos = 30;
}

numeroPedido++;
alert('¡Gracias, ' + nombreCliente + '!\nTu pedido N.° ' + numeroPedido +
    ' estará listo en aproximadamente ' + minutos + ' minutos.');
```

**Explicación:**
- Antes de esto, `prompt()` pidió el nombre y se validó que tuviera al menos 2 letras.
- El `for` arma el resumen con una línea por producto. `\n` es un salto de línea.
- `!confirm(resumen)`: si el usuario **no** confirma, se sale.
- Tiempo estimado: 5 minutos más 2 por bebida. Por la precedencia de operadores, primero se multiplica y luego se suma. Si pasa de 30, se limita a 30.
- `numeroPedido++` suma 1 al número de pedido.

### Ejemplo práctico
"Tengo 3 Cold Brew grandes (S/19.50). Aplico AROMA10 y el total baja a S/17.55. Presiono *Hacer pedido*, escribo 'Ana', confirmo el resumen y sale: 'Tu pedido N.° 101 estará listo en aproximadamente 11 minutos' (5 + 3 × 2)."

---

## Integrante 6 — Validación de formularios: registro y reservas

### Tema
Validación del formulario de registro (modal del inicio) y del formulario de reservas (página de contacto).

### Objetivo de su participación
Mostrar cómo las estructuras condicionales y los bucles validan datos reales, cómo se muestran los errores en el DOM y cómo se crean y eliminan elementos (lista de reservas).

### Funcionalidades que debe demostrar
**Registro (inicio):**
1. Presionar *Registrarse* y enviar vacío: aparece un mensaje en rojo debajo de cada campo.
2. Escribir contraseñas distintas: "Las contraseñas no coinciden".
3. Completar bien: se cierra el modal, sale el aviso y el botón del banner cambia a "Hola, Ana". Al presionarlo ahora aparece un `alert` en lugar del formulario.

**Reservas (contacto):**
4. Enviar con un teléfono con letras, una fecha pasada y 30 personas: aparecen los errores.
5. Elegir un domingo: aparece la ayuda "El domingo recibimos reservas de 8:00 a 17:00". Poner 18:30: lo rechaza.
6. Escribir en el mensaje: el contador sube (`10 / 200`).
7. Reservar para 10 personas: primero aparece el `confirm` del salón principal y luego el `confirm` con el resumen.
8. La reserva aparece en "Tus reservas". Presionar *Cancelar* y confirmar: desaparece.

### Conceptos de JavaScript que debe explicar
- Evento `onsubmit` con `preventDefault()` y atributo `novalidate`.
- `if / else if` encadenados y variable bandera (`formularioValido`) o contador (`errores++`).
- Operadores lógicos y relacionales en validaciones.
- `for` con `continue` para revisar caracteres.
- `switch` que devuelve un arreglo `[apertura, cierre]`.
- Eventos `onchange` y `oninput`.
- DOM: `classList`, `textContent`, `setAttribute`, `removeAttribute`, `style.color`, `createElement`.
- `confirm()` y `alert()`.

### Fragmento 1: mostrar errores (`formularios.js`)

```js
function mostrarError(idCampo, mensaje) {
    const campo = document.getElementById(idCampo);
    const textoError = document.getElementById('error-' + idCampo);
    campo.classList.add('campo-invalido');
    campo.setAttribute('aria-invalid', 'true');
    textoError.textContent = mensaje;
}
```

**Explicación:** cada campo tiene debajo un `<small id="error-NOMBRE">`. La función forma ese id concatenando `'error-' + idCampo`, escribe el mensaje y agrega la clase `campo-invalido`, que en CSS pinta el borde de rojo. Hay otra función, `limpiarError`, que hace lo contrario.

### Fragmento 2: validar el registro (`formularios.js`)

```js
function validarRegistro(evento) {
    evento.preventDefault();
    limpiarErrores(['reg-nombre', 'reg-correo', 'reg-clave', 'reg-clave2']);

    const nombre = document.getElementById('reg-nombre').value.trim();
    const correo = document.getElementById('reg-correo').value.trim();
    const clave = document.getElementById('reg-clave').value;
    const confirmacion = document.getElementById('reg-clave2').value;
    let formularioValido = true;

    if (nombre.length < 3) {
        mostrarError('reg-nombre', 'Escribe tu nombre (mínimo 3 letras).');
        formularioValido = false;
    }

    if (correo === '') {
        mostrarError('reg-correo', 'El correo es obligatorio.');
        formularioValido = false;
    } else if (!esCorreoValido(correo)) {
        mostrarError('reg-correo', 'Escribe un correo válido, por ejemplo: ana@correo.com');
        formularioValido = false;
    }
    // ... contraseña y confirmación

    if (!formularioValido) {
        console.warn('Registro con errores: revisa los campos marcados.');
        return;
    }
    // ... cerrar modal y saludarUsuario(primerNombre)
}
```

**Explicación línea por línea:**
- `preventDefault()` evita que el formulario recargue la página.
- `limpiarErrores([...])` recibe un **arreglo** con los ids y los limpia con un `for`.
- `formularioValido` es una variable bandera: empieza en `true` y basta un error para que pase a `false`. Así se revisan **todos** los campos y se muestran todos los errores a la vez.
- `nombre.length < 3`: `length` es la cantidad de caracteres.
- `if / else if`: primero se revisa si el correo está vacío y, **solo si no lo está**, si tiene formato válido.
- Al final, si hubo algún error se escribe una advertencia en la consola y la función termina.

### Fragmento 3: validar el teléfono carácter por carácter

```js
function esTelefonoValido(telefono) {
    let soloDigitos = '';
    for (let i = 0; i < telefono.length; i++) {
        const caracter = telefono[i];
        if (caracter === ' ') {
            continue;
        }
        if (caracter < '0' || caracter > '9') {
            return false;
        }
        soloDigitos += caracter;
    }
    return soloDigitos.length === 9 && soloDigitos[0] === '9';
}
```

**Explicación:** el `for` revisa cada carácter. `continue` salta a la siguiente vuelta si es un espacio. Si el carácter es menor que `'0'` o mayor que `'9'`, no es un dígito y se devuelve `false`. Al final se exige que haya exactamente 9 dígitos y que el primero sea 9, como en un celular peruano.

### Fragmento 4: horario por día (`formularios.js`)

```js
function obtenerHorario(diaSemana) {
    switch (diaSemana) {
        case 0: // domingo
            return [8, 18];
        case 6: // sábado
            return [8, 22];
        default: // lunes a viernes
            return [7, 21];
    }
}

function mostrarHorarioDelDia() {
    const valorFecha = document.getElementById('fecha').value;
    // ...
    const dia = convertirFecha(valorFecha).getDay();
    const horario = obtenerHorario(dia);
    ayuda.textContent = 'El ' + DIAS_SEMANA[dia] + ' recibimos reservas de ' + horario[0] + ':00 a ' +
        (horario[1] - 1) + ':00.';
}
```

**Explicación:**
- `getDay()` devuelve el día de la semana como número (0 = domingo ... 6 = sábado).
- El `switch` devuelve un arreglo de dos posiciones: `horario[0]` es la apertura y `horario[1]` el cierre. Coincide con el horario del pie de página.
- `DIAS_SEMANA[dia]` usa el número como índice para obtener el nombre del día.
- `horario[1] - 1`: la última reserva se acepta una hora antes del cierre.
- En el HTML: `<input type="date" id="fecha" onchange="mostrarHorarioDelDia()">`.

### Fragmento 5: crear y cancelar reservas (`formularios.js`)

```js
for (let i = 0; i < reservas.length; i++) {
    const reserva = reservas[i];
    const item = document.createElement('li');
    item.className = 'reserva-item';
    item.innerHTML = '<div><strong>' + reserva.fecha + ' · ' + reserva.hora + '</strong>' +
        '<span>' + reserva.personas + ' persona(s) a nombre de ' + reserva.nombre + '</span></div>';

    const botonCancelar = document.createElement('button');
    botonCancelar.type = 'button';
    botonCancelar.textContent = 'Cancelar';
    botonCancelar.onclick = function () {
        cancelarReserva(i);
    };

    item.appendChild(botonCancelar);
    lista.appendChild(item);
}

function cancelarReserva(posicion) {
    const reserva = reservas[posicion];
    if (confirm('¿Deseas cancelar la reserva del ' + reserva.fecha + ' a las ' + reserva.hora + '?')) {
        reservas.splice(posicion, 1);
        mostrarReservas();
        avisar('La reserva fue cancelada.');
    }
}
```

**Explicación:** por cada reserva del arreglo se crea un `<li>` con sus datos y un botón *Cancelar* creado con JavaScript. Al cancelar, `confirm()` pide confirmación, `splice` quita la reserva del arreglo y la lista se vuelve a dibujar. Si ya no quedan reservas, la tarjeta se oculta con `style.display = 'none'`.

### Fragmento 6: contador de caracteres

```js
function contarCaracteres() {
    const mensaje = document.getElementById('mensaje');
    const contador = document.getElementById('contadorMensaje');
    const escritos = mensaje.value.length;
    contador.textContent = escritos + ' / ' + LIMITE_MENSAJE;

    if (escritos >= LIMITE_MENSAJE - 20) {
        contador.style.color = '#b3261e';
    } else {
        contador.style.color = '';
    }
}
```

**Explicación:** `oninput` se dispara con **cada tecla** que se escribe, a diferencia de `onchange`, que se dispara al terminar de editar. Cuando faltan 20 caracteres o menos para el límite, el contador se pinta de rojo modificando su estilo.

### Ejemplo práctico
"Quiero reservar este domingo a las 6:30 pm para 4 personas. Al elegir la fecha, la página me avisa que los domingos se reserva hasta las 5:00 pm, y al enviar me marca la hora en rojo. Cambio a las 4:00 pm, confirmo el resumen y la reserva aparece a la izquierda en 'Tus reservas'."

---

## Cierre (lo dice el integrante 6 al terminar)

- JavaScript convirtió una página que solo se veía bien en una página que **responde** al usuario, sin cambiar su diseño.
- Cada tema del curso tiene un uso concreto: arreglos para los productos, el carrito y las reservas; `switch` para el tamaño, el orden, los cupones y el horario; `for` para recorrer y dibujar; `alert`, `confirm` y `prompt` para comunicarse con el cliente; y el DOM para crear, modificar y eliminar elementos.
- **Limitación honesta:** como el curso aún no incluye almacenamiento, el carrito y las reservas se pierden al recargar la página. Ese sería el siguiente avance natural.

## Preguntas que podría hacer el docente (y quién responde)

| Pregunta | Responde |
|---|---|
| ¿Por qué los scripts van al final del `<body>`? | Integrante 1 |
| ¿Qué diferencia hay entre `var`, `let` y `const`? | Integrante 1 |
| ¿Por qué no usaron el menú de Bootstrap? | Integrante 2 |
| ¿Qué hace `preventDefault()`? | Integrantes 2 y 6 |
| ¿Qué ventaja tiene generar las tarjetas desde un arreglo? | Integrante 3 |
| ¿Para qué sirve `break` dentro de un `switch`? | Integrante 3 |
| ¿Por qué el clic en el botón del carrito no abre la ventana de detalle? | Integrante 4 |
| ¿Qué devuelve `prompt()` si el usuario cancela? | Integrante 5 |
| ¿Qué hace `splice(posicion, 1)`? | Integrantes 5 y 6 |
| ¿Cuál es la diferencia entre `onchange` y `oninput`? | Integrante 6 |

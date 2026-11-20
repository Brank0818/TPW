# Informe técnico — Avance 5: interactividad con JavaScript

**Proyecto:** Aroma & Grano — página web de cafetería
**Curso:** Taller de Programación Web
**Avance:** Cambio 5 — Incorporación de JavaScript nativo (Vanilla JS)

---

## 5.1. Descripción general

En los avances anteriores el sitio se construyó con HTML, CSS y Bootstrap (Cambios 1 a 4: tipografía, animaciones, componentes de Bootstrap, Flexbox y Grid). La página se veía bien, pero casi no respondía al usuario:

- El carrito solo sumaba un número. No guardaba qué productos se elegían ni cuánto costaban.
- Las secciones *Frappuccinos*, *Café caliente* y *Café frío* repetían a mano las mismas 4 tarjetas, con nombres repetidos ("Cafe Australiano" aparecía dos veces en cada sección) y todos los precios en S/4.60.
- El buscador del encabezado y el enlace "menú" no hacían nada.
- Los formularios de registro y de reserva no comprobaban los datos. Mostraban "enviado" aunque la fecha ya hubiera pasado o el teléfono estuviera mal escrito.

En este avance se agregó JavaScript para resolver esos problemas **sin cambiar la identidad visual**. Se mantienen los mismos colores (`--primary-color`, `--secondary-color`, `--background-color`), las mismas tipografías (Playfair Display y Nunito Sans), las mismas tarjetas y la misma distribución.

**Mejoras incorporadas:**

| N.° | Funcionalidad | Archivo JS principal |
|---|---|---|
| 1 | Organización del código y utilidades comunes (avisos, ventanas flotantes, tecla Escape) | `Scripts/main.js` |
| 2 | Menú de navegación responsivo propio | `Scripts/menu.js` |
| 3 | Carta generada desde un arreglo de productos | `Scripts/productos.js` |
| 4 | Filtros por categoría, ordenamiento y buscador | `Scripts/productos.js` |
| 5 | Ventana flotante con el detalle de cada producto (tamaño y cantidad) | `Scripts/productos.js` |
| 6 | Carrito de compras real (panel lateral, cantidades, eliminar, cupón y pedido) | `Scripts/carrito.js` |
| 7 | Validación del formulario de registro y saludo personalizado | `Scripts/formularios.js` |
| 8 | Validación del formulario de reservas, horario por día y lista de reservas | `Scripts/formularios.js` |

**Estructura de archivos después del avance:**

```
TPW/
├── index.html            (modificado)
├── Pages/contacto.html   (modificado)
├── Styles/style.css      (se agregó la sección "5 — Interactividad con JavaScript")
├── Scripts/
│   ├── main.js           (modificado: utilidades comunes)
│   ├── menu.js           (nuevo)
│   ├── productos.js      (nuevo)
│   ├── carrito.js        (nuevo)
│   └── formularios.js    (nuevo)
├── docs/
│   ├── informe-tecnico-avance-js.md
│   └── guia-exposicion.md
└── img/ y *.jpg          (sin cambios)
```

**Temas de JavaScript usados:** variables (`let`, `var`), constantes (`const`), eventos HTML (`onclick`, `onchange`, `oninput`, `onsubmit`, `onkeydown`, `onresize`), consola (`console.log`, `console.warn`, `console.error`), `if / else if / else`, `switch`, `for`, `break` y `continue`, arreglos (`push`, `splice`, `sort`, `length`, recorrido con índices), operadores aritméticos, lógicos, relacionales y de asignación, `alert()`, `confirm()`, `prompt()`, DOM (`getElementById`, `querySelector`, `querySelectorAll`, `createElement`, `appendChild`, `innerHTML`, `textContent`, `setAttribute`, `removeAttribute`, `classList`, `style`), menú responsivo y ventanas flotantes.

**Qué no se usó**, como pedía el curso: `fetch`, promesas, `async/await`, `localStorage`/`sessionStorage`, clases, módulos `import/export`, ni frameworks. Tampoco se usaron funciones flecha ni *template strings*: los textos se arman concatenando con `+`.

---

## 5.2. Detalle de las modificaciones

### Funcionalidad 1 — Organización del JavaScript y utilidades comunes

**Problema que resuelve.** Antes todo el código estaba en un solo `main.js`, dentro de `DOMContentLoaded`, mezclando carrito, modal y reservas. Al crecer el proyecto ese archivo sería difícil de leer y de exponer.

**Cómo funciona.**
- El JavaScript se separó **por funcionalidad** en cinco archivos que se cargan al final del `<body>`, en un orden fijo:

```html
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<!-- Cambio 5: el JavaScript se separó por funcionalidad (el orden importa) -->
<script src="Scripts/main.js"></script>
<script src="Scripts/menu.js"></script>
<script src="Scripts/productos.js"></script>
<script src="Scripts/carrito.js"></script>
<script src="Scripts/formularios.js"></script>
```

- `main.js` contiene las funciones que comparten todos los archivos: `avisar()`, que muestra el *toast* de Bootstrap del Cambio 3, y las funciones genéricas de las ventanas flotantes.

```js
// Abre una ventana flotante agregando la clase "abierta"
function abrirVentana(idVentana) {
    const ventana = document.getElementById(idVentana);
    ventana.classList.add('abierta');
    ventana.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // evita que la página se desplace detrás
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
```

- Se dejaron mensajes en la **consola del navegador** para diagnosticar (por ejemplo `Carta de Aroma & Grano cargada con 12 productos.` y `Carrito: [...]`). Como las variables son globales, en la consola (F12 → *Console*) se puede escribir `productos`, `carrito` o `agregarAlCarrito(5, 'Grande', 2)` y ver el resultado al instante.

**Archivos modificados:** `Scripts/main.js`, `index.html`, `Pages/contacto.html`.

**Temas aplicados:** implementación de JS en HTML (`<script src>`), `var` y `const`, eventos (`onkeydown`), DOM (`classList`, `setAttribute`, `style`), `for`, `if`, consola y herramientas del navegador.

**Justificación.** Separar por archivos permite que cada integrante explique una parte y que un error en un archivo no afecte la lectura de los otros. Las ventanas flotantes comparten tres funciones (abrir, cerrar y cerrar con clic en el fondo), así que no se repite código en el carrito ni en el detalle de producto. `hayBootstrap` se dejó con `var` porque así estaba en el avance anterior. Sirve para mostrar la diferencia con `let`/`const` en la exposición.

---

### Funcionalidad 2 — Menú de navegación responsivo propio

**Problema que resuelve.** En celulares el menú se abría con el `data-bs-toggle="collapse"` de Bootstrap, es decir, sin código propio. Además, al tocar un enlace el menú quedaba abierto tapando la página.

**Cómo funciona.**
1. El botón de las tres rayas tiene `onclick="alternarMenu()"`.
2. `alternarMenu()` revisa la variable `menuAbierto` y llama a `abrirMenu()` o a `cerrarMenu()`.
3. Abrir significa agregar la clase `show` (que la hoja de Bootstrap ya usa para mostrar el `.collapse`), cambiar `aria-expanded` y reemplazar el icono por una **X**.
4. Un `for` recorre todos los enlaces del menú y les asigna un `onclick` que cierra el menú.
5. `window.onresize` cierra el menú si la ventana vuelve a tamaño escritorio (≥ 992 px).
6. En `contacto.html`, el icono del carrito llama a `irALaCarta()`, que con `confirm()` ofrece ir a la carta de inicio.

```js
function abrirMenu() {
    menuAbierto = true;
    menuPrincipal.classList.add('show');                 // la clase "show" hace visible el menú
    botonMenu.setAttribute('aria-expanded', 'true');
    botonMenu.innerHTML = '<i class="fa-solid fa-xmark"></i>'; // cambia el icono a una X
}

const enlacesMenu = document.querySelectorAll('.menu a');
for (let i = 0; i < enlacesMenu.length; i++) {
    enlacesMenu[i].onclick = function () {
        if (menuAbierto) {
            cerrarMenu();
        }
    };
}
```

En el HTML se quitaron `data-bs-toggle` y `data-bs-target` del botón y se agregó `id="botonMenu"` y `onclick="alternarMenu()"`. El enlace "menú" ahora lleva a `#carta`. En CSS solo se añadió una animación de despliegue (`@keyframes desplegar`).

**Archivos modificados:** `Scripts/menu.js` (nuevo), `index.html`, `Pages/contacto.html`, `Styles/style.css`.

**Temas aplicados:** creación de un menú responsivo, `const` y `let`, `onclick`, `onresize`, `if / else`, `for`, operadores lógicos y relacionales (`>=`, `&&`), DOM (`classList`, `setAttribute`, `innerHTML`), `confirm()`.

**Justificación.** El curso pide construir el menú responsivo con JavaScript, así que se reemplazó el comportamiento automático de Bootstrap por código propio. Se reutilizó la clase `show` de Bootstrap para no tener que reescribir el CSS que ya funcionaba.

---

### Funcionalidad 3 — Carta generada desde un arreglo de productos

**Problema que resuelve.** El HTML repetía unas 600 líneas de tarjetas casi iguales, con nombres duplicados, `alt="café irish"` en todas las imágenes y el mismo precio en todos los productos. Agregar o corregir un producto obligaba a editar muchas partes.

**Cómo funciona.**
1. En `productos.js` hay un **arreglo** `productos` con 12 objetos. Cada uno tiene `id`, `nombre`, `categoria`, `precio`, `estrellas`, `imagen`, `destacado`, `etiqueta`, `contieneAlcohol`, `descripcion` e `ingredientes` (este último también es un arreglo).
2. `crearTarjetaProducto(producto)` crea un `<div class="card-product">` con `document.createElement`, arma su contenido con la **misma estructura y clases** que tenían las tarjetas originales y le asigna sus eventos.
3. `crearEstrellas(cantidad)` usa un `for` del 1 al 5 y un `if` para poner estrellas llenas o vacías.
4. `mostrarDestacados()` recorre el arreglo y solo agrega a *Mejores productos* los que tienen `destacado: true`.

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

function mostrarDestacados() {
    contenedorDestacados.innerHTML = '';
    for (let i = 0; i < productos.length; i++) {
        if (productos[i].destacado) {
            contenedorDestacados.appendChild(crearTarjetaProducto(productos[i]));
        }
    }
}
```

En `index.html` las tarjetas se reemplazaron por contenedores vacíos (`<div id="contenedorDestacados">` y `<div id="contenedorCarta">`) que JavaScript llena al cargar la página. Las tres secciones de productos se unieron en una sola sección, **"Nuestra carta"** (`id="carta"`), con filtros. Los precios del Espresso (S/3.50), el Cappuccino (S/4.20) y el Café Irish (S/4.60) coinciden con la tabla comparativa que ya existía.

**Archivos modificados:** `Scripts/productos.js` (nuevo), `index.html`.

**Temas aplicados:** arreglos, `const`, `let`, `for`, `if / else`, operadores de asignación (`+=`) y relacionales (`<=`), DOM (`createElement`, `innerHTML`, `appendChild`, `setAttribute`), creación de elementos.

**Justificación.** Con los datos en un arreglo, cada producto se escribe una sola vez y la misma función dibuja todas las tarjetas. Eso elimina la repetición, corrige los errores de nombres y precios, y es lo que permite filtrar, buscar, ordenar y abrir el detalle. Se conservaron las clases CSS originales (`card-product`, `container-img`, `stars`, `add-car`, `price`), así que las animaciones de los Cambios 2 y 4 siguen funcionando igual.

---

### Funcionalidad 4 — Filtros por categoría, ordenamiento y buscador

**Problema que resuelve.** El visitante no podía ver solo un tipo de bebida, comparar por precio ni buscar un producto. El buscador del encabezado recargaba la página sin hacer nada.

**Cómo funciona.**
- **Filtros:** cuatro botones con `onclick="filtrarPorCategoria('frio', this)"`. La función guarda la categoría elegida, quita la clase `activo` de todos los botones con un `for`, se la pone al botón presionado y vuelve a dibujar la carta.
- **Orden:** un `<select>` con `onchange="cambiarOrden(this.value)"`. `ordenarProductos()` usa un `switch` para ordenar por precio, valoración o nombre.
- **Buscador:** el formulario del encabezado tiene `onsubmit="buscarProducto(event)"`. Si el campo está vacío se muestra un `alert()`. Si no, se filtra la carta, se cierra el menú móvil y la página baja hasta la carta.
- **`normalizarTexto()`** recorre el texto letra por letra con un `for` y un `switch` para quitar las tildes. Así "cafe" encuentra "Café".
- `mostrarCarta()` junta todo: filtra con un `for` y operadores lógicos, ordena, borra las tarjetas anteriores, dibuja las nuevas y actualiza el contador. Si no hay resultados, muestra un mensaje.

```js
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
    // 4. Actualizar los mensajes (contador, botón "Quitar búsqueda", "sin resultados")
    ...
}

function ordenarProductos(lista, criterio) {
    switch (criterio) {
        case 'precio-menor':
            lista.sort(function (a, b) { return a.precio - b.precio; });
            break;
        case 'precio-mayor':
            lista.sort(function (a, b) { return b.precio - a.precio; });
            break;
        // ... valoracion, nombre
        default: // recomendado: el orden original del arreglo
            lista.sort(function (a, b) { return a.id - b.id; });
    }
}
```

**Archivos modificados:** `Scripts/productos.js`, `index.html` (botones, `<select>`, contador y mensaje), `Styles/style.css` (`.btn-filtro`, `.herramientas-carta`, `.sin-resultados`).

**Temas aplicados:** eventos `onclick`, `onchange` y `onsubmit`, `switch`, `for`, `if / else`, operadores lógicos (`||`, `&&`) y relacionales (`===`, `!==`), arreglos (`push`, `sort`, `length`), `alert()`, DOM (`classList`, `style.display`, `textContent`).

**Justificación.** Las tres secciones antiguas eran en la práctica un filtro hecho a mano. Unirlas en una carta con botones da el mismo resultado con menos HTML y agrega búsqueda y orden. Se usó `switch` porque el criterio de orden es un valor con varias opciones fijas, que es justo para lo que sirve. `sort` es un método de arreglos que recibe una función que compara dos elementos.

---

### Funcionalidad 5 — Ventana flotante con el detalle del producto

**Problema que resuelve.** Las tarjetas solo mostraban nombre y precio. No había forma de conocer los ingredientes, elegir el tamaño ni pedir varias unidades a la vez.

**Cómo funciona.**
1. Al hacer clic en una tarjeta (o pulsar Enter sobre ella) se ejecuta `abrirDetalleProducto(id)`.
2. La función busca el producto en el arreglo con `buscarProductoPorId()` y cambia el contenido y los atributos de la ventana (`src` y `alt` de la imagen, nombre, categoría, estrellas, descripción).
3. Crea un `<li>` por cada ingrediente.
4. Muestra un aviso de alcohol **solo si** `contieneAlcohol` es `true`.
5. El `<select>` de tamaño tiene `onchange="actualizarPrecioDetalle()"` y los botones − / + llaman a `cambiarCantidadDetalle()`. El precio se recalcula con `calcularPrecioSegunTamano()`, que usa un `switch` (Pequeño −S/0.50, Mediano precio base, Grande +S/1.00).
6. La ventana se cierra con la X, con un clic en el fondo oscuro o con la tecla Escape.

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
        default: // Mediano
            precioFinal = precioBase;
    }
    return precioFinal;
}

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
```

La ventana es **propia**, no de Bootstrap: un `<div class="ventana-flotante">` con un fondo semitransparente que se muestra al agregarle la clase `abierta`. En celulares la imagen pasa arriba del texto con una *media query*.

**Archivos modificados:** `Scripts/productos.js`, `Scripts/main.js` (abrir/cerrar), `index.html` (estructura `#ventanaProducto`), `Styles/style.css`.

**Temas aplicados:** ventanas flotantes, `onclick`, `onchange`, `onkeydown`, `switch`, `if / else if`, operadores aritméticos (`+`, `-`, `*`), arreglos (recorrer `ingredientes`), DOM (modificar contenido, atributos y estilos, crear elementos), `alert()`.

**Justificación.** El registro ya usaba el modal de Bootstrap. Construir esta ventana a mano permite demostrar cómo funciona por dentro: una clase CSS que JavaScript agrega o quita. Para no abrir la ventana al presionar el botón del carrito de la tarjeta se usa `evento.stopPropagation()`, que impide que ese clic llegue también a la tarjeta.

---

### Funcionalidad 6 — Carrito de compras real

**Problema que resuelve.** El carrito solo aumentaba un contador. No se podía ver lo elegido, cambiar cantidades, eliminar productos ni terminar la compra.

**Cómo funciona.**
- El carrito es un **arreglo** (`const carrito = []`). Cada elemento guarda `id`, `nombre`, `imagen`, `tamano`, `precio` y `cantidad`.
- **`agregarAlCarrito(id, tamano, cantidad)`:**
  - si el producto tiene alcohol, pide confirmar la mayoría de edad con `confirm()` (una sola vez por visita);
  - recorre el arreglo con `for` para ver si ese producto y tamaño ya están; si están, suma la cantidad (sin pasar de 10) y, si no, hace `push`;
  - actualiza el panel, anima el icono (la animación `bump` del Cambio 2) y muestra el aviso.
- **`actualizarCarrito()`** vuelve a dibujar el panel: crea cada fila con `createElement`, calcula subtotal, descuento y total, muestra u oculta el mensaje de carrito vacío y desactiva los botones si no hay productos.
- **Eliminar / vaciar:** piden confirmación con `confirm()` y usan `splice()` para quitar elementos del arreglo.
- **Cupón:** `prompt()` pide un código y un `switch` lo valida. `AROMA10` da 10 % de descuento. `GRANO15` da 15 %, pero solo si el subtotal es de S/30 o más. Si se cancela el `prompt` (devuelve `null`), no pasa nada.
- **Hacer pedido:** `prompt()` pide el nombre, `confirm()` muestra el resumen armado con un `for`, y `alert()` da el número de pedido y el tiempo estimado (5 minutos más 2 por bebida, con un máximo de 30).
- El panel se abre con el icono del encabezado (`onclick="abrirCarrito()"`). Para eso el icono pasó de `<div>` a `<button>`.

```js
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
    carrito.push({ id: producto.id, nombre: producto.nombre, imagen: producto.imagen,
                   tamano: tamano, precio: calcularPrecioSegunTamano(producto.precio, tamano),
                   cantidad: cantidad });
}
```

```js
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
            ...
        case 'GRANO15':
            if (subtotal >= 30) { porcentajeDescuento = 15; ... } else { alert(...); }
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

**Archivos modificados:** `Scripts/carrito.js` (nuevo), `Scripts/main.js` (se quitó el contador antiguo), `index.html` (botón del carrito y panel `#ventanaCarrito`), `Pages/contacto.html` (botón del carrito), `Styles/style.css`.

**Temas aplicados:** arreglos (`push`, `splice`, recorrido), `const` y `let`, `for` y `break`, `if / else if / else`, `switch`, operadores aritméticos (`*`, `/`, `-`, `+`), de asignación (`+=`, `++`), relacionales y lógicos, `alert()`, `confirm()`, `prompt()`, DOM (crear y eliminar elementos, `textContent`, `disabled`, `style.display`), ventanas flotantes.

**Justificación.** El carrito es la parte más natural de una tienda para usar los tres métodos de entrada y salida, y cada uno tiene un propósito claro: `confirm()` evita borrar algo por error, `prompt()` pide un dato corto (cupón o nombre) y `alert()` informa el resultado. Los datos viven en un arreglo y la interfaz se redibuja desde él, para que lo que se ve siempre coincida con los datos. Como el curso no incluye `localStorage`, el carrito se vacía al recargar la página o al ir a contacto. Por eso, en contacto el icono ofrece volver a la carta.

---

### Funcionalidad 7 — Validación del registro y saludo personalizado

**Problema que resuelve.** El modal de registro dependía de la validación automática del navegador y aceptaba, por ejemplo, contraseñas distintas porque no había campo de confirmación.

**Cómo funciona.**
1. El formulario tiene `novalidate` y `onsubmit="validarRegistro(event)"`.
2. `validarRegistro()` evita que la página se recargue (`preventDefault`), limpia los errores anteriores y revisa cada campo con `if`: nombre de 3 letras o más, correo válido, contraseña de 6 caracteres o más y confirmación igual a la contraseña.
3. Los errores se muestran **debajo de cada campo** con `mostrarError()`, que escribe el mensaje y pinta el borde en rojo con la clase `campo-invalido`.
4. Si todo está bien, se cierra el modal, se limpia el formulario y `saludarUsuario()` cambia el botón "Registrarse" del banner por "Hola, Ana". También le quita los atributos que abrían el modal (`removeAttribute`) y le asigna un nuevo `onclick` con un `alert()`.

```js
function esCorreoValido(correo) {
    const posicionArroba = correo.indexOf('@');
    const posicionPunto = correo.lastIndexOf('.');
    return posicionArroba > 0 &&
        posicionPunto > posicionArroba + 1 &&
        posicionPunto < correo.length - 1 &&
        correo.indexOf(' ') === -1;
}

function saludarUsuario(nombre) {
    const botonRegistro = document.getElementById('btn-register');
    botonRegistro.innerHTML = '<i class="fa-solid fa-user"></i> Hola, ' + nombre;
    // Se quitan los atributos que abrían el modal de registro
    botonRegistro.removeAttribute('data-bs-toggle');
    botonRegistro.removeAttribute('data-bs-target');
    botonRegistro.onclick = function (evento) {
        evento.preventDefault();
        alert(nombre + ', ya tienes tu cuenta en Aroma & Grano. ¡Usa el cupón AROMA10 en tu primer pedido!');
    };
}
```

**Archivos modificados:** `Scripts/formularios.js` (nuevo), `index.html` (campo "Confirmar contraseña", `<small class="mensaje-error">`, `novalidate`), `Styles/style.css`.

**Temas aplicados:** `onsubmit`, `if / else if`, operadores lógicos y relacionales, `const`/`let`, DOM (`textContent`, `classList`, `setAttribute`, `removeAttribute`, `innerHTML`), `alert()`, `console.warn`.

**Justificación.** Validar con JavaScript permite mostrar mensajes en español, adaptados a la cafetería y ubicados junto al campo con error. Se mantuvo el modal de Bootstrap porque ya funcionaba bien y el curso no pide reemplazarlo. El cambio del botón muestra cómo se modifican contenido, atributos y eventos de un elemento que ya existe.

---

### Funcionalidad 8 — Validación de reservas, horario por día y lista de reservas

**Problema que resuelve.** El formulario de reservas aceptaba fechas pasadas, horas en que la cafetería está cerrada y teléfonos con letras. Además, el horario de la tarjeta de contacto ("Lunes a domingo 7:00 am – 10:00 pm") no coincidía con el del pie de página y el de las preguntas frecuentes.

**Cómo funciona.**
- `obtenerHorario(dia)` usa un `switch` sobre el día de la semana y devuelve un arreglo `[apertura, cierre]`: lunes a viernes `[7, 21]`, sábado `[8, 22]` y domingo `[8, 18]`. Es el mismo horario del pie de página. La última reserva se acepta una hora antes del cierre.
- Al elegir una fecha (`onchange="mostrarHorarioDelDia()"`) aparece debajo una ayuda como *"El domingo recibimos reservas de 8:00 a 17:00."*
- `validarReserva()` revisa nombre, correo, teléfono, fecha (no puede haber pasado), hora (dentro del horario de ese día y, si la reserva es para hoy, posterior a la hora actual) y número de personas (de 1 a 20). Cuenta los errores con `errores++`.
- `esTelefonoValido()` recorre el número carácter por carácter con un `for`. Salta los espacios con `continue`, rechaza letras comparando con `'0'` y `'9'`, y exige 9 dígitos que empiecen con 9.
- Para más de 8 personas, un `confirm()` avisa que se preparará el salón principal. Luego otro `confirm()` muestra el resumen de la reserva antes de registrarla.
- La reserva se guarda en el arreglo `reservas` y se dibuja en una nueva tarjeta, **"Tus reservas"**, con un botón *Cancelar* que la quita con `splice()` después de un `confirm()`.
- El mensaje tiene un contador de caracteres (`oninput="contarCaracteres()"`) que cambia de color cerca del límite de 200.
- Al cargar la página, el calendario recibe el atributo `min` con la fecha de hoy (`setAttribute`).

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

function esTelefonoValido(telefono) {
    let soloDigitos = '';
    for (let i = 0; i < telefono.length; i++) {
        const caracter = telefono[i];
        if (caracter === ' ') {
            continue; // se ignoran los espacios
        }
        if (caracter < '0' || caracter > '9') {
            return false; // hay una letra o un símbolo
        }
        soloDigitos += caracter;
    }
    return soloDigitos.length === 9 && soloDigitos[0] === '9';
}
```

```js
// Hora: dentro del horario de ese día (la última reserva es 1 hora antes del cierre)
const partesHora = valorHora.split(':');           // "18:30" -> ["18", "30"]
const horaDecimal = parseInt(partesHora[0]) + parseInt(partesHora[1]) / 60;
const horario = obtenerHorario(fechaElegida.getDay());

if (horaDecimal < horario[0] || horaDecimal > horario[1] - 1) {
    mostrarError('hora', 'Ese día recibimos reservas de ' + horario[0] + ':00 a ' + (horario[1] - 1) + ':00.');
    errores++;
}
```

En `contacto.html` se agregaron los `<small>` de error y ayuda, `novalidate`, los eventos `onsubmit`, `onchange` y `oninput`, y el contenedor `.contacto-lateral` que agrupa la información de contacto con la nueva lista de reservas. También se corrigió el horario de la tarjeta para que coincida con el del pie de página.

**Archivos modificados:** `Scripts/formularios.js`, `Pages/contacto.html`, `Styles/style.css`.

**Temas aplicados:** `switch`, `if / else if`, `for` con `continue`, arreglos (devolver `[apertura, cierre]`, `push`, `splice`, arreglo `DIAS_SEMANA`), operadores aritméticos (`/`, `-`, `+`), relacionales, lógicos y de incremento (`++`), `onsubmit`, `onchange`, `oninput`, `confirm()`, DOM (crear y eliminar elementos, `setAttribute`, `style.color`), consola (`console.warn`).

**Justificación.** Las reglas reproducen el funcionamiento real de la cafetería (horario por día y grupos grandes), así que las estructuras de control tienen un motivo concreto. Para leer el día de la semana y comparar fechas se usó el objeto `Date` (`getDay()`, `getHours()`), que no está en la lista de temas, pero es indispensable para validar una fecha. Se usó de forma mínima. Como no se usa `localStorage`, la lista de reservas solo dura mientras la página está abierta.

---

## Pruebas realizadas

Las pruebas se hicieron con un navegador Chromium automatizado (Playwright), con escritorio a 1300 px y celular a 390 px, cargando Bootstrap 5.3.3, Bootstrap Icons 1.11.3 y Font Awesome 6.5.2 en las mismas versiones que usa el proyecto. Se comprobó lo siguiente:

- Inicio: se dibujan 4 destacados y 12 productos en la carta. Los filtros muestran 4 productos por categoría y el orden por precio funciona. La búsqueda "cafe" encuentra los productos con "Café". Una búsqueda sin coincidencias muestra el mensaje de "sin resultados". Con el buscador vacío aparece el `alert`.
- Detalle: los cálculos de tamaño y cantidad son correctos (Cold Brew Grande × 3 = S/19.50). La ventana se cierra con la X, con clic en el fondo y con Escape.
- Carrito: aparece el `confirm` de alcohol al agregar el Café Irish. El contador del encabezado se actualiza. `GRANO15` se aplica con un subtotal de S/32.80 (descuento de S/4.92, total S/27.88). Un código inválido muestra su `alert`. Al cancelar "Vaciar" el carrito no cambia y al aceptar se vacía. "Hacer pedido" (con `prompt` y `confirm`) vacía el carrito y cierra el panel.
- Registro: aparecen los 4 mensajes de error. Con datos válidos se cierra el modal, se muestra el aviso y el botón cambia a "Hola, Ana". Después, ese botón ya no abre el modal.
- Contacto: aparecen los 6 errores de validación. La ayuda del domingo es correcta y una hora fuera de horario se rechaza. Los grupos de 10 personas piden la confirmación adicional. La reserva se agrega a la lista y se puede cancelar. El icono del carrito ofrece ir a la carta.
- Celular: el menú abre y cierra con su botón y se cierra al tocar un enlace. No hay desplazamiento horizontal (ancho del documento = 390 px).
- No apareció ningún error de JavaScript en la consola. Los únicos mensajes rojos en el entorno de prueba fueron recursos externos bloqueados por la red de ese entorno (el kit de Font Awesome y Google Fonts). Con conexión a internet normal esos recursos cargan.

**Limitaciones conocidas:** el carrito, el registro y las reservas no se guardan al recargar, porque el curso no incluye almacenamiento. Las imágenes de productos se reutilizan porque el proyecto solo tiene cuatro fotos de bebidas.

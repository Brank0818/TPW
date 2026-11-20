/* ==========================================================================
   Cambio 5 — Validación de formularios con JavaScript
   - Registro (ventana modal del inicio).
   - Reserva de mesa (página de contacto).
   Los formularios usan "novalidate" para que la validación la haga este código.
   ========================================================================== */

// Nombres de los días: la posición coincide con getDay() (0 = domingo)
const DIAS_SEMANA = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
const MAXIMO_PERSONAS = 20;
const PERSONAS_GRUPO_GRANDE = 8;
const LIMITE_MENSAJE = 200;

// Arreglo con las reservas hechas durante la visita
const reservas = [];


/* ---------- Funciones de apoyo para mostrar errores ---------- */

// Muestra el mensaje debajo del campo y pinta su borde de rojo
function mostrarError(idCampo, mensaje) {
    const campo = document.getElementById(idCampo);
    const textoError = document.getElementById('error-' + idCampo);
    campo.classList.add('campo-invalido');
    campo.setAttribute('aria-invalid', 'true');
    textoError.textContent = mensaje;
}

// Quita el mensaje de error de un campo
function limpiarError(idCampo) {
    const campo = document.getElementById(idCampo);
    const textoError = document.getElementById('error-' + idCampo);
    campo.classList.remove('campo-invalido');
    campo.removeAttribute('aria-invalid');
    textoError.textContent = '';
}

// Quita los errores de varios campos recibidos en un arreglo
function limpiarErrores(listaCampos) {
    for (let i = 0; i < listaCampos.length; i++) {
        limpiarError(listaCampos[i]);
    }
}

// Correo válido: tiene un @ (no al inicio), un punto después del @ y no tiene espacios
function esCorreoValido(correo) {
    const posicionArroba = correo.indexOf('@');
    const posicionPunto = correo.lastIndexOf('.');
    return posicionArroba > 0 &&
        posicionPunto > posicionArroba + 1 &&
        posicionPunto < correo.length - 1 &&
        correo.indexOf(' ') === -1;
}

// Teléfono peruano: 9 dígitos y empieza con 9 (se permiten espacios al escribirlo)
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

// Agrega un 0 a la izquierda: 7 -> "07" (para formar fechas como 2026-05-07)
function dosDigitos(numero) {
    if (numero < 10) {
        return '0' + numero;
    }
    return '' + numero;
}


/* ==========================================================================
   Formulario de registro (index.html)
   ========================================================================== */

function validarRegistro(evento) {
    evento.preventDefault(); // la página no se recarga
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

    if (clave.length < 6) {
        mostrarError('reg-clave', 'La contraseña debe tener al menos 6 caracteres.');
        formularioValido = false;
    }

    if (confirmacion !== clave || confirmacion === '') {
        mostrarError('reg-clave2', 'Las contraseñas no coinciden.');
        formularioValido = false;
    }

    if (!formularioValido) {
        console.warn('Registro con errores: revisa los campos marcados.');
        return;
    }

    // Registro correcto: se cierra el modal de Bootstrap y se personaliza la página
    if (hayBootstrap) {
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalRegistro'));
        if (modal) {
            modal.hide();
        }
    }
    document.getElementById('formRegistro').reset();

    const primerNombre = nombre.split(' ')[0];
    saludarUsuario(primerNombre);
    avisar('¡Bienvenido/a, ' + primerNombre + '! Tu cuenta fue creada.');
}

// Cambia el botón "Registrarse" del banner por un saludo
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


/* ==========================================================================
   Formulario de reserva (contacto.html)
   ========================================================================== */

// Devuelve [hora de apertura, hora de cierre] según el día (mismo horario del pie de página)
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

// Convierte el valor de un <input type="date"> ("2026-05-07") en una fecha
function convertirFecha(valorFecha) {
    return new Date(valorFecha + 'T00:00:00');
}

// Evento onchange del campo fecha: muestra el horario de ese día
function mostrarHorarioDelDia() {
    const valorFecha = document.getElementById('fecha').value;
    const ayuda = document.getElementById('ayuda-fecha');
    if (valorFecha === '') {
        ayuda.textContent = '';
        return;
    }
    const dia = convertirFecha(valorFecha).getDay();
    const horario = obtenerHorario(dia);
    ayuda.textContent = 'El ' + DIAS_SEMANA[dia] + ' recibimos reservas de ' + horario[0] + ':00 a ' +
        (horario[1] - 1) + ':00.';
}

// Evento oninput del mensaje: cuenta los caracteres escritos
function contarCaracteres() {
    const mensaje = document.getElementById('mensaje');
    const contador = document.getElementById('contadorMensaje');
    const escritos = mensaje.value.length;
    contador.textContent = escritos + ' / ' + LIMITE_MENSAJE;

    if (escritos >= LIMITE_MENSAJE - 20) {
        contador.style.color = '#b3261e'; // cerca del límite: color de alerta
    } else {
        contador.style.color = '';
    }
}

function validarReserva(evento) {
    evento.preventDefault();
    limpiarErrores(['nombre', 'correo', 'telefono', 'fecha', 'hora', 'personas']);

    const nombre = document.getElementById('nombre').value.trim();
    const correo = document.getElementById('correo').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const valorFecha = document.getElementById('fecha').value;
    const valorHora = document.getElementById('hora').value;
    const personas = parseInt(document.getElementById('personas').value);
    const mensaje = document.getElementById('mensaje').value.trim();
    let errores = 0;

    // Nombre
    if (nombre.length < 3) {
        mostrarError('nombre', 'Escribe tu nombre completo.');
        errores++;
    }

    // Correo
    if (!esCorreoValido(correo)) {
        mostrarError('correo', 'Escribe un correo válido.');
        errores++;
    }

    // Teléfono
    if (!esTelefonoValido(telefono)) {
        mostrarError('telefono', 'El celular debe tener 9 dígitos y empezar con 9.');
        errores++;
    }

    // Fecha: obligatoria y no puede ser un día que ya pasó
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    let fechaElegida = null;
    if (valorFecha === '') {
        mostrarError('fecha', 'Elige la fecha de tu reserva.');
        errores++;
    } else {
        fechaElegida = convertirFecha(valorFecha);
        if (fechaElegida < hoy) {
            mostrarError('fecha', 'La fecha ya pasó. Elige hoy o un día posterior.');
            errores++;
        }
    }

    // Hora: dentro del horario de ese día (la última reserva es 1 hora antes del cierre)
    if (valorHora === '') {
        mostrarError('hora', 'Elige la hora de tu reserva.');
        errores++;
    } else if (fechaElegida !== null) {
        const partesHora = valorHora.split(':');           // "18:30" -> ["18", "30"]
        const horaDecimal = parseInt(partesHora[0]) + parseInt(partesHora[1]) / 60;
        const horario = obtenerHorario(fechaElegida.getDay());
        const ahora = new Date();
        const esHoy = fechaElegida.getTime() === hoy.getTime();

        if (horaDecimal < horario[0] || horaDecimal > horario[1] - 1) {
            mostrarError('hora', 'Ese día recibimos reservas de ' + horario[0] + ':00 a ' + (horario[1] - 1) + ':00.');
            errores++;
        } else if (esHoy && horaDecimal <= ahora.getHours() + ahora.getMinutes() / 60) {
            mostrarError('hora', 'Esa hora ya pasó. Elige una hora posterior.');
            errores++;
        }
    }

    // Número de personas
    if (isNaN(personas) || personas < 1 || personas > MAXIMO_PERSONAS) {
        mostrarError('personas', 'Entre 1 y ' + MAXIMO_PERSONAS + ' personas.');
        errores++;
    }

    if (errores > 0) {
        console.warn('La reserva tiene ' + errores + ' error(es).');
        return;
    }

    // Los grupos grandes requieren una confirmación adicional
    if (personas > PERSONAS_GRUPO_GRANDE) {
        const aceptaSalon = confirm('Para grupos de más de ' + PERSONAS_GRUPO_GRANDE +
            ' personas preparamos el salón principal y te llamaremos para coordinar.\n¿Deseas continuar?');
        if (!aceptaSalon) {
            return;
        }
    }

    // Resumen final antes de registrar
    const nombreDia = DIAS_SEMANA[fechaElegida.getDay()];
    const fechaTexto = nombreDia + ' ' + dosDigitos(fechaElegida.getDate()) + '/' +
        dosDigitos(fechaElegida.getMonth() + 1) + '/' + fechaElegida.getFullYear();

    const confirmado = confirm('Confirma los datos de tu reserva:\n\n' +
        'Nombre: ' + nombre + '\n' +
        'Fecha: ' + fechaTexto + '\n' +
        'Hora: ' + valorHora + '\n' +
        'Personas: ' + personas + '\n\n¿Todo está correcto?');

    if (!confirmado) {
        return;
    }

    reservas.push({ nombre: nombre, fecha: fechaTexto, hora: valorHora, personas: personas, mensaje: mensaje });
    mostrarReservas();

    document.querySelector('.reserva-form').reset();
    contarCaracteres();
    mostrarHorarioDelDia();
    avisar('Reserva registrada. Te confirmaremos pronto, ' + nombre.split(' ')[0] + '.');
}

// Dibuja la lista "Tus reservas" con un botón para cancelar cada una
function mostrarReservas() {
    const contenedor = document.getElementById('misReservas');
    const lista = document.getElementById('listaReservas');
    lista.innerHTML = '';

    if (reservas.length === 0) {
        contenedor.style.display = 'none';
        return;
    }
    contenedor.style.display = 'block';

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
}

function cancelarReserva(posicion) {
    const reserva = reservas[posicion];
    if (confirm('¿Deseas cancelar la reserva del ' + reserva.fecha + ' a las ' + reserva.hora + '?')) {
        reservas.splice(posicion, 1);
        mostrarReservas();
        avisar('La reserva fue cancelada.');
    }
}

// Al cargar la página de contacto: la fecha mínima del calendario es hoy
const campoFecha = document.getElementById('fecha');
if (campoFecha !== null) {
    const hoy = new Date();
    campoFecha.setAttribute('min', hoy.getFullYear() + '-' + dosDigitos(hoy.getMonth() + 1) + '-' + dosDigitos(hoy.getDate()));
}

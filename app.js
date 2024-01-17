// Variable que mantiene visible el carrito
let carritoVisible = false;

// Esperemos que todos los elementos de la página se carguen para continuar con el script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ready);
} else {
    ready();
}

function ready() {
    // Funcionalidad de los botones de eliminar en el carrito
    const botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for (let i = 0; i < botonesEliminarItem.length; i++) {
        const button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }

    // Aca le agrego funcionalidad al boton de sumar del carrito de compras
    const botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for (let i = 0; i < botonesSumarCantidad.length; i++) {
        const button = botonesSumarCantidad[i];
        button.addEventListener('click', sumarCantidad);
    }

    // Aca le agrego funcionalidad al boton de restar del carrito de compras
    const botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for (let i = 0; i < botonesRestarCantidad.length; i++) {
        const button = botonesRestarCantidad[i];
        button.addEventListener('click', restarCantidad);
    }

    // Aca le agrego funcionalidad a los botones de agregar al carrito de compras
    const botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (let i = 0; i < botonesAgregarAlCarrito.length; i++) {
        const button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    // Aca agrego funcionalidad al botón de pagar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked);
}

// Función para mostrar un mensaje en el carrito
function mostrarMensajeEnCarrito(mensaje) {
    const mensajeElemento = document.createElement('div');
    mensajeElemento.classList.add('mensaje-carrito');
    mensajeElemento.innerText = mensaje;

    const carrito = document.getElementsByClassName('carrito')[0];
    carrito.appendChild(mensajeElemento);

    // Después de 2 segundos, eliminamos el mensaje
    setTimeout(() => {
        mensajeElemento.remove();
    }, 2000);
}

// Para eliminar el ítem seleccionado en el carrito
function eliminarItemCarrito(event) {
    const buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();

    // Para que se actualice el total del carrito cuando se eliminen los items
    actualizarTotalCarrito();

    // Esta función controla si hay elementos en el carrito cuando se haya eliminado si no hay, se oculta el carrito
    ocultarCarrito();

    // Mensaje de confirmación
    mostrarMensajeEnCarrito("Producto eliminado del carrito");
}

// Esta función hará que se actualice el total del carrito
function actualizarTotalCarrito() {
    // Con esta función se selecciona el contenedor del carrito
    const carritoContenedor = document.getElementsByClassName('carrito')[0];
    const carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    let total = 0;

    // Se recorre cada elemento del carrito para actualizar el total
    for (let i = 0; i < carritoItems.length; i++) {
        const item = carritoItems[i];
        const precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        const precio = parseFloat(precioElemento.innerText.replace('$', '').replace('.', ''));
        const cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        const cantidad = cantidadItem.value;
        total = total + (precio * cantidad);
    }
    total = Math.round(total * 100) / 100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ',00';
}

// Aca enlaza la función de ocultar el carrito que está más arriba
function ocultarCarrito() {
    const carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount === 0) {
        const carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        // Luego que se oculte el carrito, esta función hace que los elementos o las cajas se adapten a la pantalla
        const items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

// Aca configuro el elemento de sumar, va aumentar en 1 cada elemento seleccionado
function sumarCantidad(event) {
    const buttonClicked = event.target;
    const selector = buttonClicked.parentElement;
    let cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    // Esto es para que se actualice el total en el carrito
    actualizarTotalCarrito();
}

// Aca configuro el elemento de restar, va a restar en 1 cada elemento seleccionado
function restarCantidad(event) {
    const buttonClicked = event.target;
    const selector = buttonClicked.parentElement;
    let cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual--;
    // Esto es para controlar que no sea menor a 1
    if (cantidadActual >= 1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        // Esto es para que se actualice el total en el carrito
        actualizarTotalCarrito();
    }
}

// Aca voy a darle la funcionalidad a los botones de agregar al carrito de compras
function agregarAlCarritoClicked(event) {
    const button = event.target;
    const item = button.parentElement;
    const titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    const precio = item.getElementsByClassName('precio-item')[0].innerText;
    const imagenSrc = item.getElementsByClassName('img-item')[0].src;
    // Esta función le agrega los elementos al carrito, se envía por parámetros
    agregarItemAlCarrito(titulo, precio, imagenSrc);
    // Hacer visible el carrito una vez que agregue algún elemento
    hacerVisibleCarrito();

    // Mensaje de confirmación
    mostrarMensajeEnCarrito("Producto agregado al carrito");
}

// Parámetros para agregar los elementos al carrito
function agregarItemAlCarrito(titulo, precio, imagenSrc) {
    const item = document.createElement('div');
    item.classList.add('item');
    const itemCarrito = document.getElementsByClassName('carrito-items')[0];

    // En esta función se controla que no se repita el item ya agregado
    const nombresItemsCarrito = itemCarrito.getElementsByClassName('carrito-item-titulo');
    for (let i = 0; i < nombresItemsCarrito.length; i++) {
        if (nombresItemsCarrito[i].innerText === titulo) {
            // Mensaje de alerta
            mostrarMensajeEnCarrito("El producto ya se encuentra en la cesta");
            return;
        }
    }

    // Para que se agregue cada item al carrito
    const itemCarritoContenido = `
        <div class="carrito-item">
            <img src="${imagenSrc}" alt="" width="80px">
            <div class="carrito-item-detalles">
                <span class="carrito-item-titulo">${titulo}</span>
                <div class="selector-cantidad">
                    <i class="fa-solid fa-minus restar-cantidad"></i>
                    <input type="text" value="1" class="carrito-item-cantidad" disabled>
                    <i class="fa-solid fa-plus sumar-cantidad"></i>
                </div>
                <span class="carrito-item-precio">${precio}</span>
            </div>
            <span class="btn-eliminar">
                <i class="fa-solid fa-trash-can"></i>
            </span>
        </div>
    `;
    item.innerHTML = itemCarritoContenido;
    itemCarrito.append(item);

    // Agrego la funcionalidad de eliminar a los nuevos elementos
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

    // Agrego la funcionalidad de sumar a los nuevos elementos
    const botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);

    // Agrego la funcionalidad de restar a los nuevos elementos
    const botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);
}

// Aca agrego los parámetros y la funcionalidad al boton pagar
function pagarClicked(event) {
    // Mensaje de agradecimiento
    mostrarMensajeEnCarrito("¡Gracias por tu compra!");

    // Para que se eliminen los elementos del carrito
    const carritoItems = document.getElementsByClassName('carrito-items')[0];
    while (carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();

    // Función que hará ocultar el carrito
    ocultarCarrito();
}

// Función que hace que el carrito aparezca cuando se agregue elementos
function hacerVisibleCarrito() {
    carritoVisible = true;
    const carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    const items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}
//variable que mantiene visible el carrito
var carritoVisible = false;

//Esperemos que todos los elementos de la pagina se carguen para continuar con el script
if(document.readyState=='loading'){
    document.addEventListener('DOMContentLoaded', ready)
}else{
    ready();
}

function ready(){

    //Funcionalidad de los botones de eliminar en el carrito
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for(var i=0; i < botonesEliminarItem.length;i++){
        var button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }

    //Aca le agrego funcionalidad al boton de sumar del carrito de compras
    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for(var i=0; i < botonesSumarCantidad.length;i++){
        var button = botonesSumarCantidad[i];
        button.addEventListener('click', sumarCantidad);
    }

    //Aca le agrego funcionalidad al boton de restar del carrito de compras
    var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for(var i=0; i < botonesRestarCantidad.length;i++){
        var button = botonesRestarCantidad[i];
        button.addEventListener('click', restarCantidad);
    }

    //Aca le agrego funcionalidad a los botones de agregar al carrito de compras
    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for(var i=0; i<botonesAgregarAlCarrito.length;i++){
        var button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    //Aca agrego funcionalidad al botón de pagar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked)
}

//Para eliminar el item seleccionado en el carrito
function eliminarItemCarrito(event){
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();

    //para que se actualice el total del carrito cuando se eliminen los items
    actualizarTotalCarrito();

    //Esta funcion controla si hay elementos en el carrito cuando se haya eliminado si no hay, se oculta el carrito
    ocultarCarrito();
}

//Esta función hara que se actualice el total del carrito
function actualizarTotalCarrito(){
    //Con esta funcion se selecciona el contenedor del carrito
    var carritoContenedor = document.getElementsByClassName('carrito') [0];
    var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    var total = 0;

    //Se recorre cada elemento del carrito para actualizar el total
    for(var i=0; i < carritoItems.length;i++){
        var item = carritoItems[i];
        var precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        console.log(precioElemento);
        //Ahora se procede a eliminar el simbolo de dinero y el decimal
        var precio = parseFloat(precioElemento.innerText.replace('$','').replace('.',''));
        console.log(precio);
        var cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        var cantidad = cantidadItem.value;
        console.log(cantidad);
        total = total + (precio * cantidad);
    }
    total = Math.round(total*100)/100;
    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ',00';
}

// aca enlaza la funcion de ocultar el carrito que esta mas arriba
function ocultarCarrito(){
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if(carritoItems.childElementCount==0){
        var carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity='0';
        carritoVisible = false;

        //Luego que se oculte el carrito, esta funcion hace que los elementos o las cajas se adapten a la pantalla
        var items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

//Aca configuro el elemento de sumar, va aumentar en 1 cada elemento seleccionado
function sumarCantidad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    console.log(cantidadActual);
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    //esto es para que se actualice el total en el carrito
    actualizarTotalCarrito();
}

//Aca configuro el elemento de restar, va a restar en 1 cada elemento seleccionado
function restarCantidad(event){
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    console.log(cantidadActual);
    cantidadActual--;
    //esto es para controlar que no sea menor a 1
    if(cantidadActual>=1){
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    //esto es para que se actualice el total en el carrito
        actualizarTotalCarrito();
    }
}

//aca voy a darle la funcionalidad a los botones de agregar al carrito de compras
function agregarAlCarritoClicked(event){
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    console.log(titulo);
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;
    console.log(imagenSrc);

    //esta funcion le agrega los elementos al carrito, se envia por parametros
    agregarItemAlCarrito(titulo, precio, imagenSrc);

    //Hacer visible el carrito una vez que agregue algun elemento
    hacerVisibleCarrito();
}

//parametros para agregar los elementos al carrito
function agregarItemAlCarrito(titulo, precio, imagenSrc){
    var item = document.createElement('div');
    item.classList.add = 'item';
    var itemCarrito = document.getElementsByClassName('carrito-items')[0];

    //en esta funcion se contrala que no se repita el item ya agregado
    var nombresItemsCarrito = itemCarrito.getElementsByClassName('carrito-item-titulo');
    for(var i=0; i < nombresItemsCarrito.length;i++){
        if(nombresItemsCarrito[i].innerText==titulo){
            alert("El producto ya se encuentra en la cesta");
            return;
        }
    }
//para que se agregue cada item al carrito
    var itemCarritoContenido = `
    <div class="carrito-item">
        <img src="${imagenSrc}" alt="" width="80px">
        <div class="carrito-item-detalles">
            <span class="carrito-item-titulo">${titulo}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad"></i> <!--esta la saque de esta pagina: https://fontawesome.com/-->
                <input type="text" value="1" class="carrito-item-cantidad" disabled>
                <i class="fa-solid fa-plus sumar-cantidad"></i> <!--esta la saque de esta pagina: https://fontawesome.com/-->
            </div>
            <span class="carrito-item-precio">${precio}</span>
        </div>
        <span class="btn-eliminar">
            <i class="fa-solid fa-trash-can"></i> <!--esta la saque de esta pagina: https://fontawesome.com/-->
        </span>
    </div>
    `
    item.innerHTML = itemCarritoContenido;
    itemCarrito.append(item);

    //Agrego la funcionalidad de eliminar a los nuevos elementos
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click',eliminarItemCarrito);

    //Agrego la funcionalidad de sumar a los nuevos elementos
    var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);

    //Agrego la funcionalidad de restar a los nuevos elementos
    var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);
}

//aca agrego los parametros y la funcionalidad al boton pagar
function pagarClicked(event){
    alert("Gracias por tu compra")
    //para que se eliminen los elementos del carrito
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    while(carritoItems.hasChildNodes()){
        carritoItems.removeChild(carritoItems.firstChild);
    }
    actualizarTotalCarrito();

    //Funcion que hara ocultar el carrito
    ocultarCarrito();
}

//Funcion que hace que el carrito aparezca cuando se agregue elementos
function hacerVisibleCarrito(){
    carritoVisible =true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}
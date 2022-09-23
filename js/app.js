let cliente ={
    mesa:'',
    hora:'',
    pedido:[]
};

const categorias ={
    1: 'comida',
    2: 'bebida',
    3: 'postres'
}

const btnGuardarCliente = document.querySelector('#guardar-cliente');
btnGuardarCliente.addEventListener('click', guardarCliente);

function guardarCliente(){
    const mesa = document.querySelector('#mesa').value;
    const hora = document.querySelector('#hora').value;

    //Revisar si hay campos vacios
    const camposVacios= [ mesa, hora ].some(campo => campo === '');

    if (camposVacios){

        //Verificar error 
        const existeAlerta = document.querySelector('.invalid-feedback');

        if(!existeAlerta){
            const alerta = document.createElement('DIV');
            alerta.classList.add('invalid-feedback', 'd-block', 'text-center');
            alerta.textContent = 'Todos los campos son obligatorios';
            document.querySelector('.modal-body form').appendChild(alerta);
            
            setTimeout(() => {
                alerta.remove
            }, 3000);
        }
            return;
    }
      
    //Asignar datos

    cliente = {...cliente ,mesa, hora, }

    //ocultar modal
    const modalFormulario = document.querySelector('#formulario');
    const modalBootstrap = bootstrap.Modal.getInstance(modalFormulario);
    modalBootstrap.hide();

    //Mostar secciones
    mostrarSecciones();

    //obtener platos de la Api

    obtenerPlatos();

}

function mostrarSecciones(){
    const seccionesOcltas = document.querySelectorAll('.d-none');
    seccionesOcltas.forEach(seccion => seccion.classList.remove('d-none'));
}

function obtenerPlatos(){
    const url = ' http://localhost:4000/Platos'

    fetch(url)
    .then( respuesta => respuesta.json())
    .then(resultado => mostrarPlatos(resultado))
    .cath (error => console.log(error));
    
}

function mostrarPlatos(platos){
    const contenido = document.querySelector('#platos .contenido');

    platos.forEach( platos => {
        const row = document.createElement('DIV');
        row.classList.add('row', 'py-3', 'border-top');

        const nombre = document.createElement('DIV');
        nombre.classList.add('col-md-4');
        nombre.textContent = platos.nombre;

        const precio = document.createElement('DIV');
        precio.classList.add('col-md-3','fw-bold');
        precio.textContent = `€${platos.precio}`;

        const categoria = document.createElement('DIV');
        categoria.classList.add('col-md-3');
        categoria.textContent =categorias[ platos.categoria ];

        const inputCantidad = document.createElement('INPUT');
        inputCantidad.type = 'number';
        inputCantidad.min = 0;
        inputCantidad.value = 0;
        inputCantidad.id =`producto-${platos.id}`;
        inputCantidad.classList.add('form-control');

        //Agregando cantidad de platos
        inputCantidad.onchange = function(){
            const cantidad = parseInt (inputCantidad.value);
            agregarPlato({...platos, cantidad});
        }

        const agregar = document.createElement('DIV');
        agregar.classList.add('col-md-2')
        agregar.appendChild(inputCantidad);


        row.appendChild(nombre);
        row.appendChild(precio);
        row.appendChild(categoria);
        row.appendChild(agregar);
        contenido.appendChild(row);
    })
};

function agregarPlato(producto){
    //Extrae pedido
    let { pedido } = cliente;

    //Revision mayor a 0

    if (producto.cantidad > 0 ){

        //comprueba el elemento true o false con some
        if(pedido.some( articulo => articulo.id === producto.id)){
            const pedidoActalizado = pedido.map(articulo => {
                if( articulo => articulo.id === producto.id){
                    articulo.cantidad = producto.cantidad
                }
                return articulo;
            });
            cliente.pedido =[...pedidoActalizado];
        }else{
            cliente.pedido = [...pedido, producto];
        }
       
    }else {
        // Eliminara elementos cuando la cantidad es 0
        const resultado = pedido.filter(articulo => articulo.id !== producto.id);
        cliente.pedido = [...resultado]
    }
    //limpiar el codigo HTML preio
    limpiarHTML();

    if(cliente.pedido.length){

         //Mostrar el resumen del pedido
    articulosResumen();
    }else{
        mensajePedidoVacio();
    }

   
};

function articulosResumen(){
    const contenido = document.querySelector('#resumen .contenido');
    const resumen = document.createElement('DIV');
    resumen.classList.add('col-md-6', 'card', 'py-5', 'px-3', 'sahdow');

    //informacion de la mesa
    const mesa = document.createElement('P');
    mesa.textContent = 'Mesa: ';
    mesa.classList.add('fw-bold');

    const mesaSpan =document.createElement('SPAN');
    mesaSpan.textContent = cliente.mesa;
    mesaSpan.classList.add('fw-normal');

    //informacion de la hora
    const hora = document.createElement('P');
    hora.textContent = 'hora: ';
    hora.classList.add('fw-bold');

    const horaSpan =document.createElement('SPAN');
    horaSpan.textContent = cliente.hora;
    horaSpan.classList.add('fw-normal');

    //agrgar a los elementos padres
    mesa.appendChild(mesaSpan);
    hora.appendChild(horaSpan);

    //titulo de la seleccion
    const heading = document.createElement('H3');
    heading.textContent = 'Platos consumidos';
    heading.classList.add('my-4', 'text-center');

    //Iterar sobre el array de pedidos
    const group = document.createElement('UL');
    group.classList.add('list-group');

    const { pedido } = cliente;
    pedido.forEach( articulo => {
        const { nombre, cantidad, precio,id } = articulo;

        const lista = document.createElement('LI');
        lista.classList.add('list-group-item');

        const nombreEl = document.createElement('H4');
        nombreEl.classList.add('my-4');
        nombreEl.textContent = nombre;

        //Cantidad dl articulo
        const cantidadEl = document.createElement('P');
        cantidadEl.classList.add('fw-bold');
        cantidadEl.textContent = 'Cantidad: ';

        const cantidadValor = document.createElement('SPAN');
        cantidadValor.classList.add('fw-normal');
        cantidadValor.textContent = cantidad;

      //Preciol articulo
        const precioEl = document.createElement('P');
        precioEl.classList.add('fw-bold');
        precioEl.textContent = 'Precio: ';
     
        const precioValor = document.createElement('SPAN');
        precioValor.classList.add('fw-normal');
        precioValor.textContent = `€${precio}`;

        //Subtoltal del precio
        const subtotalEl = document.createElement('P');
        subtotalEl.classList.add('fw-bold');
        subtotalEl.textContent = 'Subtotal:';
     
        const subtotalValor = document.createElement('SPAN');
        subtotalValor.classList.add('fw-normal');
        subtotalValor.textContent = calcularSubtotal( precio, cantidad );
        //Boton para Eliminar
        const btnEliminar = document.createElement('BUTTON');
        btnEliminar.classList.add('btn', 'btn-danger');
        btnEliminar.textContent = 'Eiminar del pedido';

        //Funcion para eleiminar del pedido
        btnEliminar.onclick = function(){
            eliminarProducto(id)
        };

        // Agrgar valor a sus contenedores
        cantidadEl.appendChild(cantidadValor);
        precioEl.appendChild(precioValor);
        subtotalEl.appendChild(subtotalValor);

        //Agrgar elementos al LI
        lista.appendChild(nombreEl);
        lista.appendChild(cantidadEl);
        lista.appendChild(precioEl);
        lista.appendChild(subtotalEl);
        lista.appendChild(btnEliminar);

        //Agregar al grupo
        group.appendChild(lista);


    });


    //agregar el contenido
    resumen.appendChild(heading);
    resumen.appendChild(mesa);
    resumen.appendChild(hora);
    resumen.appendChild(group);

    contenido.appendChild(resumen);

    //Mostrar fomulari de  propinas
    formularioPropinas();
};

function limpiarHTML(){
    const contenido = document.querySelector('#resumen .contenido');

    while( contenido.firstChild ){
        contenido.removeChild(contenido.firstChild);
    }
};

function calcularSubtotal(precio, cantidad){
        return`€ ${precio * cantidad}`;
}

function eliminarProducto(id){
    const { pedido } = cliente;
    const resultado = pedido.filter(articulo => articulo.id !== id);
    cliente.pedido = [...resultado];

    limpiarHTML();

    if(cliente.pedido.length){

        //Mostrar el resumen del pedido
   articulosResumen();
   }else{
       mensajePedidoVacio();
   };

   // El producto se elimino regresa a 0 a cantidad en formulario
    const productoEliminado = `#producto-${id}`;
    const inputEliminado = document.querySelector(productoEliminado);
    inputEliminado.value = 0;
};

function mensajePedidoVacio(){
    const contenido = document.querySelector('#resumen .contenido');

    const texto =document.createElement('p');
    texto.classList.add('text-center');
    texto.textContent = 'Añade los elementos del pedido';

    contenido.appendChild(texto);
};

function formularioPropinas(){
    const contenido = document.querySelector('#resumen .contenido');

    const formulario = document.createElement('DIV');
    formulario.classList.add('col-md-6', 'formulario');

    const divFormulario = document.createElement('DIV');
    divFormulario.classList.add('card', 'py-2', 'px-3', 'sahdow')

    const heading = document.createElement('H3');
    heading.classList.add('my-4', 'text-center');
    heading.textContent = 'Propinas';
    //Radio button propinas 10%
    const radio0 = document.createElement('INPUT')
    radio0.type ='radio';
    radio0.name = 'popina';
    radio0.value = '0';
    radio0.classList.add('form-check-input');
    radio0.onclick = calcularPropina;

    const radio0Label = document.createElement('LABEL');
    radio0Label.textContent = '0%';
    radio0Label.classList.add('form-check-label');

    const radio0Div = document.createElement('DIV');
    radio0Div.classList.add('form-check');

    //Argar al div pincipal
    radio0Div.appendChild(radio0);
    radio0Div.appendChild(radio0Label)

    //Radio button propinas 10%
    const radio10 = document.createElement('INPUT')
    radio10.type ='radio';
    radio10.name = 'propina';
    radio10.value = '10';
    radio10.classList.add('form-check-input');
    radio10.onclick = calcularPropina;

    const radioLabel = document.createElement('LABEL');
    radioLabel.textContent = '10%';
    radioLabel.classList.add('form-check-label');

    const radio10Div = document.createElement('DIV');
    radio10Div.classList.add('form-check');

    //Argar al div pincipal
    radio10Div.appendChild(radio10);
    radio10Div.appendChild(radioLabel);

    //Radio button propinas 25%
    const radio25 = document.createElement('INPUT')
    radio25.type ='radio';
    radio25.name = 'propina';// ES EL QUE DA ELEGIR UNO
    radio25.value = '25';
    radio25.classList.add('form-check-input');
    radio25.onclick = calcularPropina;


    const radio25Label = document.createElement('LABEL');
    radio25Label.textContent = '25%';
    radio25Label.classList.add('form-check-label');

    const radio25Div = document.createElement('DIV');
    radio25Div.classList.add('form-check');

    //Argar al div pincipal
    radio25Div.appendChild(radio25);
    radio25Div.appendChild(radio25Label);

       //Radio button propinas 50%
       const radio50 = document.createElement('INPUT')
       radio50.type ='radio';
       radio50.name = 'propina';
       radio50.value = '50';
       radio50.classList.add('form-check-input');
       radio50.onclick = calcularPropina;

   
       const radio50Label = document.createElement('LABEL');
       radio50Label.textContent = '50%';
       radio50Label.classList.add('form-check-label');
   
       const radio50Div = document.createElement('DIV');
       radio50Div.classList.add('form-check');
   
       //Argar al div pincipal
       radio50Div.appendChild(radio50);
       radio50Div.appendChild(radio50Label);

    //Agrgarlo al Formulario
    divFormulario.appendChild(heading);  
    divFormulario.appendChild(radio0Div);
    divFormulario.appendChild(radio10Div);
    divFormulario.appendChild(radio25Div);
    divFormulario.appendChild(radio50Div);
    formulario.appendChild(divFormulario);

    contenido.appendChild(formulario);

};

function calcularPropina(){
    
    const { pedido } = cliente;
    let subtotal = 0;

    //Calcualar el subtotal a pagar
    pedido.forEach( articulo => {

        subtotal += articulo.cantidad * articulo.precio;

    });
    // selecionar conla propina
    const propinaSeleccionada = document.querySelector('[name="propina"]:checked').value;

    // Calcular la propina
    const propina = ((subtotal * parseInt (propinaSeleccionada)) / 100);

    //Calcular el total a pagar
    const total = subtotal + propina;

    mostrarTotalHtml(subtotal, total, propina);
};

function mostrarTotalHtml( subtotal, total, propina ){


    const totaDIV = document.createElement('DIV');
    totaDIV.classList.add('total-pagar');

    //Subtotal Html

    const subtotalHTML = document.createElement('P');
    subtotalHTML.classList.add('fs-4','fw-bold', 'mt-2');
    subtotalHTML.textContent = 'Subtotal Consumo: ';

    const subtotalSpan = document.createElement('SPAN');
    subtotalSpan.classList.add('fw-normal');
    subtotalSpan.textContent = `€ ${subtotal}`;

    subtotalHTML.appendChild(subtotalSpan);
  

    //Propinna Html

    const propinaHTML = document.createElement('P');
    propinaHTML.classList.add('fs-4','fw-bold', 'mt-2');
    propinaHTML.textContent = 'propina: ';

    const propinaSpan = document.createElement('SPAN');
    propinaSpan.classList.add('fw-normal');
    propinaSpan.textContent = `€ ${propina}`;

    propinaHTML.appendChild(propinaSpan);

     //Total Html

     const totalHTML = document.createElement('P');
     totalHTML.classList.add('fs-4','fw-bold', 'mt-2');
     totalHTML.textContent = 'total a pagar: ','my-5';
 
     const totalSpan = document.createElement('SPAN');
     totalSpan.classList.add('fw-normal');
     totalSpan.textContent = `€ ${total}`;
 
     totalHTML.appendChild(totalSpan);
 
    //Eliminarel Ultimo resultado:
    const totalApagarDiv = document.querySelector('.total-pagar');
    if(totalApagarDiv){
        totalApagarDiv.remove();
    }

    totaDIV.appendChild(subtotalHTML);
    totaDIV.appendChild(propinaHTML);
    totaDIV.appendChild(totalHTML);


    const formulario = document.querySelector('.formulario > div');
    formulario.appendChild(totaDIV);

}


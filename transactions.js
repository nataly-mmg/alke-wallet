
// FORMATO DE DINERO
function formatoDinero(valor) {
    return "$" + Number(valor).toLocaleString("es-CL");
}

// MENSAJES EN PANTALLA
function mostrarOk(texto) {
    const ok = document.getElementById("mensajeOk");
    const err = document.getElementById("mensajeError");
    err.classList.add("d-none");
    ok.textContent = texto;
    ok.classList.remove("d-none");
}

function ocultarMensajes() {
    document.getElementById("mensajeOk").classList.add("d-none");
    document.getElementById("mensajeError").classList.add("d-none");
    document.getElementById("mensajeOk").textContent = "";
    document.getElementById("mensajeError").textContent = "";
}

// ESTADO 
let saldo = 60000;
let movimientos = [];

movimientos = [
    {
        tipo: "deposito",
        texto: "Depósito - $50.000"
    },
    {
        tipo: "transferencia_recibida",
        texto: "Transferencia recibida de Erica - $15.000"
    },
    {
        tipo: "compra",
        texto: "Compra en supermercado - $12.000"
    }
];

let usandoFicticios = true;

const saldoNav = document.getElementById("saldoNav");
const listaMov = document.getElementById("listaMovimientos");




function renderSaldo() {
    saldoNav.textContent = formatoDinero(saldo);
}

renderSaldo();


  // NUEVO: traducir tipo a texto
  function getTipoTransaccion(tipo) {
    switch (tipo) {
      case "compra": return "Compra";
      case "deposito": return "Depósito";
      case "transferencia_recibida": return "Transferencia recibida";
      default: return "Movimiento";
    }
  }

  // NUEVO: mostrar últimos movimientos según filtro
  function mostrarUltimosMovimientos(filtro) {
    // limpiar lista
    $("#listaMovimientos").empty();

    // filtrar
    let filtrados = movimientos;

    if (filtro && filtro !== "todos") {
      filtrados = movimientos.filter(m => m.tipo === filtro);
    }

    // si no hay movimientos para mostrar
    if (filtrados.length === 0) {
      $("#listaMovimientos").append(`
        <li class="list-group-item text-center text-secondary" id="sinMovimientos">
          Aún no tienes movimientos aquí
        </li>
      `);
      return;
    }

    // mostrar (ya están guardados en orden: últimos primero)
    filtrados.forEach(m => {
      $("#listaMovimientos").append(`
        <li class="list-group-item">
          <strong>${getTipoTransaccion(m.tipo)}:</strong> ${m.texto}
        </li>
      `);
    });
  }


 // NUEVO: guardar movimiento con tipo
function agregarMovimiento(tipo, texto) {

  // BORRAR LISTA FICTICIA AL PRIMER MOVIMIENTO REAL
  if (usandoFicticios) {
    movimientos = [];          // borra los ficticios del arreglo
    usandoFicticios = false;   // desde ahora son movimientos reales
  }

  // insertar al inicio (últimos primero)
  movimientos.unshift({ tipo, texto });

  // render según filtro actual seleccionado
  const filtroActual = $("#filtroMovimientos").val() || "todos";
  mostrarUltimosMovimientos(filtroActual);
  }



  // Render inicial (sin movimientos)
  mostrarUltimosMovimientos("todos");




// MODAL
const modalDeposito = new bootstrap.Modal($("#modalDeposito")[0]);
const modalTransferencia = new bootstrap.Modal($("#modalTransferencia")[0]);
const modalCompra = new bootstrap.Modal($("#modalCompra")[0]);


// ABRIR MODAL DEPÓSITO

$("#btnAbrirDeposito").on("click", function () {
    ocultarMensajes();
    $("#montoDeposito").val("");
    $("#errorDeposito").text("");
    modalDeposito.show();
});




// ABRIR MODAL TRANSFERENCIA
$("#btnAbrirTransferencia").on("click", function () {
    ocultarMensajes();
    $("#destinoTransferencia").val("");
    $("#montoTransferencia").val("");
    $("#errorTransferencia").text("");
    modalTransferencia.show();
});



// ABRIR MODAL COMPRA
$("#btnAbrirCompra").on("click", function () {
    ocultarMensajes();
    $("#detalleCompra").val("");
    $("#montoCompra").val("");
    $("#errorCompra").text("");
    modalCompra.show();
});

// CONFIRMAR DEPÓSITO
$("#btnConfirmarDeposito").on("click", function () {

    const monto = parseInt($("#montoDeposito").val());
    $("#errorDeposito").text("");

    if (isNaN(monto) || monto <= 0) {
        $("#errorDeposito").text("Ingresa un monto válido.");
        return;
    }

    saldo += monto;
    renderSaldo();
    agregarMovimiento("deposito", "Depósito - " + formatoDinero(monto));

    modalDeposito.hide();
    mostrarOk("Depósito realizado");

    setTimeout(() => {
        ocultarMensajes();
    }, 1000);
});




// Confirmar modalTransferencia

  $("#btnConfirmarTransferencia").on("click", function () {
    const destino = $("#destinoTransferencia").val().trim();
    const monto = parseInt($("#montoTransferencia").val());
    $("#errorTransferencia").text("");

    if (!destino) {
      $("#errorTransferencia").text("Ingresa el nombre del destinatario.");
      return;
    }
    if (isNaN(monto) || monto <= 0) {
      $("#errorTransferencia").text("Ingresa un monto válido.");
      return;
    }
    if (monto > saldo) {
      $("#errorTransferencia").text("Saldo insuficiente.");
      return;
    }

    saldo -= monto;
    renderSaldo();
    agregarMovimiento("transferencia_recibida", "Transferencia recibida de " + destino + " - " + formatoDinero(monto));


    modalTransferencia.hide();
    mostrarOk("Transferencia enviada ");
    setTimeout(() => {
        ocultarMensajes();
    }, 1000); // 1 segundo
});


// CONFIRMAR COMPRA (jQuery)
$("#btnConfirmarCompra").on("click", function () {

    const detalle = $("#detalleCompra").val().trim();
    const monto = parseInt($("#montoCompra").val());
    $("#errorCompra").text("");

    if (!detalle) {
        $("#errorCompra").text("Ingresa una descripción.");
        return;
    }

    if (isNaN(monto) || monto <= 0) {
        $("#errorCompra").text("Ingresa un monto válido.");
        return;
    }

    if (monto > saldo) {
        $("#errorCompra").text("Saldo insuficiente.");
        return;
    }

    // descontar saldo
    saldo -= monto;
    renderSaldo();

    // agregar movimiento (IMPORTANTE: 2 parámetros tipo y texto)
    agregarMovimiento("compra", "Compra - " + detalle + " - " + formatoDinero(monto));

    modalCompra.hide();
    mostrarOk("Compra registrada");

    setTimeout(() => {
        ocultarMensajes();
    }, 1000);
});




// Filtro de movimientos

  $("#filtroMovimientos").on("change", function () {
    const filtro = $(this).val();
    mostrarUltimosMovimientos(filtro);
  });



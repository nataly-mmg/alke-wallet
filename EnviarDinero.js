$(function () {


    // CONFIRMACIÓN DE CARGA DEL ARCHIVO

    console.log("EnviarDinero.js cargado correctamente");


    // VARIABLES GLOBALES

    let saldo = parseInt(localStorage.getItem("saldo")) || 60000;
    localStorage.setItem("saldo", saldo);

    let $contactoSeleccionado = null;

    const formatoDinero = (valor) =>
        "$" + Number(valor).toLocaleString("es-CL");

    $("#saldoNav").text(formatoDinero(saldo));


    // MODALES BOOTSTRAP

    const modalContacto = new bootstrap.Modal(
        document.getElementById("modalContacto")
    );

    const modalMonto = new bootstrap.Modal(
        document.getElementById("modalMonto")
    );


    // MOSTRAR / OCULTAR AGENDA

    $("#btnMostrarAgenda").on("click", function () {
        $("#agendaContainer").toggleClass("d-none");

        const abierta = !$("#agendaContainer").hasClass("d-none");

        $(this)
            .toggleClass("btn-primary btn-secondary")
            .text(abierta ? "Ocultar agenda" : "Buscar en la agenda de contactos");

        // Reset visual
        $("#buscarcontacto").val("");
        $("#ListaContactos li").show();
        $("#btnEnviarDinero").addClass("d-none");

        if ($contactoSeleccionado) {
            $contactoSeleccionado.removeClass("border border-primary");
            $contactoSeleccionado = null;
        }
    });


    // ABRIR MODAL AGREGAR CONTACTO

    $("#btnNuevoContacto").on("click", function () {
        $("#alert-container").html("");
        modalContacto.show();
    });


    // ALERTAS BOOTSTRAP

    function mostrarAlerta(mensaje, tipo) {
        $("#alert-container").html(`
      <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `);
    }

    function mostrarAlertaContacto(mensaje, tipo) {
    $("#alert-contacto").html(`
      <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `);
}

    // VALIDACIÓN CBU

    function validarCBU(cbu) {
        return /^[0-9]{6,}$/.test(cbu);
    }

    // GUARDAR CONTACTO

    $("#btnGuardarContacto").on("click", function () {

        const nombre = $("#contactoNombre").val().trim();
        const cbu = $("#contactoCBU").val().trim();
        const alias = $("#contactoAlias").val().trim();
        const banco = $("#contactoBanco").val().trim();

        if (!nombre || !cbu || !alias || !banco) {
            mostrarAlertaContacto("Debes completar todos los datos del contacto.", "danger");
            return;
        }

        if (!validarCBU(cbu)) {
            mostrarAlertaContacto("El CBU debe tener al menos 6 números.", "danger");
            return;
        }

        $("#ListaContactos").append(`
      <li class="list-group-item" data-alias="${alias}">
        <div class="contact-info d-flex justify-content-between">
          <span class="contact-name">${nombre}</span>
          <span class="contact-alias fw-semibold">Alias: ${alias}</span>
        </div>
      </li>
    `);

        // LIMPIAR CAMPOS
        $("#contactoNombre").val("");
        $("#contactoCBU").val("");
        $("#contactoAlias").val("");
        $("#contactoBanco").val("");

        mostrarAlerta("Contacto agregado correctamente.", "success");
        modalContacto.hide();




        
    });


    // BUSCAR EN AGENDA (NOMBRE O ALIAS)

    $("#buscarcontacto").on("input", function () {

        const termino = $(this).val().toLowerCase().trim();

        let hayCoincidencias = false;

        $("#ListaContactos li").each(function () {
            const nombre = $(this).find(".contact-name").text().toLowerCase();
            const alias = ($(this).data("alias") || "").toLowerCase();

            const coincide = nombre.includes(termino) || alias.includes(termino);

            $(this).toggle(coincide);

            if (coincide) hayCoincidencias = true;
        });

        // Si el campo está vacío, no mostrar mensaje
        if (termino === "") {
            $("#msgNoExiste").addClass("d-none");
            return;
        }

        // Mostrar / ocultar mensaje según coincidencias
        if (!hayCoincidencias) {
            $("#msgNoExiste").removeClass("d-none");
            $("#btnEnviarDinero").addClass("d-none"); // opcional: esconder enviar si no hay resultados
        } else {
            $("#msgNoExiste").addClass("d-none");
        }
    });


    // SELECCIONAR CONTACTO

    $("#ListaContactos").on("click", "li", function () {

        if ($contactoSeleccionado) {
            $contactoSeleccionado.removeClass("border border-primary");
        }

        $contactoSeleccionado = $(this);
        $contactoSeleccionado.addClass("border border-primary");

        $("#btnEnviarDinero").removeClass("d-none");
    });


    // ABRIR MODAL ENVÍO DE DINERO

    $("#btnEnviarDinero").on("click", function () {

        if (!$contactoSeleccionado) {
            mostrarAlerta("Debes seleccionar un contacto.", "danger");
            return;
        }

        $("#montoEnviar").val("");
        $("#errorMonto").text("");
        $("#confirmacionEnvio").text("");
        $("#alert-container").html("");

        modalMonto.show();
    });


    // CONFIRMAR ENVÍO

    $("#btnConfirmarEnvio").on("click", function () {

        const monto = parseInt($("#montoEnviar").val());
        $("#errorMonto").text("");

        if (isNaN(monto) || monto <= 0) {
            $("#errorMonto").text("Ingresa un monto válido.");
            return;
        }

        if (monto > saldo) {
            $("#errorMonto").text("Saldo insuficiente.");
            return;
        }

        const nombre =
            $contactoSeleccionado.find(".contact-name").text() || "contacto";

        saldo -= monto;
        localStorage.setItem("saldo", saldo);
        $("#saldoNav").text(formatoDinero(saldo));

        modalMonto.hide();

        $("#confirmacionEnvio").text(
            `Envío realizado con éxito a ${nombre} por ${formatoDinero(monto)}.`
        );

        mostrarAlerta("Transferencia realizada correctamente.", "success");
    });

});

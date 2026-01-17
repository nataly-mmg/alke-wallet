
// mostrar el saldo actual (Local Storage + jquery)

$(function () {
    let saldo = parseInt(localStorage.getItem("saldo")) || 60000;
    localStorage.setItem("saldo", saldo);

    const formatoDinero = (valor) => "$" + Number(valor).toLocaleString("es-CL");

    $('#saldoNav').text(formatoDinero(saldo));


    // alerta Bootstrap para confirmar que el depósito fue realizado con éxito.

    function mostrarAlerta(mensaje, tipo) {
        $('#alert-container').html(`
      <div class="alert alert-${tipo} alert-dismissible fade show" role="alert">
        ${mensaje}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
      </div>
    `);
    }

    // redirección al menú principal

    $('form').submit(function (e) {
        e.preventDefault();

        const $btn = $("#btnDeposito");
        const $input = $("#depositAmount");
        const monto = parseInt($input.val());


        // limpiar mensajes anteriores
        $('#mensajeDeposito').text("");
        $('#alert-container').html("");


        // Validación
        if (isNaN(monto) || monto <= 0) {
            mostrarAlerta('Ingrese un monto válido', 'danger');



            // efecto visual simple: "shake" del formulario
            $('form').addClass("shake");
            setTimeout(() => $('form').removeClass("shake"), 350);

            return;
        }


        // Efecto visual: deshabilitar botón + spinner
        $btn.prop("disabled", true);
        const textoOriginal = $btn.text();
        $btn.html(`<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Procesando...`);

        // Simulación breve para que se note el efecto visual
        setTimeout(() => {




            // Actualizar saldo
            saldo += monto;
            localStorage.setItem("saldo", saldo);
            $('#saldoNav').text(formatoDinero(saldo));

            // Mostrar leyenda debajo del formulario
            $('#mensajeDeposito').text('Monto depositado: ' + formatoDinero(monto));

            // Mostrar alerta Bootstrap de éxito
            mostrarAlerta('Depósito realizado con éxito', 'success');

            // Limpiar campo
            $input.val('');

            // Restaurar botón (por si alcanzas a verlo antes del redirect)
            $btn.prop("disabled", false);
            $btn.text(textoOriginal);

            // Redirección con retraso de 2 segundos
            setTimeout(() => {
                window.location.href = 'menu.html';
            }, 2000);

        }, 600); // 0.6 seg para efecto visual
    });
});
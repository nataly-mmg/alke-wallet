
// mostrar el saldo actual (Local Storage + jquery)

$(function () {
  let saldo = parseInt(localStorage.getItem("saldo")) || 60000;
  localStorage.setItem("saldo", saldo);
  $('#saldoNav').text('$' + saldo);


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

    const monto = parseInt($('#depositAmount').val());

    if (isNaN(monto) || monto <= 0) {
      mostrarAlerta('Ingrese un monto válido', 'danger');
      return;
    }

    // Actualizar saldo
    saldo += monto;
    localStorage.setItem("saldo", saldo);
    $('#saldoNav').text('$' + saldo);

    // Mostrar leyenda debajo del formulario
    $('#mensajeDeposito').text('Monto depositado: $' + monto);

    // Mostrar alerta Bootstrap de éxito
    mostrarAlerta('Depósito realizado con éxito', 'success');

    // Limpiar campo
    $('#depositAmount').val('');

    // Redirección con retraso de 2 segundos
    setTimeout(() => {
      window.location.href = 'menu.html';
    }, 2000);
  });

  // Reiniciar saldo al abrir la pantalla Depositar
  localStorage.setItem("saldo", 60000);


});


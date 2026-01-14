

// BOTONES
const btnDepositar = document.getElementById("btnDepositar");

const btnEnviar = document.getElementById("btnEnviar");
const btnMovimientos = document.getElementById("btnMovimientos");

// MENSAJE
const mensaje = document.getElementById("mensaje");

// FUNCIÓN SIMPLE PARA REDIRIGIR
function redirigir(texto, pagina) {
 if (mensaje) mensaje.textContent = "Redirigiendo a " + texto + "...";
    setTimeout(() => {
      window.location.href = pagina;
    }, 1200);
  }

// EVENTOS
if (btnDepositar) {
    btnDepositar.addEventListener("click", () => {
      redirigir("Depósito", "Depositar.html");
    });
  }

  if (btnEnviar) {
    btnEnviar.addEventListener("click", () => {
      redirigir("Enviar dinero", "EnviarDinero.html");
    });
  }

  if (btnMovimientos) {
    btnMovimientos.addEventListener("click", () => {
      redirigir("Últimos movimientos", "UltimosMovimientos.html");
    });
  }
  
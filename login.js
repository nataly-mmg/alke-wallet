

$(document).ready(function () {

// Alertas bootstrap

   function mostrarAlerta(mensaje, tipo) {
        const alertaHTML = `
            <div class="alert alert-${tipo} alert-dismissible fade show mt-3" role="alert">
                ${mensaje}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        `;
        $('#liveAlertPlaceholder').html(alertaHTML);
    }




// Formulario

 $('#loginForm').submit(function (e) {
        e.preventDefault(); 

        // Obtener valores 
        const email = $('#email').val();
        const password = $('#password').val();

        // Limpiar alertas anteriores
        $('#liveAlertPlaceholder').html('');

        // Validación 
        if (email === '' || password === '') {
            mostrarAlerta('Debe completar todos los campos', 'danger');
            return;
        }

        // login
        if (email === 'admin@correo.cl' && password === '1234') {
            mostrarAlerta('Inicio de sesión exitoso', 'success');

            setTimeout(function () {
                window.location.href = 'menu.html';
            }, 1200);
        } else {
            mostrarAlerta('Correo o contraseña incorrectos', 'danger');
        }
    });

});
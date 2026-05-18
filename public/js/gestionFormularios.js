// public/js/gestionFormularios.js

(function () {

    //Validación y gestión global de formularios: preservar datos tras errores, validar inputs, bloquear scripts, mostrar errores visuales y toggle de contraseñas.
    // recoger todos los formularios de la página
    const forms = document.querySelectorAll('form');

    // Si no existen formularios, terminar ejecución
    if (!forms.length) return;
    //sanitizar inputs: 
    function limpiarInput(valor) {
        return valor
            .replace(/<script.*?>.*?<\/script>/gi, '')
            .replace(/[<>]/g, '')
            .replace(/['";]/g, '')
            .trim();
    }
    //Inyección sql 
    function contienePatronesPeligrosos(valor) {
        const patronesPeligrosos = [
            /<script>/i,
            /javascript:/i,
            /onerror=/i,
            /onload=/i,

            /SELECT.*FROM/i,
            /INSERT.*INTO/i,
            /DELETE.*FROM/i,
            /DROP TABLE/i,
            /UNION SELECT/i,
            /--/i
        ];
        return patronesPeligrosos.some(regex => regex.test(valor));
    }
    //alerts: 
    function mostrarErrorFormulario(form, mensaje) {
        let errorBox = form.querySelector('.error-formulario');
        // Crear contenedor si no existe
        if (!errorBox) {
            errorBox = document.createElement('div');
            errorBox.className =
                'alert alert-danger error-formulario mb-3';
            form.prepend(errorBox);
        }
        errorBox.textContent = mensaje;
    }
    //eliminnar contenido formulario: 
    function limpiarErrores(form) {
        const errorBox =
            form.querySelector('.error-formulario');
        if (errorBox) {
            errorBox.remove();
        }
    }


    forms.forEach(form => {
        //clave para sessionStorage: única por ruta y acción del formulario
        const storageKey =
            `form-preserve:${window.location.pathname}:${form.action}`;
        const errorExists =
            !!document.querySelector('.alert-danger');
        const inputs = Array.from(
            form.querySelectorAll('input[name]')
            //no recoger contrasenia o ocultos: 
        ).filter(input =>
            input.type !== 'password' &&
            input.type !== 'hidden'
        );

        function rellenarFormulario(savedData) {
            if (!savedData) return;
            try {
                const values = JSON.parse(savedData);
                inputs.forEach(input => {
                    if (values[input.name] !== undefined) {
                        input.value = values[input.name];
                    }
                });
            } catch (error) {
                console.error(
                    'Error al recuperar datos del formulario:',
                    error
                );
            }
        }

        if (errorExists) {
            rellenarFormulario(
                sessionStorage.getItem(storageKey)
            );
        } else {
            sessionStorage.removeItem(storageKey);
        }

        //cuando se envie el formulario sanitizar y validar:
        form.addEventListener('submit', (e) => {
            // Limpiar errores anteriores
            limpiarErrores(form);
            let valido = true;
            // Objeto para guardar datos
            const valoresFormulario = {};
            inputs.forEach(input => {
                // Sanitizar valor
                input.value = limpiarInput(input.value);
                // Guardar valor
                valoresFormulario[input.name] = input.value;
                //longitud
                if (input.value.length > 100) {
                    valido = false;
                }
                if (contienePatronesPeligrosos(input.value)) {
                    valido = false;
                }
            });

            if (!valido) {
                e.preventDefault();
                mostrarErrorFormulario(form, 'Se han detectado caracteres o contenido no permitido.');
                return;
            }

            sessionStorage.setItem(
                storageKey,
                JSON.stringify(valoresFormulario)
            );
        });

        //gestion de contraseñas: toggle de visibilidad
        const toggleButtons = form.querySelectorAll('.password-toggle');
        toggleButtons.forEach(button => {
            const targetSelector =
                button.dataset.target;

            const input = targetSelector
                ? form.querySelector(targetSelector)
                : button.previousElementSibling;

            const icon = button.querySelector('i');

            if (!input || !icon) return;


            // visibilidad contraseña: cambiar tipo input e icono
            button.addEventListener('click', () => {
                const isPassword =
                    input.type === 'password';
                input.type = isPassword ? 'text' : 'password';

                icon.classList.toggle('fa-eye');

                icon.classList.toggle('fa-eye-slash');

                button.title =
                    isPassword
                        ? 'Ocultar contraseña'
                        : 'Mostrar contraseña';
            });

        });

    });

})();
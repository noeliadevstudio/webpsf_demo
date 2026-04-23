(function() {
    //para preservar los datos del formulario en caso de error, usando sessionStorage
    const form = document.querySelector('form');
    if (!form) return;
    //Almacena datos formulario 
    const storageKey = `form-preserve:${window.location.pathname}`;
    // Verificar si hay un mensaje de error en la página
    const errorExists = !!document.querySelector('.alert-danger');
    // Obtener los inputs del formulario, excluyendo los de tipo password
    const inputs = Array.from(form.querySelectorAll('input[name]')).filter(input => input.type !== 'password');

    const formRelleno = (saved) => {
        if (!saved) return;
        try {
            // Parsear los datos guardados y rellenar los inputs    
            const values = JSON.parse(saved);
            inputs.forEach(input => {
                if (values[input.name] !== undefined) {
                    input.value = values[input.name];
                }
            });
        } catch (error) {
            console.error('Error', error);
        }
    };

    if (errorExists) {
        formRelleno(sessionStorage.getItem(storageKey));
    } else {
        sessionStorage.removeItem(storageKey);
    }

    form.addEventListener('submit', () => {
        const values = {};
        inputs.forEach(input => {
            values[input.name] = input.value;
        });
        sessionStorage.setItem(storageKey, JSON.stringify(values));
    });

    // Función para mostrar/ocultar contraseña
    const passwordInputs = form.querySelectorAll('input[type="password"]'); //esto cambiar por el elemntby
    passwordInputs.forEach(input => {
        const toggleButton = document.createElement('button');
        toggleButton.type = 'button';
        toggleButton.className = 'btn btn-outline-secondary btn-sm ms-2';
        toggleButton.innerHTML = '👁️'; // Icono de ojo
        toggleButton.title = 'Mostrar/ocultar contraseña';

        toggleButton.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            toggleButton.innerHTML = isPassword ? '🙈' : '👁️'; // Cambiar icono
            toggleButton.title = isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña';
        });

        // Insertar el botón después del input
        input.parentNode.insertBefore(toggleButton, input.nextSibling);
    });
})();

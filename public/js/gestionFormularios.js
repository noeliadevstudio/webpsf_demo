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
        // Si hay un error, intentar rellenar el formulario con los datos guardados
        formRelleno(sessionStorage.getItem(storageKey));
    } else {
        // Si no hay error, limpiar los datos guardados para evitar rellenar con datos antiguos
        sessionStorage.removeItem(storageKey);
    }
// Guardar datos del formulario en sessionStorage al enviar
    form.addEventListener('submit', () => {
        const values = {};
        inputs.forEach(input => {
            values[input.name] = input.value;
        });
        sessionStorage.setItem(storageKey, JSON.stringify(values));
    });

    // Función para mostrar/ocultar contraseña con iconos
    const toggleButtons = form.querySelectorAll('.password-toggle');
    toggleButtons.forEach(button => {
        const targetSelector = button.dataset.target;
        const input = targetSelector ? form.querySelector(targetSelector) : button.previousElementSibling;
        const icon = button.querySelector('i');
        if (!input || !icon) return;

        button.addEventListener('click', () => {
            const isPassword = input.type === 'password';
            input.type = isPassword ? 'text' : 'password';
            icon.classList.toggle('fa-eye');
            icon.classList.toggle('fa-eye-slash');
            button.title = isPassword ? 'Ocultar contraseña' : 'Mostrar contraseña';
        });
    });
})();

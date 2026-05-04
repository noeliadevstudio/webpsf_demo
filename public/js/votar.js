document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.votar-btn').forEach(btn => {
        btn.addEventListener('click', async function(e) {
             e.preventDefault();
            let jugadorId = this.getAttribute('data-jugador-id');
            jugadorId = parseInt(jugadorId, 10);
            try {
                const response = await fetch('/votar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ id_jugador: jugadorId }),
                });
                const text = await response.text();
                console.log('Respuesta /votar status', response.status, 'body', text);
                let data;
                try {
                    data = JSON.parse(text);
                } catch (parseError) {
                    console.error('No se pudo parsear JSON:', parseError, text);
                    alert('Error al votar: respuesta inválida del servidor.');
                    return;
                }
                if (data.success) {
                    alert('¡Voto registrado!');
                    location.reload(); // Recargar para actualizar estrellas
                } else {
                    alert(data.error || 'Error al votar.');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al votar.');
            }
        });
    });
});
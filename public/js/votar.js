//Manejo de votación de jugadores: 
//escuchar DOM: 
document.addEventListener('DOMContentLoaded', function() {
    // Agregar evento click a cada botón de votar
    document.querySelectorAll('.votar-btn').forEach(btn => {
        // Obtener id del jugador html 
        btn.addEventListener('click', async function(e) {
             e.preventDefault();
            let jugadorId = this.getAttribute('data-jugador-id');
            jugadorId = parseInt(jugadorId, 10);
            try {
                // Enviar voto al servidor
                const response = await fetch('/votar', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    body: JSON.stringify({ id_jugador: jugadorId }),
                });
                // Leer respuesta como texto para depuración
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
                    //QUITAR ALERTS!! QUE SALGAN EN LA PAGINA, NO EN VENTANAS EMERGENTES
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
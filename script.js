// ========== MENÚ MÓVIL ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });
}

// Cerrar menú al hacer click en un enlace
document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});

// ========== SCROLL SUAVE ==========
document.querySelectorAll('a[href^="#"]').forEach(enlace => {
    enlace.addEventListener('click', (e) => {
        e.preventDefault();
        const destino = document.querySelector(enlace.getAttribute('href'));
        if (destino) {
            destino.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== FORMULARIO DE RESERVA ==========
const formReserva = document.getElementById('formReserva');
const mensaje = document.getElementById('mensaje');

formReserva.addEventListener('submit', (e) => {
    e.preventDefault();

    // Obtener datos
    const nombre = document.getElementById('nombre').value.trim();
    const telefono = document.getElementById('telefono').value.trim();
    const email = document.getElementById('email').value.trim();
    const servicio = document.getElementById('servicio').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;

    // Validaciones
    if (!nombre || !telefono || !email || !servicio || !fecha || !hora) {
        mostrarMensaje('⚠️ Por favor completa todos los campos', false);
        return;
    }

    // Validar que la fecha no sea pasada
    const hoy = new Date().toISOString().split('T')[0];
    if (fecha < hoy) {
        mostrarMensaje('⚠️ La fecha no puede ser en el pasado', false);
        return;
    }

    // Mostrar mensaje de carga
    mostrarMensaje('⏳ Enviando reserva...', true);

    // 👇 1. ENVIAR LOS DATOS A RENDER (BACKEND + MONGODB) 👇
    const urlServidor = 'https://backend-ba.onrender.com/api/reservas'; 

    fetch(urlServidor, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            nombre, 
            telefono, 
            email, 
            servicio, 
            fecha, 
            hora 
        })
    })
    .then(response => {
        if (response.ok) {
            console.log('Reserva guardada en MongoDB 🎉');
            
            // 👇 2. REDIRIGIR A WHATSAPP CON EL MENSAJE 👇
            const miNumero = "573105440765"; // ⚠️ Pon aquí tu número real sin el +
            const textoMensaje = `¡Hola Belleza Angelical! Quiero reservar una cita.%0A%0A*Nombre:* ${nombre}%0A*Teléfono:* ${telefono}%0A*Correo:* ${email}%0A*Servicio:* ${servicio}%0A*Fecha:* ${fecha}%0A*Hora:* ${hora}`;
            
            // Abrir WhatsApp
            window.open(`https://wa.me/${miNumero}?text=${textoMensaje}`, '_blank');

            // Mensaje de éxito en la página
            mostrarMensaje(
                `✅ ¡Reserva confirmada!\n${nombre}, te esperamos el ${formatearFecha(fecha)} a las ${hora} para tu ${servicio}.`,
                true
            );
            
            formReserva.reset();
        } else {
            throw new Error('Error en el servidor');
        }
    })
    .catch(error => {
        console.error('Error:', error);
        mostrarMensaje('❌ Hubo un error al guardar la reserva. Por favor intenta de nuevo.', false);
    });
    // 👆 FIN DEL ENVÍO 👆
});

// Función para mostrar mensajes en pantalla
function mostrarMensaje(texto, esExito) {
    if (!mensaje) return;
    
    mensaje.textContent = texto;
    mensaje.style.display = 'block';
    mensaje.className = 'mensaje'; // Resetea clases
    
    if (esExito) {
        mensaje.style.background = '#e8f5e9';
        mensaje.style.color = '#2e7d32';
    } else {
        mensaje.style.background = '#ffebee';
        mensaje.style.color = '#c62828';
    }
    
    // Si es un mensaje de error o éxito final, lo ocultamos en 6 segundos
    if (texto !== '⏳ Enviando reserva...') {
        setTimeout(() => {
            mensaje.style.display = 'none';
        }, 8000);
    }
}

// Formatear fecha AAAA-MM-DD a DD/MM/AAAA
function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
}

// ========== FECHA MÍNIMA = HOY ==========
const inputFecha = document.getElementById('fecha');
if (inputFecha) {
    const hoy = new Date().toISOString().split('T')[0];
    inputFecha.setAttribute('min', hoy);
}

// ========== ANIMACIÓN AL SCROLL ==========
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, { threshold: 0.1 });

document.querySelectorAll('.card, .info-contacto > div').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});
// ========== MENÚ MÓVIL ==========
const menuToggle = document.getElementById('menuToggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

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

    // Guardar en localStorage (simulación de reserva)
    const reserva = { nombre, telefono, email, servicio, fecha, hora };
    const reservas = JSON.parse(localStorage.getItem('reservas') || '[]');
    reservas.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservas));

    // Crear el mensaje para WhatsApp
const miNumero = "573105440765"; // 👈 Pon aquí TU número con el código de país (57 para Colombia) sin el símbolo +
const textoMensaje = `¡Hola Belleza Angelical! Quiero reservar una cita.%0A%0A*Nombre:* ${nombre}%0A*Teléfono:* ${telefono}%0A*Servicio:* ${servicio}%0A*Fecha:* ${fecha}%0A*Hora:* ${hora}`;

// Abrir WhatsApp en una pestaña nueva
window.open(`https://wa.me/${miNumero}?text=${textoMensaje}`, '_blank');
    // Mostrar mensaje
    mostrarMensaje(
        `✅ ¡Reserva confirmada!\n${nombre}, te esperamos el ${formatearFecha(fecha)} a las ${hora} para tu ${servicio}.`,
        true
    );

    formReserva.reset();

    console.log('📋 Reserva guardada:', reserva);
});

function mostrarMensaje(texto, esExito) {
    mensaje.textContent = texto;
    mensaje.className = 'mensaje' + (esExito ? ' exito' : '');
    mensaje.style.display = 'block';
    mensaje.style.background = esExito ? '#e8f5e9' : '#ffebee';
    mensaje.style.color = esExito ? '#2e7d32' : '#c62828';
    
    setTimeout(() => {
        mensaje.style.display = 'none';
    }, 6000);
}

function formatearFecha(fecha) {
    const [anio, mes, dia] = fecha.split('-');
    return `${dia}/${mes}/${anio}`;
}

// ========== FECHA MÍNIMA = HOY ==========
const inputFecha = document.getElementById('fecha');
const hoy = new Date().toISOString().split('T')[0];
inputFecha.setAttribute('min', hoy);

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
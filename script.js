let registros = [];
let modoEdicion = false;

// Cargar registros al iniciar
document.addEventListener('DOMContentLoaded', () => {
    cargarRegistros();
    document.getElementById('btnCancelarEdicion').style.display = 'none';
});

// Cargar desde localStorage
function cargarRegistros() {
    registros = JSON.parse(localStorage.getItem('pieCorreos') || '[]');
    renderizarLista(registros);
}

// Renderizar lista (con filtro opcional)
function renderizarLista(lista) {
    const contenedor = document.getElementById('listaRegistros');
    contenedor.innerHTML = '';

    if (lista.length === 0) {
        contenedor.innerHTML = '<p>No hay registros que coincidan con la búsqueda.</p>';
        return;
    }

    lista.forEach((reg, index) => {
        const div = document.createElement('div');
        div.className = 'registro';
        div.innerHTML = `
            <strong>${reg.nombre}</strong><br>
            ${reg.cargo}<br>
            ${reg.area}<br>
            ${reg.celular} | ${reg.email}<br>
            <button onclick="editarRegistro(${index})">Editar</button>
            <button onclick="eliminarRegistro(${index})" style="background:#d32f2f;">Eliminar</button>
        `;
        contenedor.appendChild(div);
    });
}

// Filtrar registros
function filtrarRegistros() {
    const termino = document.getElementById('busqueda').value.toLowerCase().trim();
    if (!termino) {
        renderizarLista(registros);
        return;
    }

    const filtrados = registros.filter(r =>
        r.nombre.toLowerCase().includes(termino) ||
        r.cargo.toLowerCase().includes(termino)
    );
    renderizarLista(filtrados);
}

// Editar registro
function editarRegistro(index) {
    const reg = registros[index];
    document.getElementById('nombre').value = reg.nombre;
    document.getElementById('cargo').value = reg.cargo;
    document.getElementById('area').value = reg.area;
    document.getElementById('celular').value = reg.celular;
    document.getElementById('email').value = reg.email;
    document.getElementById('registroIndex').value = index;

    document.getElementById('btnCancelarEdicion').style.display = 'inline-block';
    modoEdicion = true;

    // Desplazar a formulario
    document.getElementById('formulario').scrollIntoView({ behavior: 'smooth' });
}

// Cancelar edición
function cancelarEdicion() {
    limpiarFormulario();
    modoEdicion = false;
    document.getElementById('btnCancelarEdicion').style.display = 'none';
}

// Limpiar formulario
function limpiarFormulario() {
    document.getElementById('formulario').reset();
    document.getElementById('registroIndex').value = '';
}

// Generar pie de correo
function generarPie() {
    const nombre = document.getElementById('nombre').value.trim();
    const cargo = document.getElementById('cargo').value.trim();
    const area = document.getElementById('area').value.trim();
    const celular = document.getElementById('celular').value.trim();
    const email = document.getElementById('email').value.trim();

    if (!nombre || !cargo || !area || !celular || !email) {
        alert("Por favor, complete todos los campos.");
        return;
    }

    const index = document.getElementById('registroIndex').value;

    if (modoEdicion && index !== '') {
        // Actualizar registro existente
        registros[parseInt(index)] = { nombre, cargo, area, celular, email };
        localStorage.setItem('pieCorreos', JSON.stringify(registros));
        alert("Registro actualizado correctamente.");
    } else {
        // Nuevo registro
    
const nuevoRegistro = {
    id: Date.now(), // o usa crypto.randomUUID() si prefieres
    nombre,
    cargo,
    area,
    celular,
    email
};
registros.push(nuevoRegistro);



        
    }

    // Generar PNG
    generarPNG(nombre, cargo, area, celular, email);

    // Resetear interfaz
    limpiarFormulario();
    modoEdicion = false;
    document.getElementById('btnCancelarEdicion').style.display = 'none';
    cargarRegistros();
}

function generarPNG(nombre, cargo, area, celular, email) {
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    // Configurar alta resolución
    const scale = 2;
    const width = 600;
    const height = 140; // Reducido ligeramente por el menor interlineado

    canvas.width = width * scale;
    canvas.height = height * scale;
    ctx.scale(scale, scale);

    // Fondo blanco
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, width, height);

    const logo = new Image();
    logo.src = 'logo.png';

    logo.onload = function() {
        const logoHeight = 110; // Ajustado ligeramente para equilibrar espacio
        const logoWidth = (logo.width / logo.height) * logoHeight;
        const logoY = (height - logoHeight) / 2;

        ctx.drawImage(logo, 10, logoY, logoWidth, logoHeight);

        // Línea separadora
        const lineaX = 10 + logoWidth + 10;
        ctx.beginPath();
        ctx.moveTo(lineaX, 8);
        ctx.lineTo(lineaX, height - 8);
        ctx.lineWidth = 1;
        ctx.strokeStyle = '#333';
        ctx.stroke();

        // Texto
        const textStartX = lineaX + 15;
        const lineHeight = 15; // ⬅️ REDUCIDO DE 17 A 15 PX (2 puntos menos)
        let y = 28; // Ajustado para compensar altura total

        // Nombre
        ctx.font = 'bold 16px Arial';
        ctx.fillStyle = '#333';
        ctx.fillText(nombre, textStartX, y);
        y += lineHeight + 2; // Menos espacio entre líneas

        // Cargo con barra vertical de énfasis
        ctx.font = 'bold 14px Arial';
        ctx.fillStyle = '#2e7d32';
        const barraX = textStartX - 8;
        const barraWidth = 3;
        const barraHeight = 14;
        const barraY = y - 12;
        ctx.fillRect(barraX, barraY, barraWidth, barraHeight);
        ctx.fillText(cargo, textStartX, y);
        y += lineHeight + 2;

        // Área
        ctx.fillStyle = '#333';
        ctx.font = '14px Arial';
    ctx.fillText("Área: " + area.replace(/^Área:\s*/i, ""), textStartX, y);
        y += lineHeight + 2;

        // Celular
        ctx.fillText("Cel. " + celular.replace(/^Cel\.\s*/, ""), textStartX, y);
        y += lineHeight + 2;

        // Email
        ctx.fillStyle = '#4a4aff';
        ctx.fillText("E-mail: " + email.replace(/^E\-mail:\s*/, ""), textStartX, y);

        // Descargar PNG
        canvas.toBlob(function(blob) {
            saveAs(blob, `${nombre.replace(/\s+/g, '_')}_pie_correo_HD.png`);
        }, 'image/png', 1.0);
    };

    logo.onerror = function() {
        alert("⚠️ No se pudo cargar el logo. Asegúrate de que 'logo.png' esté en la carpeta.");
    };
}

// Eliminar registro
function eliminarRegistro(index) {
    if (confirm("¿Está seguro de eliminar este registro?")) {
        registros.splice(index, 1);
        localStorage.setItem('pieCorreos', JSON.stringify(registros));
        cargarRegistros();
    }
}
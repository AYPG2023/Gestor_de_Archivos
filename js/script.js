// Datos globales para almacenar los archivos
let archivos = {
    expedientes: [], // Carpeta para almacenar los archivos
};

let paginaActual = 1;
const registrosPorPagina = 11; // Número de archivos por página

// Manejar la subida de archivos
function subirArchivos(event) {
    event.preventDefault(); // Prevenir el comportamiento predeterminado del formulario

    const input = document.getElementById('fileInput');
    if (input.files.length === 0) {
        alert('¡No se han seleccionado archivos!');
        return;
    }

    const formData = new FormData();
    Array.from(input.files).forEach(archivo => {
        formData.append('files[]', archivo);
    });

    // Enviar los archivos al servidor
    fetch('upload.php', {
        method: 'POST',
        body: formData
    })
        .then(response => response.json())
        .then(data => {
            if (data.every(item => item.success)) {
                alert('Archivos subidos con éxito');
                cargarArchivosDesdeServidor(); // Cargar archivos desde el servidor
            } else {
                alert('Error al subir archivos:\n' + data.map(item => item.message).join('\n'));
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });

    input.value = ''; // Limpiar el input después de la subida
}

// Cargar archivos desde el servidor y renderizarlos
function cargarArchivosDesdeServidor() {
    fetch('listar_archivos.php') // Asumiendo que este archivo PHP lista los archivos subidos
        .then(response => response.json())
        .then(data => {
            if (data.success === false) {
                alert(data.message);
                return;
            }
            archivos.expedientes = data.archivos; // Almacena los archivos recibidos del servidor
            paginaActual = 1; // Reiniciar la página actual
            renderizarListaArchivos(); // Renderizar la lista de archivos
        })
        .catch(error => {
            console.error('Error al cargar archivos:', error);
        });
}

// Renderizar la lista de archivos en la tabla
function renderizarListaArchivos() {
    const listaArchivos = document.getElementById('fileList');
    listaArchivos.innerHTML = ''; // Limpiar la lista actual

    // Calcular el inicio y el fin de la página actual
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    const archivosPaginados = archivos.expedientes.slice(inicio, fin);

    archivosPaginados.forEach(archivo => {
        const fila = `<tr>
            <td>${archivo.nombre}</td>
            <td>${obtenerVistaPreviaHTML(archivo)}</td>
            <td>${archivo.fecha}</td>
            <td>${(archivo.tamano / (1024 * 1024)).toFixed(2)} MB</td>
            <td class="botones-accion">
                <button class="button-action" onclick="verArchivo('${archivo.url}', '${archivo.tipo}')">Ver</button>
                <button class="button-action" onclick="descargarArchivo('${archivo.url}', '${archivo.nombre}')">Descargar</button>
            </td>
        </tr>`;
        listaArchivos.innerHTML += fila;
    });

    actualizarPaginacion(); // Actualizar la paginación
}

// Generar HTML para la vista previa del archivo
function obtenerVistaPreviaHTML(archivo) {
    if (archivo.tipo.startsWith('image/')) {
        return `<img src="${archivo.url}" class="file-preview" alt="${archivo.nombre}">`;
    } else if (archivo.tipo === 'application/pdf') {
        return `<embed src="${archivo.url}" class="file-preview" type="application/pdf">`;
    } else {
        return `<span>Sin vista previa</span>`;
    }
}

// Ver archivo en una nueva pestaña o ventana
function verArchivo(url, tipoArchivo) {
    if (tipoArchivo.startsWith('image/') || tipoArchivo === 'application/pdf') {
        window.open(url, '_blank'); // Abre el archivo en una nueva pestaña
    } else {
        alert('No se puede mostrar una vista previa de este tipo de archivo.');
    }
}

// Descargar archivo
function descargarArchivo(url, nombreArchivo) {
    const a = document.createElement('a');
    a.href = url;
    a.download = nombreArchivo;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Filtrar archivos en la lista
function filtrarArchivos() {
    const busqueda = document.getElementById('buscar').value.toLowerCase();
    const listaFiltrada = archivos.expedientes.filter(archivo =>
        archivo.nombre.toLowerCase().includes(busqueda)
    );

    paginaActual = 1; // Reiniciar a la primera página
    renderizarListaFiltrada(listaFiltrada); // Renderizar la lista filtrada
}

// Renderizar lista filtrada
function renderizarListaFiltrada(listaFiltrada) {
    const listaArchivos = document.getElementById('fileList');
    listaArchivos.innerHTML = '';

    listaFiltrada.forEach(archivo => {
        const fila = `<tr>
            <td>${archivo.nombre}</td>
            <td>${obtenerVistaPreviaHTML(archivo)}</td>
            <td>${archivo.fecha}</td>
            <td>${(archivo.tamano / (1024 * 1024)).toFixed(2)} MB</td>
            <td class="botones-accion">
                <button class="button-action" onclick="verArchivo('${archivo.url}', '${archivo.tipo}')">Ver</button>
                <button class="button-action" onclick="descargarArchivo('${archivo.url}', '${archivo.nombre}')">Descargar</button>
            </td>
        </tr>`;
        listaArchivos.innerHTML += fila;
    });
}

// Ordenar archivos por nombre, tamaño o fecha
function ordenarArchivos(criterio) {
    archivos.expedientes.sort((a, b) => {
        if (criterio === 'name') {
            return a.nombre.localeCompare(b.nombre);
        } else if (criterio === 'size') {
            return a.tamano - b.tamano;
        } else if (criterio === 'date') {
            return new Date(b.fecha) - new Date(a.fecha);
        }
    });
    paginaActual = 1; // Reiniciar a la primera página después de ordenar
    renderizarListaArchivos(); // Renderiza la lista después de ordenar
}

// Cambiar la página de archivos
function cambiarPagina(direccion) {
    paginaActual += direccion;
    renderizarListaArchivos(); // Volver a renderizar archivos para la nueva página
}

// Actualizar la paginación
function actualizarPaginacion() {
    const totalPaginas = Math.ceil(archivos.expedientes.length / registrosPorPagina);
    document.getElementById('pageInfo').innerText = `Página ${paginaActual} de ${totalPaginas}`;
    document.getElementById('prevPage').disabled = paginaActual === 1;
    document.getElementById('nextPage').disabled = paginaActual === totalPaginas;
}

// Cargar archivos al cargar la página
window.onload = cargarArchivosDesdeServidor;
